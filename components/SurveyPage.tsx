import React, { useState } from 'react';
import { SurveyResponse, QUESTIONS, LikertValue } from '../types';
import { getImageUrl } from '../services/imageService';
import ProgressBar from './ProgressBar';

interface Props {
  imageId: string;
  currentIndex: number;
  totalImages: number;
  response: SurveyResponse | undefined;
  onAnswer: (field: keyof SurveyResponse, value: number) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const SurveyPage: React.FC<Props> = ({ 
  imageId, 
  currentIndex, 
  totalImages, 
  response, 
  onAnswer, 
  onNext, 
  onPrev,
  isFirst,
  isLast
}) => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = getImageUrl(imageId);

  // Check if all questions are answered for this image
  const isComplete = QUESTIONS.every(q => response && response[q.key as keyof SurveyResponse] !== null);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 fade-in pb-20">
      <ProgressBar current={currentIndex + 1} total={totalImages} />

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        {/* Image Section */}
        <div className="w-full bg-gray-100 relative min-h-[300px] md:min-h-[400px] flex items-center justify-center">
          {!imageError ? (
            <img 
              src={imageUrl} 
              alt={`Landscape ${imageId}`} 
              className="w-full h-auto max-h-[60vh] object-contain"
              onError={() => setImageError(true)}
              loading="eager"
            />
          ) : (
             <div className="text-center p-8 text-gray-500">
                <p className="text-4xl mb-2">🖼️</p>
                <p>이미지를 불러올 수 없습니다.</p>
                <p className="text-xs mt-2 text-gray-400">ID: {imageId}</p>
             </div>
          )}
          <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm">
            Image ID: {imageId}
          </div>
        </div>

        {/* Questions Section */}
        <div className="p-6 md:p-8 space-y-8">
          <p className="text-gray-600 text-sm border-l-4 border-blue-500 pl-3">
            위 이미지를 보고 느껴지는 감정을 1점(전혀 그렇지 않다)에서 5점(매우 그렇다) 사이로 평가해주세요.
          </p>

          <div className="space-y-6">
            {QUESTIONS.map((q) => {
              const currentValue = response ? response[q.key as keyof SurveyResponse] as LikertValue : null;
              
              return (
                <div key={q.key} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                  <div className="mb-3 font-medium text-gray-800">{q.label}</div>
                  <div className="flex justify-between items-center gap-1">
                    <span className="text-xs text-gray-400 w-12 text-left hidden sm:block">매우 낮음</span>
                    <div className="flex-1 flex justify-between max-w-md mx-auto">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <label key={val} className="flex flex-col items-center cursor-pointer group">
                          <input
                            type="radio"
                            name={`${imageId}-${q.key}`}
                            value={val}
                            checked={currentValue === val}
                            onChange={() => onAnswer(q.key as keyof SurveyResponse, val)}
                            className="sr-only"
                          />
                          <div className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border-2 transition-all duration-200
                            ${currentValue === val 
                              ? 'bg-blue-600 border-blue-600 text-white shadow-md scale-110' 
                              : 'bg-white border-gray-300 text-gray-500 group-hover:border-blue-300 group-hover:bg-blue-50'
                            }`}>
                            {val}
                          </div>
                        </label>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 w-12 text-right hidden sm:block">매우 높음</span>
                  </div>
                  <div className="flex justify-between sm:hidden mt-2 px-2">
                    <span className="text-xs text-gray-400">매우 낮음</span>
                    <span className="text-xs text-gray-400">매우 높음</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 flex justify-between items-center z-10 sm:static sm:bg-transparent sm:border-0 sm:mt-8">
         <button
            onClick={onPrev}
            disabled={isFirst}
            className={`px-6 py-2 rounded-lg font-medium text-gray-600 transition-colors
              ${isFirst ? 'opacity-0 cursor-default' : 'hover:bg-gray-200 bg-gray-100'}`}
          >
            이전
          </button>
          
          <button
            onClick={onNext}
            disabled={!isComplete}
            className={`px-8 py-3 rounded-lg font-semibold text-white shadow-md transition-all
              ${!isComplete 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform active:scale-95'}`}
          >
            {isLast ? '설문 제출하기' : '다음 이미지'}
          </button>
      </div>
    </div>
  );
};

export default SurveyPage;