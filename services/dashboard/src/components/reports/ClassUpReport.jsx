import React from 'react';

const ClassUpReport = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <section>
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-indigo-500 text-white p-2 rounded-lg text-xs font-bold">📲</span>
          <h2 className="text-xl font-black text-slate-800">경량형 학원 행정 자동화 (BYOD)</h2>
        </div>
        <div className="grid grid-cols-2 gap-8 mb-8">
           <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-premium">
             <h4 className="font-black text-slate-900 mb-6 flex items-center gap-2">
               <span className="text-indigo-500">📍</span> 자동 출결 키오스크
             </h4>
             <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
               별도 전용 단말기 없이 학원이나 지점이 보유한 태블릿/스마트폰에 앱만 설치하면 즉시 출결 키오스크로 변환됩니다.
             </p>
             <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">도입 비용</span>
                <span className="text-lg font-black text-emerald-500">0원 (앱 설치)</span>
             </div>
           </div>
           <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-premium">
             <h4 className="font-black text-slate-900 mb-6 flex items-center gap-2">
               <span className="text-blue-500">💳</span> 수납 및 원비 관리
             </h4>
             <ul className="space-y-3">
               <li className="flex items-center gap-3 text-xs font-bold text-slate-600">
                 <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                 토스(Toss) 결제 연동 자동 청구서 발송
               </li>
               <li className="flex items-center gap-3 text-xs font-bold text-slate-600">
                 <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                 미납자 대상 정기 독촉 메시지 자동화
               </li>
               <li className="flex items-center gap-3 text-xs font-bold text-slate-600">
                 <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                 현금/카드 통합 영수증 자동 발행
               </li>
             </ul>
           </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-indigo-500 text-white p-2 rounded-lg text-xs font-bold">1</span>
          <h2 className="text-xl font-black text-slate-800">현장 특화 기능</h2>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <h5 className="font-bold text-slate-900 text-sm mb-2">실시간 재원 정보</h5>
            <p className="text-xs text-slate-500">현재 원내에 머물고 있는 인원과 하원 인원을 관리자 앱에서 실시간 모니터링.</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <h5 className="font-bold text-slate-900 text-sm mb-2">생활 기록 알림</h5>
            <p className="text-xs text-slate-500">수업 태도나 간단한 피드백을 앱으로 전송하여 학부모 안심 서비스 제공.</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <h5 className="font-bold text-slate-900 text-sm mb-2">통계 리포트</h5>
            <p className="text-xs text-slate-500">월별 수납액, 미납률, 출결률 통계를 대시보드 형태로 제공.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ClassUpReport;
