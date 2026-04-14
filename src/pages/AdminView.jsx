import React, { useState } from 'react';
import { setEventData, updateTeamScore, resetSubmissions, db } from '../firebase';
import { ref, set } from 'firebase/database';
import { Settings, Play, Square, RefreshCcw, Save, Trash2, Layout, Database, TrendingUp, HelpCircle } from 'lucide-react';

const AdminView = ({ eventData, teams }) => {
  const [password, setPassword] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [r1Scores, setR1Scores] = useState({});
  const [r3Scores, setR3Scores] = useState({});

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') setIsAuth(true);
    else alert('Wrong password');
  };

  if (!isAuth) {
    return (
      <div className="flex h-screen items-center justify-center p-6">
        <form onSubmit={handleLogin} className="glass-card p-10 w-full max-w-4xl space-y-8 animate-reveal">
          <div className="text-center">
             <Settings className="text-neon-primary mb-4 m-auto" size={48} />
             <h2 className="text-4xl font-black heading">System Core</h2>
             <p className="text-secondary text-xs font-bold uppercase tracking-widest mt-4">Authorization Required</p>
          </div>
          <div className="flex flex-col gap-4">
             <input 
               type="password" 
               placeholder="ACCESS KEY" 
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               className="text-center"
             />
             <button type="submit" className="btn-primary w-full py-4 text-xl">Initialize Control</button>
          </div>
        </form>
      </div>
    );
  }

  const saveR1Score = (teamId) => {
    const { correct = 0, skip = 0 } = r1Scores[teamId] || {};
    const score = (correct * 5) - Math.abs(skip);
    updateTeamScore(teamId, { ...teams[teamId], r1: score });
  };

  const saveR3Score = (teamId) => {
    const { humor = 0, creative = 0, relevance = 0 } = r3Scores[teamId] || {};
    const score = Number(humor) + Number(creative) + Number(relevance);
    updateTeamScore(teamId, { ...teams[teamId], r3: score });
  };

  const initializeTeams = () => {
    if (!window.confirm("Format entire database? This wipes all scores.")) return;
    const initial = {};
    for (let i = 1; i <= 10; i++) {
        initial[`T${i}`] = { r1: 0, r2: 0, r3: 0, total: 0 };
    }
    set(ref(db, 'teams'), initial);
  };

  return (
    <div className="max-w-7xl p-6 lg:p-12 flex flex-col gap-12 animate-reveal">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 glass-card p-8">
        <div>
          <h1 className="text-3xl font-black heading flex items-center gap-4">
            <Layout className="text-neon-primary" /> Command Console
          </h1>
          <p className="text-secondary text-xs font-bold tracking-widest uppercase mt-2">Operation Meme War // V1.0.5</p>
        </div>
        <button onClick={initializeTeams} className="btn-secondary">
          <RefreshCcw size={14} /> Full System Reset
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Event State Controls */}
        <section className="glass-card p-8 flex flex-col gap-8 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="heading text-xs text-neon-emerald flex items-center gap-2"><Database size={14}/> Event Matrix</h2>
            <div className={`w-3 h-3 rounded-full ${eventData.submissionOpen ? 'bg-neon-emerald' : 'bg-neon-pink'}`}></div>
          </div>
          
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <label className="text-xs text-secondary uppercase font-bold tracking-widest">Global Round Phase</label>
              <div className="flex gap-2">
                {[1, 2, 3].map(r => (
                  <button 
                    key={r}
                    onClick={() => setEventData({ currentRound: r })}
                    className={`flex-1 py-4 font-black text-xl ${eventData.currentRound === r ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    0{r}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
                <button 
                  onClick={() => setEventData({ submissionOpen: true })}
                  className="btn-primary"
                >
                  <Play size={18} /> Deploy Uplink
                </button>
                <button 
                  onClick={() => setEventData({ submissionOpen: false })}
                  className="btn-secondary"
                >
                  <Square size={18} /> Terminate Uplink
                </button>
            </div>

            <button onClick={resetSubmissions} className="btn-secondary w-full text-xs">
              <Trash2 size={14} /> Wipe Submissions
            </button>
          </div>
        </section>

        {/* Round 2 Mini Round Matrix */}
        <section className="glass-card p-8 lg:col-span-2 flex flex-col gap-8">
          <h2 className="heading text-xs text-neon-primary flex items-center gap-2"><TrendingUp size={14}/> Round 02 Protocol</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <label className="text-xs text-secondary uppercase font-bold tracking-widest">Active Selector Squad</label>
              <select 
                value={eventData.currentSelector || ''}
                onChange={(e) => setEventData({ currentSelector: e.target.value })}
                className="w-full"
              >
                <option value="">AWAITING SELECTION</option>
                {Object.keys(teams).sort().map(id => <option key={id} value={id}>TEAM {id}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-4">
                <label className="text-xs text-secondary uppercase font-bold tracking-widest">Uplink Target Template</label>
                <div className="flex gap-2">
                    <input 
                        type="url" 
                        placeholder="IMAGE URL" 
                        id="new-template-url-admin"
                        className="flex-1"
                    />
                    <button 
                        onClick={() => {
                            const input = document.getElementById('new-template-url-admin');
                            if (input.value) {
                                const current = eventData.availableTemplates || [];
                                setEventData({ availableTemplates: [...current, input.value] });
                                input.value = '';
                            }
                        }}
                        className="btn-primary"
                    >
                        +
                    </button>
                </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5">
             <label className="text-xs text-secondary uppercase font-bold tracking-widest mb-4 block">Available Template Pool</label>
             <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {(eventData.availableTemplates || []).map((url, index) => (
                    <div key={index} className="relative group min-w-[120px] h-[120px] glass-card p-2 shrink-0">
                        <img src={url} className="w-full h-full object-cover rounded-lg" alt="Template" />
                        <button 
                            onClick={() => {
                                const current = [...(eventData.availableTemplates || [])];
                                current.splice(index, 1);
                                setEventData({ availableTemplates: current });
                            }}
                            className="absolute -top-2 -right-2 bg-neon-pink text-white rounded-full p-1 shadow-lg"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                ))}
                {!(eventData.availableTemplates || []).length && <p className="text-secondary text-xs uppercase font-bold opacity-30 italic">No images in pool</p>}
             </div>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Round 1 Scoring */}
        <section className="glass-card overflow-hidden">
          <div className="p-8 border-b border-white/5">
            <h2 className="heading text-xs text-neon-cyan tracking-widest">R01: Rapid Score Matrix</h2>
          </div>
          <div className="overflow-x-auto p-4">
            <table>
              <thead>
                <tr>
                  <th>Codename</th>
                  <th>Hits (x5)</th>
                  <th>Skips</th>
                  <th>Sync</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(teams).sort().map(id => (
                  <tr key={id}>
                    <td className="font-bold text-neon-cyan">Team {id}</td>
                    <td><input type="number" value={r1Scores[id]?.correct || 0} onChange={(e) => setR1Scores({ ...r1Scores, [id]: { ...r1Scores[id], correct: e.target.value }})} className="w-20" /></td>
                    <td><input type="number" value={r1Scores[id]?.skip || 0} onChange={(e) => setR1Scores({ ...r1Scores, [id]: { ...r1Scores[id], skip: e.target.value }})} className="w-20" /></td>
                    <td><button onClick={() => saveR1Score(id)} className="btn-secondary"><Save size={16} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Round 3 Scoring */}
        <section className="glass-card overflow-hidden">
          <div className="p-8 border-b border-white/5">
            <h2 className="heading text-xs text-neon-pink tracking-widest">R03: Showdown Matrix</h2>
          </div>
          <div className="overflow-x-auto p-4">
            <table>
              <thead>
                <tr>
                  <th>Codename</th>
                  <th>Hum (20)</th>
                  <th>Cre (20)</th>
                  <th>Rel (10)</th>
                  <th>Sync</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(teams).sort().map(id => (
                  <tr key={id}>
                    <td className="font-bold text-neon-pink">Team {id}</td>
                    <td><input type="number" onChange={(e) => setR3Scores({...r3Scores, [id]: {...r3Scores[id], humor: e.target.value}})} className="w-16" /></td>
                    <td><input type="number" onChange={(e) => setR3Scores({...r3Scores, [id]: {...r3Scores[id], creative: e.target.value}})} className="w-16" /></td>
                    <td><input type="number" onChange={(e) => setR3Scores({...r3Scores, [id]: {...r3Scores[id], relevance: e.target.value}})} className="w-16" /></td>
                    <td><button onClick={() => saveR3Score(id)} className="btn-secondary"><Save size={16} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminView;
