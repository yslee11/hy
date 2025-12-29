import React from 'react';

const EndPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 fade-in">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">설문이 완료되었습니다!</h2>
        <p className="text-gray-600 mb-8">
          소중한 시간을 내어 설문에 참여해주셔서 진심으로 감사드립니다. 
          여러분의 응답은 도시경관 연구에 큰 도움이 됩니다.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="text-sm text-gray-400 hover:text-gray-600 underline"
        >
          처음으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default EndPage;