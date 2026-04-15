import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { submitCaption } from '../firebase';
import { Trophy, Send, Clock, User, Zap, Activity, ImageIcon } from 'lucide-react';
import SelectorView from './SelectorView';

const ParticipantView = ({ eventData, teams }) => {
  const teamId = localStorage.getItem('teamId');
  const [caption, setCaption] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If teams have been loaded from Firebase but our ID isn't in there,
    // it means the team was deleted by the admin. Force a logout.
    if (teamId && teams && Object.keys(teams).length > 0 && !teams[teamId]) {
      localStorage.removeItem('teamId');
      navigate('/login');
    }
  }, [teamId, teams, navigate]);

  useEffect(() => {
    if (!eventData?.template) {
      setCaption('');
      setSubmitted(false);
    }
  }, [eventData?.template]);

  if (!teamId) return <Navigate to="/login" />;

  const teamInfo = teams[teamId] || { r1: 0, r2: 0, r3: 0, total: 0 };
  const sortedTeams = Object.entries(teams)
    .sort(([, a], [, b]) => b.total - a.total);
  
  const rank = sortedTeams.findIndex(([id]) => id === teamId) + 1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption) return;
    try {
      await submitCaption(teamId, caption);
      setSubmitted(true);
    } catch (err) {
      alert("Submission failed");
    }
  };

  const isRound2 = eventData?.currentRound === 2;
  const isSubmissionOpen = eventData?.submissionOpen;
  const alreadySubmitted = eventData?.submissions?.[teamId] || submitted;
  const isSelector = eventData?.currentSelector === teamId;

  return (
    <div className="max-w-6xl p-6 lg:p-12 flex flex-col gap-10 animate-reveal">
      <div className="w-full flex flex-col md:flex-row gap-8 justify-between items-stretch md:items-center glass-card p-4">
        <div className="flex items-center gap-6 px-4">
          <div className="w-14 h-14 rounded-2xl bg-neon-primary bg-opacity-20 flex items-center justify-center">
            <User size={28} className="text-neon-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-gradient italic uppercase tracking-tighter leading-none">Team {teamId}</h1>
            <div className="flex gap-4 mt-2">
               <span className="text-[10px] text-secondary font-bold uppercase tracking-widest opacity-70">Rank #{rank}</span>
               <button 
                  onClick={() => { localStorage.removeItem('teamId'); window.location.href = '/login'; }}
                  className="text-[10px] text-red-500 font-bold uppercase tracking-widest hover:underline"
               >
                  Switch Team
               </button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-8 px-8 py-2 bg-white bg-opacity-[0.02] rounded-2xl border border-white border-opacity-5">
           <div className="text-right">
              <p className="text-[10px] text-secondary font-black uppercase tracking-widest opacity-40">Squad Power</p>
              <p className="text-4xl font-black text-neon-primary tabular-nums">{teamInfo.total}</p>
           </div>
           <Zap className="text-neon-primary" size={32} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="glass-card p-8 bg-neon-primary bg-opacity-5">
                <div className="flex items-center gap-3 mb-4">
                    <Clock className="text-neon-primary" size={20} />
                    <h3 className="heading text-xs text-secondary tracking-widest uppercase">Round Status</h3>
                </div>
                <p className="text-3xl font-black italic">
                    {isRound2 ? (
                        <span className="text-neon-pink">ROUND 2: CAPTION COMPETITION</span>
                    ) : (
                        `ROUND ${eventData?.currentRound || 1}: START`
                    )}
                </p>
            </div>

            {isRound2 && (
                isSelector ? (
                    <SelectorView eventData={eventData} teams={teams} />
                ) : (
                    <div className="glass-card p-8 flex flex-col gap-8">
                        <div className="flex justify-between items-center">
                            <h2 className="heading text-xl text-neon-pink uppercase">Meme Image</h2>
                        </div>
                        {eventData?.showMiniRoundResults ? (
                            <div className="flex flex-col gap-6 w-full animate-reveal">
                                <div className="text-center mb-4">
                                    <Trophy size={48} className="text-neon-pink m-auto mb-4" />
                                    <p className="text-neon-pink font-black uppercase tracking-widest text-xl">Mini Round Finished</p>
                                    <p className="text-secondary text-xs mt-2 font-bold uppercase">Behold the Champion Captions</p>
                                </div>
                                <div className="flex flex-col gap-4">
                                    {['first', 'second', 'third'].map((rank, i) => {
                                        const winnerId = eventData?.rankings?.[rank];
                                        const winnerCaption = eventData?.submissions?.[winnerId];
                                        if (!winnerId) return null;
                                        const borderClass = i === 0 ? 'border-[#10b981]' : i === 1 ? 'border-[#06b6d4]' : 'border-[#d946ef]';
                                        const textClass = i === 0 ? 'text-[#10b981]' : i === 1 ? 'text-[#06b6d4]' : 'text-[#d946ef]';
                                        
                                        return (
                                            <div key={rank} className={`p-6 glass-card border-l-[8px] ${borderClass} flex flex-col gap-4 relative overflow-hidden`}>
                                                {i === 0 && <div className="absolute top-0 right-0 bg-[#10b981] text-black text-[10px] font-black px-3 py-1 uppercase rounded-bl-lg">1st Place</div>}
                                                {i === 1 && <div className="absolute top-0 right-0 bg-[#06b6d4] text-black text-[10px] font-black px-3 py-1 uppercase rounded-bl-lg">2nd Place</div>}
                                                {i === 2 && <div className="absolute top-0 right-0 bg-[#d946ef] text-black text-[10px] font-black px-3 py-1 uppercase rounded-bl-lg">3rd Place</div>}
                                                
                                                <p className="text-xl font-bold italic text-white pr-16 bg-white bg-opacity-5 p-4 rounded-xl border border-white border-opacity-10">"{winnerCaption}"</p>
                                                <p className={`text-xs font-black uppercase tracking-[0.2em] ${textClass}`}>By Team {winnerId}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                                <p className="text-center text-[10px] font-bold text-secondary uppercase tracking-[0.2em] opacity-40 mt-4 animate-pulse">Waiting for admin to start next round...</p>
                            </div>
                        ) : (
                            <>
                                {eventData?.template ? (
                                    <div className="relative overflow-hidden rounded-2xl border border-white/10">
                                        <img src={eventData.template} alt="Target" className="w-full h-auto object-cover" />
                                    </div>
                                ) : (
                                    <div className="h-64 glass-card flex flex-col items-center justify-center gap-4 opacity-50">
                                        <ImageIcon size={40} />
                                        <p className="text-xs font-bold tracking-widest uppercase text-secondary">Waiting for Meme...</p>
                                    </div>
                                )}

                                {isSubmissionOpen ? (
                                    alreadySubmitted ? (
                                        <div className="p-10 glass-card text-center">
                                            <Trophy size={48} className="text-neon-emerald m-auto mb-4" />
                                            <p className="text-neon-emerald font-black uppercase tracking-widest text-lg">Entry Received!</p>
                                            <p className="text-secondary text-sm mt-2 font-bold">Your caption is now being judged.</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                            <textarea 
                                                placeholder="Type your funny caption here..."
                                                value={caption}
                                                onChange={(e) => setCaption(e.target.value)}
                                                className="h-32"
                                                required
                                            />
                                            <button type="submit" className="btn-primary w-full py-5 text-xl">
                                                <Send size={24} /> Submit Caption
                                            </button>
                                        </form>
                                    )
                                ) : (
                                    <div className="p-12 glass-card text-center">
                                        <Clock size={40} className="text-neon-pink m-auto mb-4" />
                                        <p className="text-neon-pink font-black uppercase tracking-widest">Submissions Closed</p>
                                        <p className="text-secondary text-xs mt-2 font-bold">The time to submit captions has ended.</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )
            )}

            {!isSelector && (
              <div className="grid grid-cols-3 gap-6">
                  {[1, 2, 3].map(r => (
                      <div key={r} className="glass-card p-6 text-center">
                          <p className="text-xs text-secondary font-black uppercase tracking-widest mb-2">Round 0{r}</p>
                          <p className="text-3xl font-black text-white">{teamInfo[`r${r}`] || 0}</p>
                      </div>
                  ))}
              </div>
            )}
        </div>

        <div className="flex flex-col gap-8">
            <div className="glass-card p-8 h-full flex flex-col">
                <h3 className="heading text-xs text-neon-cyan mb-8 flex items-center gap-2 tracking-widest">
                  <Trophy size={16} /> Global Rank
                </h3>
                <div className="flex flex-col gap-4 flex-1">
                    {sortedTeams.slice(0, 8).map(([id, t], i) => (
                        <div 
                          key={id} 
                          className={`flex justify-between items-center p-4 rounded-xl ${id === teamId ? 'bg-neon-cyan bg-opacity-10 border border-neon-cyan' : 'bg-white bg-opacity-5'}`}
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-black text-secondary">
                                  {i + 1}
                                </span>
                                <span className="font-bold uppercase text-xs tracking-widest">Team {id}</span>
                            </div>
                            <span className="font-black text-neon-cyan tabular-nums">{t.total}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantView;
