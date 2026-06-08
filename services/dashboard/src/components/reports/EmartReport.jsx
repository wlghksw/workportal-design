import React from 'react';

const EmartReport = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <section>
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-indigo-500 text-white p-2 rounded-lg text-xs font-bold">📍</span>
          <h2 className="text-xl font-black text-slate-800">지점 기반 O2O 통합 관리</h2>
        </div>
        <div className="grid grid-cols-3 gap-6 mb-8">
          {[
            { l: '전국 지점', v: '100+', d: '관리 어드민 통합' },
            { l: '연간 수강생', v: '120만+', d: '누적 데이터 기반' },
            { l: '강좌 수', v: '12만+', d: '학기당 운영 기준' }
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
              <div className="text-2xl font-black text-indigo-500">{item.v}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase mt-1">{item.l}</div>
              <div className="text-[10px] text-slate-300 mt-2">{item.d}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-indigo-500 text-white p-2 rounded-lg text-xs font-bold">1</span>
          <h2 className="text-xl font-black text-slate-800">핵심 O2O UX 및 수납 체계</h2>
        </div>
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                   <span className="text-indigo-500">🔍</span> 지점별 전용 페이지
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">사용자가 내 주변 점포를 설정하면 해당 점포에서 열리는 강좌만 필터링하여 보여주는 위치 기반 최적화 UX.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                   <span className="text-indigo-500">📖</span> 디지털 카탈로그
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">기존의 종이 전단을 모바일 최적화 PDF/e-Book으로 변환하여 시스템 내에서 즉시 확인 및 공유 가능.</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-indigo-100">
               <h4 className="font-black text-slate-900 mb-4 tracking-tight">수납 이원화 시스템 (Split Payment)</h4>
               <div className="space-y-4">
                 <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-xl">
                   <span className="text-xs font-bold text-slate-600">수강료</span>
                   <span className="text-xs font-black text-indigo-500">온라인/카드 결제 (본사)</span>
                 </div>
                 <div className="flex justify-center text-slate-300">⬇️</div>
                 <div className="flex justify-between items-center p-3 bg-amber-50 rounded-xl">
                   <span className="text-xs font-bold text-slate-600">재료비</span>
                   <span className="text-xs font-black text-amber-500">지점 현장 결제 (별도 관리)</span>
                 </div>
                 <p className="text-[10px] text-slate-400 mt-4 leading-normal">
                   ※ 크레용스쿨의 배움터별 교구재 비용 정산 모델에 즉시 도입 가능한 정산 로직입니다.
                 </p>
               </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-indigo-500 text-white p-2 rounded-lg text-xs font-bold">2</span>
          <h2 className="text-xl font-black text-slate-800">지점 관리자 기능 (Admin)</h2>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="border border-slate-100 p-6 rounded-2xl hover:border-indigo-200 transition-all">
            <h4 className="font-bold text-slate-800 mb-2">실시간 학급 대시보드</h4>
            <p className="text-xs text-slate-500">지점 담당자가 우리 지점 전체 강좌의 모집 현황, 출결 상태, 매출을 한눈에 관리.</p>
          </div>
          <div className="border border-slate-100 p-6 rounded-2xl hover:border-indigo-200 transition-all">
            <h4 className="font-bold text-slate-800 mb-2">휴강/보강 자동 알림</h4>
            <p className="text-xs text-slate-500">천재지변이나 강사 사정으로 인한 휴강 발생 시 수강생 전원에게 실시간 알림톡 발송.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EmartReport;
