import React from 'react';

const Class101Report = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <section>
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-indigo-500 text-white p-2 rounded-lg text-xs font-bold">📦</span>
          <h2 className="text-xl font-black text-slate-800">물류 기반 올인원 교육 솔루션</h2>
        </div>
        <div className="bg-slate-900 p-8 rounded-3xl text-white mb-8 shadow-xl shadow-slate-900/10">
          <h3 className="text-indigo-400 text-xs font-black uppercase tracking-widest mb-2">Core Concept</h3>
          <p className="text-xl font-black leading-snug">
            클래스101은 <span className="text-indigo-400">"콘텐츠 + 준비물(키트)"</span>의 결합을 통해 
            학습자가 즉시 결과물을 만들어낼 수 있는 완결성 있는 경험을 제공합니다.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-indigo-500 text-white p-2 rounded-lg text-xs font-bold">1</span>
            <h2 className="text-lg font-black text-slate-800">물류 및 배송 시스템</h2>
          </div>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">준비물 키트 배송 자동화</h4>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">강의 결제 시 해당 강의에 매칭된 교구재가 자동으로 물류 센터에 출고 요청되는 API 연동 체계.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">실시간 배송 추적 API</h4>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">학습자 대시보드 내에서 배송 상태를 실시간으로 확인하여 "학습 준비" 상태를 관리.</p>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-indigo-500 text-white p-2 rounded-lg text-xs font-bold">2</span>
            <h2 className="text-lg font-black text-slate-800">정산 및 강사 대시보드</h2>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 h-full">
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-black text-indigo-500 shadow-sm">분</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">분 단위 시청 정산</h4>
                  <p className="text-xs text-slate-400 mt-1">학습자의 실제 시청 시간에 비례하여 강사에게 수익을 자동 배분.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-black text-indigo-500 shadow-sm">📈</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">이탈 구간 분석</h4>
                  <p className="text-xs text-slate-400 mt-1">강의 영상 중 학습자가 가장 많이 이탈하는 구간을 데이터로 제공.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-indigo-500 text-white p-2 rounded-lg text-xs font-bold">3</span>
          <h2 className="text-xl font-black text-slate-800">수익 모델 및 요금제</h2>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
            <div className="text-xs font-black text-indigo-500 mb-2">SUBSCRIPTION</div>
            <h4 className="font-bold text-slate-900 mb-2">Class101+</h4>
            <p className="text-xs text-slate-400">모든 디지털 클래스를 무제한으로 수강할 수 있는 구독 모델.</p>
          </div>
          <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
            <div className="text-xs font-black text-emerald-500 mb-2">COMMERCE</div>
            <h4 className="font-bold text-slate-900 mb-2">키트 판매</h4>
            <p className="text-xs text-slate-400">디지털 콘텐츠와 별도로 물리적 준비물을 판매하여 객단가 상승.</p>
          </div>
          <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
            <div className="text-xs font-black text-blue-500 mb-2">B2B BUNDLE</div>
            <h4 className="font-bold text-slate-900 mb-2">기업 전용관</h4>
            <p className="text-xs text-slate-400">임직원 대상 복지 형태의 B2B 라이브러리 구독 서비스.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Class101Report;
