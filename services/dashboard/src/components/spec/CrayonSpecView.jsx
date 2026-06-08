import React, { useState } from 'react';
import { modules, priorityMap, coreStrategies } from '../../data/crayonSpec';

const colorClasses = {
  indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600', badge: 'bg-indigo-500', light: 'bg-indigo-100', dark: 'bg-indigo-900', gradient: 'from-indigo-500 to-indigo-700' },
  blue:   { bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-600',   badge: 'bg-blue-500',   light: 'bg-blue-100', dark: 'bg-blue-900', gradient: 'from-blue-500 to-blue-700' },
  emerald:{ bg: 'bg-emerald-50',border: 'border-emerald-200',text: 'text-emerald-600',badge: 'bg-emerald-500',light: 'bg-emerald-100',dark: 'bg-emerald-900', gradient: 'from-emerald-500 to-emerald-700' },
  amber:  { bg: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-600',  badge: 'bg-amber-500',  light: 'bg-amber-100', dark: 'bg-amber-900', gradient: 'from-amber-500 to-amber-700' },
};

const priorityColors = {
  SHORT:  'bg-emerald-100 text-emerald-700',
  MID:    'bg-amber-100 text-amber-700',
  LONG:   'bg-rose-100 text-rose-700',
};

const CrayonSpecView = () => {
  const [activeModule, setActiveModule] = useState('admin');
  const [expandedFeature, setExpandedFeature] = useState(0);

  const currentModule = modules.find(m => m.id === activeModule);
  const c = colorClasses[currentModule.color];

  return (
    <div className="space-y-12 pb-20">
      
      {/* 1. Core Strategies Section (Top) */}
      <section className="grid grid-cols-3 gap-6">
        {coreStrategies.map((strat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-premium relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
             <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-full flex items-center justify-center text-slate-200 font-outfit font-black text-4xl group-hover:text-indigo-100 transition-colors">
                0{idx + 1}
             </div>
             <h3 className="text-indigo-600 text-[11px] font-black uppercase tracking-[0.2em] mb-4">Core Strategy</h3>
             <h4 className="text-slate-900 font-black text-xl mb-3 tracking-tight">{strat.title}</h4>
             <p className="text-slate-500 text-sm font-bold leading-relaxed">{strat.desc}</p>
          </div>
        ))}
      </section>

      {/* 2. Module Navigation Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-100/80 rounded-[32px] w-fit mx-auto shadow-inner border border-slate-200/50 backdrop-blur-sm">
        {modules.map(m => {
          const mc = colorClasses[m.color];
          const isActive = activeModule === m.id;
          return (
            <button
              key={m.id}
              onClick={() => { setActiveModule(m.id); setExpandedFeature(0); }}
              className={`px-10 py-5 rounded-[24px] text-sm font-black transition-all flex items-center gap-3 ${
                isActive 
                  ? `bg-white ${mc.text} shadow-xl scale-105` 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className="text-2xl">{m.icon}</span>
              {m.name}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-10 items-start">
        {/* Main Content (2/3) */}
        <div className="col-span-2 space-y-8">
          
          {/* 3. Special Notice for Instructor Module (Platformers Service Note) */}
          {currentModule.specialNotice && (
            <div className={`bg-gradient-to-br ${c.gradient} p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-700`}>
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
               <div className="flex items-center gap-3 mb-6 relative z-10">
                  <span className="bg-white/20 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 backdrop-blur-md">
                     Strategic Message
                  </span>
               </div>
               <h3 className="text-2xl font-black mb-6 leading-tight relative z-10">
                  {currentModule.specialNotice.title}
               </h3>
               <p className="text-white/90 text-sm font-bold leading-relaxed relative z-10">
                  {currentModule.specialNotice.content}
               </p>
               <div className="mt-8 flex items-center gap-4 relative z-10">
                  <div className="flex -space-x-2">
                     <div className="w-8 h-8 rounded-full bg-white/20 border border-white/40 backdrop-blur-md flex items-center justify-center font-black text-[10px]">P</div>
                     <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center font-black text-[10px]">L</div>
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-white/60">Designed by Platformers Team</span>
               </div>
               <div className="absolute -bottom-10 -right-10 text-9xl font-black text-white/10 select-none">TASK</div>
            </div>
          )}

          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">📋 상세 기능 내역서</h3>
          </div>
          
          <div className="space-y-4">
            {currentModule.features.map((feat, idx) => {
              const isExpanded = expandedFeature === idx;
              return (
                <div 
                  key={idx}
                  className={`bg-white rounded-[32px] border-2 transition-all cursor-pointer overflow-hidden ${
                    isExpanded ? `${c.border} shadow-2xl` : 'border-slate-50 hover:border-slate-200'
                  }`}
                  onClick={() => setExpandedFeature(isExpanded ? null : idx)}
                >
                  <div className={`p-8 ${isExpanded ? '' : 'hover:bg-slate-50/30'}`}>
                    <div className="flex items-start gap-5">
                      <div className={`w-12 h-12 ${isExpanded ? c.badge : 'bg-slate-100'} rounded-2xl flex items-center justify-center font-outfit font-black ${isExpanded ? 'text-white' : 'text-slate-400'} shrink-0 shadow-lg transition-colors`}>
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h4 className={`font-black text-lg tracking-tight ${isExpanded ? 'text-slate-900' : 'text-slate-600'}`}>{feat.title}</h4>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${priorityColors[feat.priority]}`}>
                            {priorityMap[feat.priority].label}
                          </span>
                        </div>
                        <p className={`text-sm font-bold leading-relaxed ${isExpanded ? 'text-slate-600' : 'text-slate-400 line-clamp-1'}`}>
                          {feat.desc}
                        </p>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-8 pb-8 pt-6 border-t border-slate-50 bg-white animate-in slide-in-from-top-2 duration-500">
                      <div className="space-y-6">
                        
                        {/* AS-IS & TO-BE Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-6 bg-rose-50/50 rounded-3xl border border-rose-100/50">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-rose-500 text-lg">⚠️</span>
                              <span className="text-[11px] font-black text-rose-500 uppercase tracking-widest">Current Pain Point (AS-IS)</span>
                            </div>
                            <p className="text-sm font-bold text-slate-600 leading-relaxed">
                              {feat.details.find(d => d.startsWith('AS-IS:'))?.replace('AS-IS:', '').trim()}
                            </p>
                          </div>
                          <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100/50 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-emerald-500 text-lg">✨</span>
                              <span className="text-[11px] font-black text-emerald-500 uppercase tracking-widest">Solution (TO-BE)</span>
                            </div>
                            <p className="text-sm font-black text-slate-700 leading-relaxed">
                              {feat.details.find(d => d.startsWith('TO-BE:'))?.replace('TO-BE:', '').trim()}
                            </p>
                          </div>
                        </div>

                        {/* Scenario Section */}
                        <div className={`${c.bg} p-6 rounded-3xl border ${c.border} relative overflow-hidden`}>
                          <div className="flex items-center gap-2 mb-4 relative z-10">
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Business Scenario</span>
                          </div>
                          <p className="text-sm font-bold text-slate-700 leading-relaxed relative z-10 italic">
                            "{feat.details.find(d => d.startsWith('시나리오:'))?.replace('시나리오:', '').trim()}"
                          </p>
                          <div className={`absolute -right-4 -bottom-8 text-8xl font-black ${c.text} opacity-5 select-none`}>SCENARIO</div>
                        </div>

                        {/* Features List & Effect */}
                        <div className="grid grid-cols-3 gap-6 pt-2">
                          <div className="col-span-2">
                            <h5 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Core Functionalities</h5>
                            <div className="grid grid-cols-1 gap-2">
                              {feat.details.filter(d => !d.includes(':')).map((li, liIdx) => (
                                <div key={liIdx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 group hover:border-slate-300 transition-colors">
                                  <div className={`w-1.5 h-1.5 ${c.badge} rounded-full group-hover:scale-125 transition-transform`}></div>
                                  <span className="text-xs font-bold text-slate-600">{li}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="col-span-1">
                            <h5 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Expected Value</h5>
                            <div className={`${c.dark} p-6 rounded-[32px] text-white shadow-xl shadow-slate-900/10`}>
                              <p className="text-sm font-black leading-relaxed italic">
                                {feat.effect}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Structure (1/3) */}
        <div className="col-span-1 space-y-8 sticky top-10">
          <div>
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">📍 메뉴 구조도</h3>
             <div className="bg-slate-900 rounded-[48px] p-10 shadow-2xl border border-white/5 overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[100px] transition-transform group-hover:scale-110"></div>
                <div className="flex items-center gap-3 mb-10 pb-6 border-b border-white/10 relative z-10">
                  <div className={`w-12 h-12 ${c.badge} rounded-xl shadow-lg flex items-center justify-center text-2xl`}>{currentModule.icon}</div>
                  <div>
                    <h4 className="text-white text-base font-black tracking-tight">{currentModule.name}</h4>
                    <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] mt-0.5">Admin Map v1.0</p>
                  </div>
                </div>
                
                <div className="space-y-8 relative z-10">
                  {currentModule.menus.map((menu, mi) => (
                    <div key={mi} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 ${c.badge} rounded-full shadow-[0_0_8px] shadow-indigo-500`}></div>
                        <span className="text-white text-xs font-black tracking-tight">{menu.depth1}</span>
                      </div>
                      <div className="ml-5 space-y-2.5 border-l border-white/10 pl-6">
                        {menu.depth2.map((sub, si) => (
                          <div key={si} className="text-[11px] text-white/40 font-bold hover:text-white transition-colors cursor-pointer flex items-center gap-3 group/item">
                             <span className={`opacity-0 group-hover/item:opacity-100 transition-all ${c.text} -ml-3`}>›</span>
                             {sub}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-12 pt-6 border-t border-white/10 flex items-center justify-between relative z-10">
                  <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">Total Nodes</div>
                  <div className="text-white font-outfit font-black text-2xl">
                     {currentModule.menus.reduce((acc, m) => acc + m.depth2.length, 0) + currentModule.menus.length}
                  </div>
                </div>
             </div>
          </div>

          <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-200 relative overflow-hidden">
             <h4 className="font-black text-slate-900 text-lg mb-3 relative z-10 italic">"성공적인 전국 확장을 위한 단 하나의 설계도"</h4>
             <p className="text-xs text-slate-500 font-bold leading-relaxed relative z-10">
                본 문서는 단순한 기능 나열이 아닌, 6개 선도 플랫폼의 승리 공식을 크레용스쿨에 최적화하여 이식한 결과물입니다.
             </p>
             <div className="absolute -bottom-10 -right-10 text-9xl font-black text-slate-200/50 select-none">CRAYON</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrayonSpecView;
