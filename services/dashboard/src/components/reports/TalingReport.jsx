import React from 'react';

const TalingReport = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* 핵심 지표 섹션 */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-indigo-500 text-white p-2 rounded-lg text-xs font-bold">📊</span>
          <h2 className="text-xl font-black text-slate-800">핵심 성과 지표</h2>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: '교육 만족도', value: '96%', color: 'text-indigo-500' },
            { label: '평균 완강률', value: '91%', color: 'text-blue-500' },
            { label: '재구매율', value: '81%', color: 'text-emerald-500' },
            { label: '도입 기업 수', value: '2,000+', color: 'text-indigo-600' }
          ].map((item, i) => (
            <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
              <div className={`text-3xl font-black ${item.color} mb-1`}>{item.value}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 서비스 개요 섹션 */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-indigo-500 text-white p-2 rounded-lg text-xs font-bold">1</span>
          <h2 className="text-xl font-black text-slate-800">서비스 개요 및 메뉴 구조</h2>
        </div>
        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-2xl mb-8">
          <p className="text-slate-700 font-bold leading-relaxed">
            탈잉 기업교육은 단순 LMS를 넘어, <span className="text-indigo-600">AI 기반 운영 자동화(출결·과제·수료증)와 성과 리포팅</span>을 결합한 LXP(Learning Experience Platform)를 지향합니다. 
            핵심 슬로건은 <span className="text-indigo-600">"트렌디한 교육, 눈에 보이는 성과"</span>입니다.
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-black text-slate-900">주요 메뉴</th>
                <th className="px-6 py-4 font-black text-slate-900">기능 및 내용 요약</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { m: '맞춤 교육', d: '기업 니즈 분석 후 전용 커리큘럼 및 VOD 커스텀 제작' },
                { m: 'VOD 라이브러리', d: '2,000개 이상의 트렌디 콘텐츠 무제한 제공' },
                { m: '출강 강사', d: '검증된 튜터를 기업 현장에 직접 파견하는 오프라인 솔루션' },
                { m: 'LXP 플랫폼', d: '어드민 대시보드 + 학습자 캠퍼스 통합 제공' }
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-indigo-600">{row.m}</td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{row.d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 핵심 기능 섹션 */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-indigo-500 text-white p-2 rounded-lg text-xs font-bold">2</span>
          <h2 className="text-xl font-black text-slate-800">B2B 전용 핵심 기능 상세</h2>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {[
            { 
              title: '🖥️ 어드민 대시보드', 
              list: ['프로젝트별 전체 진행률 시각화', '성과 보고서 자동 생성 (교육 전/후)', '만족도 설문 결과 자동 집계'] 
            },
            { 
              title: '🤖 AI 기반 운영 자동화', 
              list: ['출결 자동 처리 (수동 체크 불필요)', '과제 미제출자 자동 리마인더 발송', '수료 조건 달성 시 수료증 자동 발급'] 
            },
            { 
              title: '🎓 학습자 캠퍼스', 
              list: ['넷플릭스 스타일 직관적 UI', '진도율 실시간 표시 및 모바일 최적화', '수료증 자동 발급 시스템'] 
            },
            { 
              title: '📈 성과 리포팅 시스템', 
              list: ['교육 전/후 역량 변화 측정', '진도율·만족도 통합 시각화', '"상사 보고용" 성과 보고서 자동 생성'] 
            }
          ].map((card, i) => (
            <div key={i} className="p-6 rounded-2xl border-t-4 border-indigo-500 bg-white shadow-sm border-x border-b border-slate-100">
              <h3 className="font-black text-indigo-600 mb-4">{card.title}</h3>
              <ul className="space-y-2">
                {card.list.map((li, j) => (
                  <li key={j} className="text-xs font-bold text-slate-500 flex gap-2">
                    <span className="text-indigo-300">•</span> {li}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 도입 프로세스 섹션 */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-indigo-500 text-white p-2 rounded-lg text-xs font-bold">3</span>
          <h2 className="text-xl font-black text-slate-800">도입 프로세스</h2>
        </div>
        <div className="flex gap-2">
          {['상담 신청', '니즈 분석', '커리큘럼 설계', '플랫폼 세팅', '성과 리포트'].map((step, i) => (
            <div key={i} className="flex-1 bg-slate-50 border border-slate-100 p-4 rounded-xl text-center relative group">
              <div className="text-indigo-500 font-black text-lg mb-1">0{i+1}</div>
              <p className="text-[10px] font-black text-slate-500">{step}</p>
              {i < 4 && <div className="absolute top-1/2 -right-1 text-indigo-200 transform -translate-y-1/2 z-10">→</div>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TalingReport;
