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
      {/* Header Info */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black text-gradient uppercase italic">{teamInfo.name || `Team ${teamId}`}</h1>
            <div className="flex gap-4">
                <span className="text-xs font-bold py-1 px-3 bg-neon-cyan opacity-20 rounded-full text-neon-cyan uppercase tracking-widest flex items-center gap-2">
                   <Activity size={10} /> Rank #{rank}
                </span>
                <button 
                  onClick={() => { localStorage.removeItem('teamId'); window.location.href = '/login'; }}
                  className="text-xs font-bold py-1 px-3 bg-white opacity-10 hover:opacity-30 rounded-full text-white uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer"
                >
                   Logout
                </button>
            </div>
        </div>
        
        <div className="glass-card p-6 min-w-[200px] flex justify-between items-center">
           <div>
              <p className="text-xs text-secondary font-bold uppercase tracking-widest mb-1">Combat Power</p>
              <p className="text-4xl font-black text-neon-primary">{teamInfo.total}</p>
           </div>
           <Zap className="text-neon-primary" size={32} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="glass-card p-8 bg-neon-primary bg-opacity-5">
                <div className="flex items-center gap-3 mb-4">
                    <Clock className="text-neon-primary" size={20} />
                    <h3 className="heading text-xs text-secondary tracking-widest">Operation Status</h3>
                </div>
                <p className="text-3xl font-black italic">
                    {isRound2 ? (
                        <span className="text-neon-pink">ROUND 02: CAPTION PROTOCOL</span>
                    ) : (
                        `ROUND 0${eventData?.currentRound || 1}: INITIAL STRIKE`
                    )}
                </p>
            </div>

            {isRound2 && (
                isSelector ? (
                    <SelectorView eventData={eventData} teams={teams} />
                ) : (
                    <div className="glass-card p-8 flex flex-col gap-8">
                        <div className="flex justify-between items-center">
                            <h3 className="heading text-xl text-neon-pink">Meme Target</h3>
                        </div>

                        {eventData?.template ? (
                            <div className="relative overflow-hidden rounded-2xl border border-white/10">
                                <img src={eventData.template} alt="Target" className="w-full h-auto object-cover" />
                            </div>
                        ) : (
                            <div className="h-64 glass-card flex flex-col items-center justify-center gap-4 opacity-50">
                                <ImageIcon size={40} />
                                <p className="text-xs font-bold tracking-widest uppercase text-secondary">Awaiting Target Intel...</p>
                            </div>
                        )}

                        {isSubmissionOpen ? (
                            alreadySubmitted ? (
                                <div className="p-10 glass-card text-center">
                                    <Trophy size={48} className="text-neon-emerald m-auto mb-4" />
                                    <p className="text-neon-emerald font-black uppercase tracking-widest text-lg">Infiltration Complete</p>
                                    <p className="text-secondary text-sm mt-2 font-bold">Your caption is being evaluated by the judge.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                    <textarea 
                                        placeholder="ENGAGE WIT..."
                                        value={caption}
                                        onChange={(e) => setCaption(e.target.value)}
                                        className="h-32"
                                        required
                                    />
                                    <button type="submit" className="btn-primary w-full py-5 text-xl">
                                        <Send size={24} /> Transmit Caption
                                    </button>
                                </form>
                            )
                        ) : (
                            <div className="p-12 glass-card text-center">
                                <Clock size={40} className="text-neon-pink m-auto mb-4" />
                                <p className="text-neon-pink font-black uppercase tracking-widest">Round Offline</p>
                                <p className="text-secondary text-xs mt-2 font-bold">The submission window has been terminated.</p>
                            </div>
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
