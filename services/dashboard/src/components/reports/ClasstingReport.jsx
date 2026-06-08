import React from 'react';

const ClasstingReport = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <section>
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-indigo-500 text-white p-2 rounded-lg text-xs font-bold">🤖</span>
          <h2 className="text-xl font-black text-slate-800">AI 지능형 학습 분석 엔진</h2>
        </div>
        <div className="bg-gradient-to-br from-indigo-600 to-blue-500 p-8 rounded-3xl text-white shadow-xl shadow-indigo-500/20 flex items-center justify-between overflow-hidden relative">
          <div className="relative z-10 space-y-2">
            <h3 className="text-indigo-200 text-xs font-black uppercase tracking-widest">Killer Technology</h3>
            <p className="text-2xl font-black leading-tight">지식 추적 엔진 CLST</p>
            <p className="text-sm text-white/80 font-medium max-w-md">학생의 학습 데이터를 분석하여 지식 상태를 진단하고 91.5%의 정확도로 성취도를 예측합니다.</p>
          </div>
          <div className="text-7xl opacity-20 transform translate-x-4">🧠</div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-premium">
          <h4 className="font-black text-slate-900 mb-6 flex items-center gap-2">
            <span className="text-indigo-500">📊</span> AI 진능 분석 리포트
          </h4>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center font-black text-white">1</div>
               <div>
                 <p className="text-xs font-black text-slate-800">지식 상태 시각화</p>
                 <p className="text-[10px] text-slate-400">레이더 차트 형태의 학습 성취도 자동 분석</p>
               </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center font-black text-white">2</div>
               <div>
                 <p className="text-xs font-black text-slate-800">개인화 문제 추천</p>
                 <p className="text-[10px] text-slate-400">오답 데이터를 분석하여 취약 지점 자동 보강</p>
               </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-premium">
          <h4 className="font-black text-slate-900 mb-6 flex items-center gap-2">
            <span className="text-emerald-500">🛡️</span> 밀착 소통 및 보안 시스템
          </h4>
          <div className="space-y-6">
            <div>
              <h5 className="text-sm font-bold text-slate-800 mb-2">안심번호 '클래스톡'</h5>
              <p className="text-xs text-slate-500 leading-relaxed">교사의 개인 휴대폰 번호를 노출하지 않고 학부모와 1:1 채팅 및 공지사항 발송 가능.</p>
            </div>
            <div className="pt-4 border-t border-slate-50">
              <h5 className="text-sm font-bold text-slate-800 mb-2">가정통신문 자동화</h5>
              <p className="text-xs text-slate-500 leading-relaxed">디지털 가정통신문 발송 및 응답(서명) 결과 자동 집계.</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-indigo-500 text-white p-2 rounded-lg text-xs font-bold">💡</span>
          <h2 className="text-xl font-black text-slate-800">Crayon School 시사점</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100/30">
            <p className="text-sm font-bold text-indigo-900 leading-relaxed">
              "로봇/코딩 교육 성과를 AI 리포트화하여 학부모에게 전송하는 기능은 현재 수작업인 학부모 상담 업무를 80% 이상 자동화할 수 있는 핵심 카드입니다."
            </p>
          </div>
          <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100/30">
            <p className="text-sm font-bold text-emerald-900 leading-relaxed">
              "가정통신문과 안심번호 시스템은 기관용 LMS 도입 시 담당자들의 개인정보 보호 및 행정 부담 완화에 큰 도움을 줍니다."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ClasstingReport;
