import React from 'react';
import { Trophy, Users, Star, Crown, Zap, Shield, Target, Clock } from 'lucide-react';

const BoardDisplay = ({ eventData, teams }) => {
  const sortedTeams = Object.entries(teams)
    .sort(([, a], [, b]) => b.total - a.total);

  const top3 = sortedTeams.slice(0, 3);

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
                <p className="text-2xl text-secondary font-bold tracking-widest uppercase mt-4 opacity-40">Squad Command Display // 2026</p>
            </div>
        </div>
        
        <div className="flex flex-col items-end gap-4 animate-reveal">
           <div className="flex items-center gap-4 px-8 py-4 glass-card border-neon-pink border-opacity-40 shadow-lg">
                <div className="text-right">
                    <p className="text-xs text-secondary font-black uppercase tracking-widest">PHASE</p>
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
                <table>
                  <thead>
                    <tr>
                      <th>Pos</th>
                      <th>Operation Squad</th>
                      <th className="text-center">R01</th>
                      <th className="text-center">R02</th>
                      <th className="text-center">R03</th>
                      <th className="text-right">Total Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTeams.map(([id, t], index) => {
                       const isTop3 = index < 3;
                       return (
                        <tr key={id} className="animate-reveal">
                          <td className="p-8">
                             <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-black ${index === 0 ? 'bg-neon-emerald text-black' : index === 1 ? 'bg-neon-cyan text-black' : index === 2 ? 'bg-neon-pink text-black' : 'text-secondary opacity-30'}`}>
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
                    })}
                  </tbody>
                </table>
            </div>
        </div>

        <div className="col-span-4 flex flex-col gap-12">
            <div className="glass-card p-10 flex flex-col gap-8">
                <div className="flex items-center gap-4">
                   <Target className="text-neon-cyan" size={32} />
                   <h2 className="heading text-xl text-neon-cyan">Radar Scope</h2>
                </div>

                {eventData.currentRound === 2 ? (
                    <div className="flex flex-col gap-6">
                        {eventData.template ? (
                            <div className="rounded-3xl border border-white border-opacity-10 overflow-hidden relative group">
                                <img src={eventData.template} className="w-full h-auto" alt="Template" />
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                                     <div className="flex items-center justify-between">
                                        <p className="text-xs font-black tracking-widest uppercase text-neon-cyan">Active Target</p>
                                        <div className="flex gap-2 items-center">
                                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                            <p className="text-xs font-black text-red-500 uppercase">Live</p>
                                        </div>
                                     </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-48 glass-card flex flex-col items-center justify-center gap-4 opacity-50">
                                <Clock size={40} />
                                <p className="text-xs font-black tracking-widest uppercase">Targeting...</p>
                            </div>
                        )}
                        <div className="glass-card p-6 text-center">
                            <p className="text-xs text-secondary font-black tracking-widest uppercase mb-1">Squad Lead</p>
                            <p className="text-3xl font-black text-neon-cyan uppercase italic">Team {eventData.currentSelector || '??'}</p>
                        </div>
                    </div>
                ) : (
                    <div className="h-64 flex items-center justify-center text-center opacity-20">
                        <p className="text-xs font-black tracking-widest uppercase">Scope Standby</p>
                    </div>
                )}
            </div>

            <div className="glass-card p-10 flex flex-col gap-8">
                <h3 className="heading text-xs text-neon-primary tracking-widest flex items-center gap-3">
                   <Crown size={18} /> Elite Squads
                </h3>
                <div className="flex flex-col gap-6">
                    {top3.map(([id, t], i) => (
                        <div key={id} className={`p-5 glass-card flex items-center justify-between ${i === 0 ? 'border-neon-emerald border-opacity-50' : ''}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${i === 0 ? 'bg-neon-emerald text-black' : i === 1 ? 'bg-neon-cyan text-black' : 'bg-neon-pink text-black'}`}>
                                    {i + 1}
                                </div>
                                <span className="text-xl font-black italic uppercase">Team {id}</span>
                            </div>
                            <span className="text-4xl font-black text-neon-cyan">{t.total}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BoardDisplay;
