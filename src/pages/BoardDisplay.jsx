import React from 'react';
import { Trophy, Users, Star, Crown, Zap, Shield, Target, Clock } from 'lucide-react';

const BoardDisplay = ({ eventData, teams }) => {
  const [showSpectator, setShowSpectator] = React.useState(false);
  
  const sortedTeams = Object.entries(teams)
    .sort(([, a], [, b]) => b.total - a.total);

  const top3 = sortedTeams.slice(0, 3);

  const rankings = eventData.rankings || {};
  const submissions = eventData.submissions || {};

  if (showSpectator) {
    return (
      <div className="flex flex-col gap-12 p-12 min-h-screen bg-deep overflow-hidden animate-reveal">
        <header className="flex justify-between items-center border-b border-white border-opacity-5 pb-10">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-neon-cyan bg-opacity-20 border border-neon-cyan border-opacity-40 rounded-3xl">
              <Users size={64} className="text-neon-cyan" />
            </div>
            <div>
              <h1 className="text-8xl font-black text-gradient uppercase italic leading-none">ROUND 2</h1>
              <p className="text-2xl text-secondary font-bold tracking-widest uppercase mt-4 opacity-40">Meme Battle Spectator</p>
            </div>
          </div>
          <button 
            onClick={() => setShowSpectator(false)}
            className="btn-primary"
          >
            Back to Scoreboard
          </button>
        </header>

        <div className="grid grid-cols-12 gap-12">
          {/* LEFT SIDE: THE MEME */}
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-8">
            <div className="glass-card p-10 flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Target className="text-neon-cyan" size={32} />
                  <h2 className="heading text-3xl text-neon-cyan uppercase">Current Meme</h2>
                </div>
                <div className="flex items-center gap-3 px-6 py-2 rounded-full bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-red-500 font-black uppercase tracking-widest text-sm">Live Focus</span>
                </div>
              </div>

              {eventData.template ? (
                <div className="rounded-3xl border border-white border-opacity-10 overflow-hidden shadow-2xl">
                  <img src={eventData.template} className="w-full h-auto" alt="Current Template" />
                </div>
              ) : (
                <div className="h-96 glass-card flex flex-col items-center justify-center gap-6 opacity-40">
                  <Clock size={80} className="animate-spin-slow" />
                  <p className="text-xl font-bold uppercase tracking-widest">Team {eventData.currentSelector || '??'} is choosing...</p>
                </div>
              )}

              <div className="glass-card p-8 bg-neon-cyan bg-opacity-5 border-neon-cyan border-opacity-20">
                <p className="text-sm text-secondary font-black uppercase tracking-widest mb-2 opacity-50">Active Selector</p>
                <p className="text-6xl font-black text-neon-cyan uppercase italic">Team {eventData.currentSelector || '??'}</p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: WINNERS */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-8">
            <div className="glass-card p-10 h-full flex flex-col gap-8">
              <div className="flex items-center gap-4 border-b border-white border-opacity-5 pb-6">
                <Trophy className="text-neon-pink" size={32} />
                <h2 className="heading text-3xl text-neon-pink uppercase">Top 3 Winners</h2>
              </div>

              <div className="flex flex-col gap-8 flex-grow">
                {['first', 'second', 'third'].map((rank, i) => {
                  const winnerId = rankings[rank];
                  const caption = submissions[winnerId];
                  const colors = i === 0 ? 'neon-emerald' : i === 1 ? 'neon-cyan' : 'neon-pink';
                  
                  return (
                    <div key={rank} className={`flex flex-col gap-4 p-8 glass-card border-l-8 border-${colors} ${!winnerId ? 'opacity-20' : 'animate-reveal'}`}>
                      <div className="flex justify-between items-center">
                        <span className={`text-4xl font-black text-${colors} italic`}>{i + 1}{i === 0 ? 'ST' : i === 1 ? 'SECOND' : 'THIRD'}</span>
                        {winnerId && <span className="text-xl font-black opacity-50">Team {winnerId}</span>}
                      </div>
                      
                      {winnerId ? (
                        <p className="text-2xl font-bold text-white italic">"{caption}"</p>
                      ) : (
                        <div className="h-12 flex items-center">
                          <div className="w-full h-2 bg-white bg-opacity-5 rounded-full overflow-hidden">
                             <div className="h-full bg-white bg-opacity-10 animate-pulse w-2/3"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {!rankings.first && (
                  <div className="mt-auto p-8 text-center glass-card border-dashed opacity-50">
                    <p className="text-sm font-bold uppercase tracking-widest">Waiting for Selector's Decision</p>
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
    <div className="flex flex-col gap-12 p-12 min-h-screen bg-deep overflow-hidden">
      {/* HEADER */}
      <header className="flex justify-between items-end border-b border-white border-opacity-5 pb-10">
        <div className="flex items-center gap-6">
            <div className="p-4 bg-neon-cyan bg-opacity-20 border border-neon-cyan border-opacity-40 rounded-3xl">
                <Users size={64} className="text-neon-cyan" />
            </div>
            <div>
                <h1 className="text-8xl font-black text-gradient uppercase italic leading-none">MEME WAR</h1>
                <p className="text-2xl text-secondary font-bold tracking-widest uppercase mt-4 opacity-40">Scoreboard // 2026</p>
            </div>
        </div>
        
        <div className="flex flex-col items-end gap-4 animate-reveal">
           {eventData.currentRound === 2 && (
             <button 
               onClick={() => setShowSpectator(true)}
               className="btn-primary mb-2 flex items-center gap-2"
             >
               <Star size={18} /> Spectate Round 2
             </button>
           )}
           <div className="flex items-center gap-4 px-8 py-4 glass-card border-neon-pink border-opacity-40 shadow-lg">
                <div className="text-right">
                    <p className="text-xs text-secondary font-black uppercase tracking-widest">ROUND</p>
                    <p className="text-4xl font-black text-neon-pink heading">
                        {eventData.currentRound === 1 && "RAPID FIRE"}
                        {eventData.currentRound === 2 && "CAPTION CRUSH"}
                        {eventData.currentRound === 3 && "GRAND SHOW"}
                    </p>
                </div>
                <div className="w-12 h-12 bg-neon-pink rounded-2xl flex items-center justify-center text-black">
                    <Zap size={32} />
                </div>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-12">
        <div className="col-span-8">
            <div className="glass-card overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white border-opacity-5">
                      <th className="p-8 text-left text-xs font-black uppercase tracking-widest text-secondary opacity-50">Rank</th>
                      <th className="p-8 text-left text-xs font-black uppercase tracking-widest text-secondary opacity-50">Team</th>
                      <th className="p-8 text-center text-xs font-black uppercase tracking-widest text-secondary opacity-50">R01</th>
                      <th className="p-8 text-center text-xs font-black uppercase tracking-widest text-secondary opacity-50">R02</th>
                      <th className="p-8 text-center text-xs font-black uppercase tracking-widest text-secondary opacity-50">R03</th>
                      <th className="p-8 text-right text-xs font-black uppercase tracking-widest text-secondary opacity-50">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTeams.length > 0 ? sortedTeams.map(([id, t], index) => {
                       return (
                        <tr key={id} className={`animate-reveal ${index < sortedTeams.length - 1 ? 'border-b border-white border-opacity-5' : ''}`}>
                          <td className="p-8">
                             <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-black ${index === 0 ? 'bg-neon-emerald text-black' : index === 1 ? 'bg-neon-cyan text-black' : index === 2 ? 'bg-neon-pink text-black' : 'text-secondary opacity-30 border border-white border-opacity-10'}`}>
                                {index + 1}
                             </div>
                          </td>
                          <td className="p-8">
                              <div className="flex items-center gap-4">
                                 <span className="text-3xl font-black uppercase italic">Team {id}</span>
                                 {index === 0 && <Crown className="text-neon-emerald" size={24} />}
                              </div>
                          </td>
                          <td className="p-8 text-center text-xl font-bold opacity-40">{t.r1 || 0}</td>
                          <td className="p-8 text-center text-xl font-bold opacity-40">{t.r2 || 0}</td>
                          <td className="p-8 text-center text-xl font-bold opacity-40">{t.r3 || 0}</td>
                          <td className="p-8 text-right">
                             <div className="text-5xl font-black text-neon-cyan">{t.total || 0}</div>
                          </td>
                        </tr>
                       );
                    }) : (
                      <tr>
                        <td colSpan="6" className="p-20 text-center opacity-30 uppercase tracking-widest font-black">Waiting for squads...</td>
                      </tr>
                    )}
                  </tbody>
                </table>
            </div>
        </div>

        <div className="col-span-4 flex flex-col gap-12">
            <div className="glass-card p-10 flex flex-col gap-8">
                <div className="flex items-center gap-4">
                   <Target className="text-neon-cyan" size={32} />
                   <h2 className="heading text-xl text-neon-cyan uppercase">Live Feed</h2>
                </div>

                {eventData.currentRound === 2 ? (
                    <div className="flex flex-col gap-6">
                        {eventData.template ? (
                            <div className="rounded-3xl border border-white border-opacity-10 overflow-hidden relative group shadow-xl">
                                <img src={eventData.template} className="w-full h-auto" alt="Template" />
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                                     <div className="flex items-center justify-between">
                                        <p className="text-xs font-black tracking-widest uppercase text-neon-cyan">Current Meme</p>
                                        <div className="flex gap-2 items-center">
                                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                            <p className="text-xs font-black text-red-500 uppercase">Live</p>
                                        </div>
                                     </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-48 glass-card flex flex-col items-center justify-center gap-4 opacity-50 border-dashed">
                                <Clock size={40} />
                                <p className="text-xs font-black tracking-widest uppercase">Picking Meme...</p>
                            </div>
                        )}
                        <div className="glass-card p-6 text-center border-neon-cyan border-opacity-30">
                            <p className="text-xs text-secondary font-black tracking-widest uppercase mb-1 opacity-50">Active Team</p>
                            <p className="text-3xl font-black text-neon-cyan uppercase italic">Team {eventData.currentSelector || '??'}</p>
                        </div>
                    </div>
                ) : (
                    <div className="h-64 flex items-center justify-center text-center opacity-20 border border-white border-opacity-5 rounded-3xl">
                        <p className="text-xs font-black tracking-widest uppercase">Standby for Round 2</p>
                    </div>
                )}
            </div>

            <div className="glass-card p-10 flex flex-col gap-8">
                <h3 className="text-xs text-secondary font-black tracking-widest flex items-center gap-3 uppercase opacity-50">
                   <Crown size={18} /> Top Teams
                </h3>
                <div className="flex flex-col gap-6">
                    {top3.length > 0 ? top3.map(([id, t], i) => (
                        <div key={id} className={`p-5 glass-card flex items-center justify-between ${i === 0 ? 'border-neon-emerald border-opacity-50 overflow-hidden relative' : ''}`}>
                            {i === 0 && <div className="absolute top-0 right-0 p-2 bg-neon-emerald text-black font-black text-[10px] uppercase">Leader</div>}
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${i === 0 ? 'bg-neon-emerald text-black' : i === 1 ? 'bg-neon-cyan text-black' : 'bg-neon-pink text-black'}`}>
                                    {i + 1}
                                </div>
                                <span className="text-xl font-black italic uppercase">Team {id}</span>
                            </div>
                            <span className="text-4xl font-black text-neon-cyan">{t.total}</span>
                        </div>
                    )) : (
                      <p className="text-center opacity-30 text-xs uppercase font-black">No data</p>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BoardDisplay;
