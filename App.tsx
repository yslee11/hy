import React, { useState, useEffect } from 'react';
import { AppState, Demographics, SurveyResponse, QUESTIONS } from './types';
import { LOCAL_STORAGE_KEY } from './constants';
import { getImagesForGroup } from './services/imageService';
import { fetchGroupAssignment, submitSurveyResults } from './services/api';
import StartPage from './components/StartPage';
import SurveyPage from './components/SurveyPage';
import EndPage from './components/EndPage';

const INITIAL_STATE: AppState = {
  step: 'START',
  demographics: { gender: '', age: '', job: '' },
  assignedGroup: null,
  images: [],
  currentImageIndex: 0,
  responses: [],
  isSubmitting: false,
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setState(parsed);
      } catch (e) {
        console.error("Failed to parse saved state", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    if (isInitialized) {
      if (state.step === 'FINISH') {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } else {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
      }
    }
  }, [state, isInitialized]);

  const handleDemographicsChange = (field: keyof Demographics, value: string) => {
    setState(prev => ({
      ...prev,
      demographics: { ...prev.demographics, [field]: value }
    }));
  };

  const startSurvey = async () => {
    setState(prev => ({ ...prev, isSubmitting: true }));
    
    // 1. Get Group Allocation from Backend (Stratified Logic)
    const groupId = await fetchGroupAssignment(state.demographics);
    const images = getImagesForGroup(groupId);
    
    // 2. Initialize Empty Responses
    const initialResponses: SurveyResponse[] = images.map(id => ({
      imageId: id,
      aesthetics: null,
      stability: null,
      identity: null,
      depression: null,
      boredom: null
    }));

    setState(prev => ({
      ...prev,
      step: 'SURVEY',
      assignedGroup: groupId,
      images,
      responses: initialResponses,
      currentImageIndex: 0,
      isSubmitting: false
    }));
  };

  const handleSurveyAnswer = (field: keyof SurveyResponse, value: number) => {
    const newResponses = [...state.responses];
    newResponses[state.currentImageIndex] = {
      ...newResponses[state.currentImageIndex],
      [field]: value
    };
    setState(prev => ({ ...prev, responses: newResponses }));
  };

  const nextImage = async () => {
    if (state.currentImageIndex < state.images.length - 1) {
      setState(prev => ({ ...prev, currentImageIndex: prev.currentImageIndex + 1 }));
      window.scrollTo(0, 0);
    } else {
      // Finish Survey
      await submitData();
    }
  };

  const prevImage = () => {
    if (state.currentImageIndex > 0) {
      setState(prev => ({ ...prev, currentImageIndex: prev.currentImageIndex - 1 }));
      window.scrollTo(0, 0);
    }
  };

  const submitData = async () => {
    if (!state.assignedGroup) return;

    setState(prev => ({ ...prev, isSubmitting: true }));
    
    const success = await submitSurveyResults(
      state.demographics, 
      state.responses, 
      state.assignedGroup
    );

    if (success) {
      setState(prev => ({ ...prev, step: 'FINISH', isSubmitting: false }));
    } else {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  if (!isInitialized) return null;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {state.step === 'START' && (
        <StartPage 
          demographics={state.demographics} 
          onChange={handleDemographicsChange} 
          onNext={startSurvey}
          isLoading={state.isSubmitting}
        />
      )}

      {state.step === 'SURVEY' && state.images.length > 0 && (
        <SurveyPage
          imageId={state.images[state.currentImageIndex]}
          currentIndex={state.currentImageIndex}
          totalImages={state.images.length}
          response={state.responses[state.currentImageIndex]}
          onAnswer={handleSurveyAnswer}
          onNext={nextImage}
          onPrev={prevImage}
          isFirst={state.currentImageIndex === 0}
          isLast={state.currentImageIndex === state.images.length - 1}
        />
      )}

      {state.step === 'FINISH' && <EndPage />}

      {state.isSubmitting && state.step !== 'START' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
           <div className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-4">
             <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
             <p className="font-medium">데이터 저장 중입니다...</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;