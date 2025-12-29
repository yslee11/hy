import React from 'react';
import { Demographics, Gender, AgeGroup, Job } from '../types';

interface Props {
  demographics: Demographics;
  onChange: (field: keyof Demographics, value: string) => void;
  onNext: () => void;
  isLoading: boolean;
}

const StartPage: React.FC<Props> = ({ demographics, onChange, onNext, isLoading }) => {
  const isValid = demographics.gender && demographics.age && demographics.job;

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 fade-in">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">도시경관 인식 설문조사</h1>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <p className="font-semibold">⚠️ 공지사항</p>
          <p>본 설문 결과는 도시 경관 연구 목적에만 사용되며, 그 외의 용도로는 사용되지 않습니다.</p>
        </div>
      </header>

      <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6 md:p-8 space-y-8">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">참여자 정보</h2>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">성별</label>
          <div className="flex gap-4">
            {Object.values(Gender).map((g) => (
              <label key={g} className={`flex-1 relative border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors ${demographics.gender === g ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-300'}`}>
                <input 
                  type="radio" 
                  name="gender" 
                  value={g} 
                  checked={demographics.gender === g} 
                  onChange={(e) => onChange('gender', e.target.value)}
                  className="sr-only"
                />
                <div className="text-center w-full">{g}</div>
              </label>
            ))}
          </div>
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">연령대</label>
          <div className="grid grid-cols-3 gap-3">
            {Object.values(AgeGroup).map((age) => (
              <label key={age} className={`relative border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors text-center ${demographics.age === age ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-300'}`}>
                <input 
                  type="radio" 
                  name="age" 
                  value={age} 
                  checked={demographics.age === age} 
                  onChange={(e) => onChange('age', e.target.value)}
                  className="sr-only"
                />
                <span className="text-sm">{age}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Job */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">직업</label>
          <select 
            value={demographics.job} 
            onChange={(e) => onChange('job', e.target.value)}
            className="block w-full rounded-lg border-gray-300 border p-3 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="" disabled>선택해주세요</option>
            {Object.values(Job).map((job) => (
              <option key={job} value={job}>{job}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={onNext}
          disabled={!isValid || isLoading}
          className={`px-8 py-3 rounded-lg font-semibold text-white shadow-md transition-all 
            ${!isValid || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'}`}
        >
          {isLoading ? '설문 준비 중...' : '설문 시작하기'}
        </button>
      </div>
    </div>
  );
};

export default StartPage;