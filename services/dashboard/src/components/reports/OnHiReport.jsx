import React from 'react';

const OnHiReport = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <section>
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-indigo-500 text-white p-2 rounded-lg text-xs font-bold">🏛️</span>
          <h2 className="text-xl font-black text-slate-800">B2G 특화 및 공공 바우처 연동</h2>
        </div>
        <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100 mb-8 flex items-center justify-between">
           <div className="max-w-xl">
             <h3 className="text-indigo-600 text-sm font-black uppercase mb-2">Government Partnership</h3>
             <p className="text-lg font-bold text-slate-800 leading-relaxed">
               온하이는 <span className="text-indigo-600">국민체육진흥공단(KSPO)</span> 등 정부 기관과 연동하여 스포츠 바우처 결제를 지원하는 독보적인 공공 지향 플랫폼입니다.
             </p>
           </div>
           <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col items-center">
              <span className="text-xs font-bold text-slate-400 mb-1">KSPO 바우처</span>
              <span className="text-2xl font-black text-indigo-500">결제 지원</span>
           </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-premium">
           <h4 className="font-black text-slate-900 mb-6 flex items-center gap-2">
             <span className="text-indigo-500">✍️</span> 모바일 전자 신청서
           </h4>
           <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-800 mb-1">종이 없는 행정 (Paperless)</p>
                <p className="text-[10px] text-slate-500">입회 계약서, 개인정보 수집 동의서 등 모든 서류를 모바일 서명으로 대체.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-800 mb-1">자동 DB화</p>
                <p className="text-[10px] text-slate-500">서명된 신청서 데이터가 관리 시스템에 실시간으로 저장 및 분류.</p>
              </div>
           </div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-premium">
           <h4 className="font-black text-slate-900 mb-6 flex items-center gap-2">
             <span className="text-emerald-500">💳</span> 공공 바우처 결제 로직
           </h4>
           <ul className="space-y-4">
             <li className="flex gap-3">
               <span className="text-emerald-500">✅</span>
               <div>
                 <p className="text-xs font-bold text-slate-800">스포츠 복지 바우처 연동</p>
                 <p className="text-[10px] text-slate-500">정부 지원 바우처 카드를 일반 카드 결제처럼 간편하게 수용.</p>
               </div>
             </li>
             <li className="flex gap-3">
               <span className="text-emerald-500">✅</span>
               <div>
                 <p className="text-xs font-bold text-slate-800">문화누리카드 등 확장 가능</p>
                 <p className="text-[10px] text-slate-500">다양한 정부 평생교육 바우처 연동이 가능한 유연한 결제 엔진.</p>
               </div>
             </li>
           </ul>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-indigo-500 text-white p-2 rounded-lg text-xs font-bold">🎯</span>
          <h2 className="text-xl font-black text-slate-800">크레용스쿨 전략 적용</h2>
        </div>
        <div className="highlight-box bg-slate-900 text-white p-10 rounded-[40px] relative overflow-hidden">
           <div className="relative z-10">
             <h4 className="text-indigo-400 font-black text-xs uppercase tracking-widest mb-4">Implementation Insight</h4>
             <p className="text-xl font-bold leading-relaxed max-w-2xl">
               "크레용스쿨이 공공기관 및 대형 기관과 협업할 때, <span className="text-indigo-400 underline decoration-2 underline-offset-4">종이 신청서를 모바일 QR 서명으로 대체</span>하는 기술을 보여주는 것만으로도 행정 비용 절감 효과를 입증하여 계약 성사율을 크게 높일 수 있습니다."
             </p>
           </div>
           <div className="absolute top-1/2 right-[-5%] text-9xl opacity-5 transform -translate-y-1/2 rotate-12">🏛️</div>
        </div>
      </section>
    </div>
  );
};

export default OnHiReport;
