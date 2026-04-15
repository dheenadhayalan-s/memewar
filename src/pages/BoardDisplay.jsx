import React from 'react';
import { Trophy, Users, Star, Crown, Zap, Shield, Target, Clock } from 'lucide-react';

const BoardDisplay = ({ eventData, teams }) => {
  const [showSpectator, setShowSpectator] = React.useState(false);
  
  const sortedTeams = Object.entries(teams)
    .sort(([, a], [, b]) => b.total - a.total);

  const top3 = sortedTeams.slice(0, 3);
  const rankings = eventData.rankings || {};
  const submissions = eventData.submissions || {};

  const backgroundElements = (
    <>
      <div className="bg-pattern" />
      <div className="bg-glow" style={{ top: '-10%', left: '-10%' }} />
      <div className="bg-glow" style={{ bottom: '-10%', right: '-10%', animationDelay: '-10s' }} />
    </>
  );

  if (showSpectator) {
    return (
      <div className="relative flex flex-col gap-12 p-8 lg:p-12 min-h-screen bg-deep overflow-hidden animate-reveal">
        {backgroundElements}
        
        <header className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white border-opacity-5 pb-10">
          <div className="flex items-center gap-8">
            <div className="p-6 bg-neon-cyan bg-opacity-10 border border-neon-cyan border-opacity-30 rounded-[2.5rem] shadow-[0_0_30px_rgba(6,182,212,0.1)]">
              <Users size={80} className="text-neon-cyan" />
            </div>
            <div>
              <h1 className="text-7xl lg:text-9xl font-black text-gradient uppercase italic leading-none tracking-tighter">ROUND 2</h1>
              <p className="text-xl lg:text-3xl text-secondary font-bold tracking-widest uppercase mt-4 opacity-40">Meme Battle Viewer</p>
            </div>
          </div>
          <button 
            onClick={() => setShowSpectator(false)}
            className="btn-primary py-5 px-10 text-lg rounded-2xl group"
          >
            <span>Back to Scoreboard</span>
            <Trophy size={20} className="group-hover:rotate-12 transition-transform" />
          </button>
        </header>

        <div className="relative z-10 grid grid-cols-12 gap-12">
          {/* BOTTOM LEFT: THE MEME - Cinematic focus */}
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-8">
            <div className="glass-card p-10 flex flex-col gap-8 h-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-neon-cyan bg-opacity-20 flex items-center justify-center">
                    <Target className="text-neon-cyan" size={24} />
                  </div>
                  <h2 className="heading text-4xl text-neon-cyan uppercase font-black italic">Current Meme</h2>
                </div>
                <div className="flex items-center gap-4 px-8 py-3 rounded-2xl bg-red-500 bg-opacity-10 border border-red-500 border-opacity-20">
                  <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]"></div>
                  <span className="text-red-500 font-extrabold uppercase tracking-widest text-lg">Live Focus</span>
                </div>
              </div>

              <div className="flex-grow flex items-center justify-center">
                {eventData.template ? (
                  <div className="relative group w-full max-h-[60vh] flex items-center justify-center">
                    <div className="absolute -inset-4 bg-gradient-to-r from-neon-cyan to-neon-primary opacity-20 blur-3xl rounded-[3rem] group-hover:opacity-30 transition-opacity"></div>
                    <img 
                      src={eventData.template} 
                      className="relative z-10 w-full h-full object-contain rounded-[2rem] border border-white border-opacity-10 shadow-2xl" 
                      alt="Current Template" 
                    />
                  </div>
                ) : (
                  <div className="w-full h-[50vh] glass-card flex flex-col items-center justify-center gap-8 opacity-40 border-dashed border-4">
                    <div className="relative">
                      <Clock size={120} className="animate-spin-slow text-neon-cyan" />
                      <div className="absolute inset-0 bg-neon-cyan blur-3xl opacity-20"></div>
                    </div>
                    <p className="text-3xl font-black uppercase tracking-widest text-center">Team {eventData.currentSelector || '??'}<br/><span className="text-lg font-bold opacity-50">is choosing a meme...</span></p>
                  </div>
                )}
              </div>

              <div className="glass-card p-10 bg-gradient-to-br from-neon-cyan to-transparent bg-opacity-5 border-neon-cyan border-opacity-20 flex justify-between items-center group">
                <div>
                  <p className="text-sm text-secondary font-black uppercase tracking-widest mb-3 opacity-50">Lead Selector</p>
                  <p className="text-7xl font-black text-neon-cyan uppercase italic leading-none">Team {eventData.currentSelector || '??'}</p>
                </div>
                <Crown size={80} className="text-neon-cyan opacity-10 group-hover:opacity-20 transition-opacity" />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: WINNERS - Clean Podium Feel */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-8">
            <div className="glass-card p-10 h-full flex flex-col gap-10">
              <div className="flex items-center gap-6 border-b border-white border-opacity-5 pb-8">
                <div className="w-16 h-16 rounded-[1.5rem] bg-neon-pink bg-opacity-20 flex items-center justify-center shadow-[0_0_20px_rgba(217,70,239,0.1)]">
                   <Trophy className="text-neon-pink" size={32} />
                </div>
                <div>
                   <h2 className="heading text-4xl text-neon-pink uppercase font-black italic">The Winners</h2>
                   <p className="text-xs text-secondary font-bold uppercase tracking-widest mt-1 opacity-50">Top 3 Selected Entry</p>
                </div>
              </div>

              <div className="flex flex-col gap-8 flex-grow">
                {['first', 'second', 'third'].map((rank, i) => {
                  const winnerId = rankings[rank];
                  const caption = submissions[winnerId];
                  const colors = i === 0 ? 'neon-emerald' : i === 1 ? 'neon-cyan' : 'neon-pink';
                  const borderClass = i === 0 ? 'border-[#10b981]' : i === 1 ? 'border-[#06b6d4]' : 'border-[#d946ef]';
                  const textClass = i === 0 ? 'text-[#10b981]' : i === 1 ? 'text-[#06b6d4]' : 'text-[#d946ef]';
                  const bgClass = i === 0 ? 'bg-[#10b981]' : i === 1 ? 'bg-[#06b6d4]' : 'bg-[#d946ef]';
                  
                  return (
                    <div key={rank} className={`group relative flex flex-col gap-6 p-10 glass-card border-l-[12px] ${borderClass} ${!winnerId ? 'opacity-20 grayscale' : 'animate-reveal shadow-xl hover:shadow-2xl'}`}>
                      <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                            <span className={`text-6xl font-black ${textClass} italic leading-none tracking-tighter`}>{i === 0 ? '1ST' : i === 1 ? '2ND' : '3RD'}</span>
                            <span className="text-xs font-black uppercase tracking-[0.3em] opacity-30 mt-2">{i === 0 ? 'Champion' : i === 1 ? 'Runner Up' : 'Special Mention'}</span>
                        </div>
                        {winnerId && (
                           <div className="flex flex-col items-end">
                             <span className="text-sm font-bold opacity-30 uppercase">Awarded To</span>
                             <span className="text-3xl font-black uppercase italic">Team {winnerId}</span>
                           </div>
                        )}
                      </div>
                      
                      {winnerId ? (
                        <div className="relative p-6 rounded-2xl bg-white bg-opacity-[0.03] border border-white border-opacity-5">
                          <p className="text-3xl font-extrabold text-white italic leading-tight">"{caption}"</p>
                          <div className={`absolute -left-6 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${bgClass} blur-sm`}></div>
                        </div>
                      ) : (
                        <div className="h-16 flex flex-col justify-center gap-3">
                          <div className="w-full h-1 bg-white bg-opacity-5 rounded-full overflow-hidden">
                             <div className="h-full bg-white bg-opacity-10 animate-pulse w-full"></div>
                          </div>
                          <p className="text-xs font-bold uppercase tracking-widest opacity-20 text-center">Decision Pending...</p>
                        </div>
                      )}
                    </div>
                  );
                })}

                {!rankings.first && (
                  <div className="mt-auto p-12 text-center glass-card border-dashed border-2 opacity-30 hover:opacity-100 transition-opacity">
                    <p className="text-lg font-bold uppercase tracking-widest text-secondary italic">Final rankings will appear here shortly</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-12 p-8 lg:p-12 min-h-screen bg-deep overflow-hidden">
      {backgroundElements}

      {/* HEADER */}
      <header className="relative z-10 flex flex-col md:flex-row justify-between items-center md:items-end border-b border-white border-opacity-5 pb-10 gap-8">
        <div className="flex items-center gap-8">
            <div className="p-6 bg-neon-cyan bg-opacity-10 border border-neon-cyan border-opacity-40 rounded-[2.5rem] shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                <Users size={80} className="text-neon-cyan" />
            </div>
            <div>
                <h1 className="text-7xl lg:text-9xl font-black text-gradient uppercase italic leading-none tracking-tighter">MEME WAR</h1>
                <p className="text-xl lg:text-3xl text-secondary font-bold tracking-widest uppercase mt-4 opacity-40 italic">Global Scoreboard // 2026</p>
            </div>
        </div>
        
        <div className="flex flex-col items-center md:items-end gap-6 animate-reveal">
           {eventData.currentRound === 2 && (
             <button 
               onClick={() => setShowSpectator(true)}
               className="btn-primary py-5 px-10 rounded-2xl text-lg flex items-center gap-4 group shadow-[0_0_30px_rgba(139,92,246,0.3)]"
             >
               <Star size={24} className="group-hover:rotate-90 transition-transform duration-500" /> 
               <span>View Round 2 Live</span>
             </button>
           )}
           <div className="flex items-center gap-6 px-10 py-5 glass-card border-neon-pink border-opacity-40 shadow-2xl">
                <div className="text-right">
                    <p className="text-xs text-secondary font-black uppercase tracking-[0.3em] opacity-40">ACTIVE PHASE</p>
                    <p className="text-5xl font-black text-neon-pink heading italic tracking-tighter">
                        {eventData.currentRound === 1 && "RAPID FIRE"}
                        {eventData.currentRound === 2 && "CAPTION CRUSH"}
                        {eventData.currentRound === 3 && "GRAND SHOW"}
                    </p>
                </div>
                <div className="w-16 h-16 bg-neon-pink rounded-[1.5rem] flex items-center justify-center text-black shadow-[0_0_20px_rgba(217,70,239,0.4)]">
                    <Zap size={40} />
                </div>
           </div>
        </div>
      </header>

      <div className="relative z-10 grid grid-cols-12 gap-12">
        <div className="col-span-12 lg:col-span-8">
            <div className="glass-card shadow-2xl">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white border-opacity-5">
                      <th className="p-10 text-left text-sm font-black uppercase tracking-[0.2em] text-secondary opacity-50 italic">Position</th>
                      <th className="p-10 text-left text-sm font-black uppercase tracking-[0.2em] text-secondary opacity-50 italic">Squad Codename</th>
                      <th className="p-10 text-center text-sm font-black uppercase tracking-[0.2em] text-secondary opacity-50 italic">R1</th>
                      <th className="p-10 text-center text-sm font-black uppercase tracking-[0.2em] text-secondary opacity-50 italic">R2</th>
                      <th className="p-10 text-center text-sm font-black uppercase tracking-[0.2em] text-secondary opacity-50 italic">R3</th>
                      <th className="p-10 text-right text-sm font-black uppercase tracking-[0.2em] text-secondary opacity-50 italic">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTeams.length > 0 ? sortedTeams.map(([id, t], index) => {
                       const rankColors = index === 0 ? 'bg-neon-emerald shadow-[0_0_20px_rgba(16,185,129,0.3)]' : index === 1 ? 'bg-neon-cyan shadow-[0_0_20px_rgba(6,182,212,0.3)]' : index === 2 ? 'bg-neon-pink shadow-[0_0_20px_rgba(217,70,239,0.3)]' : 'bg-white bg-opacity-5 border border-white border-opacity-10';
                       const isTop3 = index < 3;
                       return (
                        <tr key={id} className={`group animate-reveal ${index < sortedTeams.length - 1 ? 'border-b border-white border-opacity-5' : ''} hover:bg-white hover:bg-opacity-[0.02] transition-colors`}>
                          <td className="p-10">
                             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl font-black ${rankColors} ${isTop3 ? 'text-black' : 'text-secondary opacity-50'}`}>
                                {index + 1}
                             </div>
                          </td>
                          <td className="p-10">
                              <div className="flex items-center gap-6">
                                 <span className={`text-4xl font-black uppercase italic tracking-tighter ${index === 0 ? 'text-neon-emerald' : 'text-white'}`}>Team {id}</span>
                                 {index === 0 && <Crown className="text-neon-emerald animate-bounce" size={32} />}
                              </div>
                          </td>
                          <td className="p-10 text-center text-2xl font-bold opacity-30 group-hover:opacity-100 transition-opacity">{t.r1 || 0}</td>
                          <td className="p-10 text-center text-2xl font-bold opacity-30 group-hover:opacity-100 transition-opacity">{t.r2 || 0}</td>
                          <td className="p-10 text-center text-2xl font-bold opacity-30 group-hover:opacity-100 transition-opacity">{t.r3 || 0}</td>
                          <td className="p-10 text-right">
                             <div className="text-6xl font-black text-neon-cyan tracking-tighter tabular-nums">{t.total || 0}</div>
                          </td>
                        </tr>
                       );
                    }) : (
                      <tr>
                        <td colSpan="6" className="p-32 text-center opacity-30 uppercase tracking-[0.5em] font-black italic text-2xl">Awaiting Transmission...</td>
                      </tr>
                    )}
                  </tbody>
                </table>
            </div>
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-12">
            <div className="glass-card p-10 flex flex-col gap-10 shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-neon-cyan blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                
                <div className="flex items-center gap-6 border-b border-white border-opacity-5 pb-6">
                   <div className="w-12 h-12 rounded-2xl bg-neon-cyan bg-opacity-20 flex items-center justify-center">
                      <Target className="text-neon-cyan" size={28} />
                   </div>
                   <h2 className="heading text-2xl text-neon-cyan uppercase font-black italic">Live Update</h2>
                </div>

                {eventData.currentRound === 2 ? (
                    <div className="flex flex-col gap-8">
                        {eventData.template ? (
                            <div className="rounded-[2rem] border-2 border-white border-opacity-5 overflow-hidden relative group/img shadow-2xl transform transition-transform group-hover:scale-[1.02]">
                                <img src={eventData.template} className="w-full h-auto" alt="Template" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-8">
                                     <div className="flex items-center justify-between">
                                        <p className="text-sm font-black tracking-widest uppercase text-neon-cyan">Meme In Play</p>
                                        <div className="flex gap-3 items-center px-4 py-2 bg-red-500 rounded-xl bg-opacity-20 backdrop-blur-md">
                                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                            <p className="text-xs font-black text-red-500 uppercase">Live</p>
                                        </div>
                                     </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-64 glass-card border-dashed border-2 flex flex-col items-center justify-center gap-6 opacity-50 bg-white bg-opacity-[0.02]">
                                <Clock size={60} className="animate-spin-slow" />
                                <p className="text-sm font-black tracking-widest uppercase">Picking Battleground...</p>
                            </div>
                        )}
                        <div className="glass-card p-8 text-center bg-neon-cyan bg-opacity-[0.03] border-neon-cyan border-opacity-20">
                            <p className="text-xs text-secondary font-black tracking-widest uppercase mb-2 opacity-40">Active Squad</p>
                            <p className="text-5xl font-black text-neon-cyan uppercase italic tracking-tighter leading-none">Team {eventData.currentSelector || '??'}</p>
                        </div>
                    </div>
                ) : (
                    <div className="h-80 flex flex-col items-center justify-center text-center opacity-20 border-2 border-white border-opacity-5 border-dashed rounded-[2.5rem] gap-6">
                        <Users size={48} />
                        <p className="text-sm font-black tracking-widest uppercase">Round 2 Standby</p>
                    </div>
                )}
            </div>

            <div className="glass-card p-10 flex flex-col gap-8 shadow-2xl">
                <div className="flex items-center gap-4 border-b border-white border-opacity-5 pb-6">
                   <div className="w-10 h-10 rounded-xl bg-neon-emerald bg-opacity-20 flex items-center justify-center">
                      <Crown size={24} className="text-neon-emerald" />
                   </div>
                   <h3 className="text-xl text-neon-emerald font-black uppercase italic italic">Top Squads</h3>
                </div>
                
                <div className="flex flex-col gap-6">
                    {top3.length > 0 ? top3.map(([id, t], i) => (
                        <div key={id} className={`relative p-6 glass-card flex items-center justify-between group overflow-hidden ${i === 0 ? 'border-neon-emerald border-opacity-40 bg-neon-emerald bg-opacity-[0.02]' : ''}`}>
                            {i === 0 && <div className="absolute top-0 right-0 py-1 px-4 bg-neon-emerald text-black font-black text-[10px] uppercase tracking-widest rounded-bl-xl shadow-lg">Current Leader</div>}
                            <div className="flex items-center gap-6">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-2xl ${i === 0 ? 'bg-neon-emerald text-black' : i === 1 ? 'bg-neon-cyan text-black' : 'bg-neon-pink text-black'}`}>
                                    {i + 1}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-2xl font-black italic uppercase tracking-tighter">Team {id}</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Ranked #{i + 1}</span>
                                </div>
                            </div>
                            <span className="text-4xl font-black text-neon-cyan tabular-nums tracking-tighter">{t.total}</span>
                        </div>
                    )) : (
                      <div className="py-10 text-center opacity-20 flex flex-col items-center gap-4">
                        <Shield size={32} />
                        <p className="text-xs uppercase font-black tracking-widest">Calculated Rank Empty</p>
                      </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BoardDisplay;
