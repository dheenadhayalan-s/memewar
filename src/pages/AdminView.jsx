import React, { useState } from 'react';
import { setEventData, updateTeamScore, resetSubmissions, wipeProjectData, createTeam, deleteTeam, deleteAllTeams } from '../firebase';
import { Settings, Play, Square, Save, Trash2, Layout, Database, TrendingUp, Eraser, UserPlus, Users, X, Eye, EyeOff, Globe, Search, Plus } from 'lucide-react';

const AdminView = ({ eventData, teams }) => {
  const [password, setPassword] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [r1Scores, setR1Scores] = useState({});
  const [r3Scores, setR3Scores] = useState({});

  // Team creation form state
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamUsername, setNewTeamUsername] = useState('');
  const [newTeamPassword, setNewTeamPassword] = useState('');
  const [showPassword, setShowPassword] = useState({});
  const [creatingTeam, setCreatingTeam] = useState(false);

  // Online template state
  const [onlineTemplates, setOnlineTemplates] = useState([]);
  const [showOnlineBrowser, setShowOnlineBrowser] = useState(false);
  const [templateSearch, setTemplateSearch] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  const fetchOnlineTemplates = async () => {
    if (onlineTemplates.length > 0) {
      setShowOnlineBrowser(!showOnlineBrowser);
      return;
    }
    setIsFetching(true);
    try {
      const resp = await fetch('https://api.imgflip.com/get_memes');
      const data = await resp.json();
      if (data.success) {
        setOnlineTemplates(data.data.memes);
        setShowOnlineBrowser(true);
      }
    } catch (err) {
      alert("Failed to reach template uplink");
    } finally {
      setIsFetching(false);
    }
  };

  const addTemplateFromOnline = (url) => {
    const current = eventData.availableTemplates || [];
    if (current.includes(url)) return;
    setEventData({ availableTemplates: [...current, url] });
  };

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


  const handleWipeData = async () => {
    if (window.confirm("This will erase ALL templates and submissions. Continue?")) {
      try {
        await wipeProjectData();
      } catch (err) {
        alert("Failed to wipe data");
      }
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName.trim() || !newTeamUsername.trim() || !newTeamPassword.trim()) {
      alert('All fields are required');
      return;
    }

    // Check for duplicate usernames
    const existingUsernames = Object.values(teams).map(t => t.username?.toLowerCase());
    if (existingUsernames.includes(newTeamUsername.trim().toLowerCase())) {
      alert('Username already exists! Choose a different one.');
      return;
    }

    setCreatingTeam(true);
    try {
      // Generate team ID from name (e.g., "Team Alpha" -> "TeamAlpha")
      const teamId = newTeamName.trim().replace(/\s+/g, '');
      await createTeam(teamId, {
        name: newTeamName.trim(),
        username: newTeamUsername.trim(),
        password: newTeamPassword.trim(),
      });
      setNewTeamName('');
      setNewTeamUsername('');
      setNewTeamPassword('');
    } catch (err) {
      alert('Failed to create team: ' + err.message);
    } finally {
      setCreatingTeam(false);
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (!window.confirm(`Delete team "${teams[teamId]?.name || teamId}"? This cannot be undone.`)) return;
    try {
      await deleteTeam(teamId);
    } catch (err) {
      alert('Failed to delete team');
    }
  };

  const handleDeleteAllTeams = async () => {
    if (!window.confirm('DELETE ALL TEAMS? This will remove every team and every past submission/round record. This cannot be undone!')) return;
    if (!window.confirm('Wipe everything for a clean start? Type thinking...')) return;
    try {
      await deleteAllTeams();
      await wipeProjectData();
      await resetSubmissions();
    } catch (err) {
      alert('Failed to delete all teams');
    }
  };

  const togglePasswordVisibility = (teamId) => {
    setShowPassword(prev => ({ ...prev, [teamId]: !prev[teamId] }));
  };

  const teamCount = Object.keys(teams).length;

  return (
    <div className="max-w-7xl p-6 lg:p-12 flex flex-col gap-12 animate-reveal">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 glass-card p-8">
        <div>
          <h1 className="text-3xl font-black heading flex items-center gap-4">
            <Layout className="text-neon-primary" /> Command Console
          </h1>
          <p className="text-secondary text-xs font-bold tracking-widest uppercase mt-2">Operation Meme War // V1.0.6</p>
        </div>
        <div className="flex gap-4">
          <button onClick={handleWipeData} className="btn-secondary border-neon-pink text-neon-pink">
            <Eraser size={14} /> Wipe Templates/Subs
          </button>
        </div>
      </header>

      {/* ═══════════════ TEAM MANAGEMENT SECTION ═══════════════ */}
      <section className="glass-card overflow-hidden" style={{ borderColor: 'rgba(139, 92, 246, 0.3)' }}>
        <div className="p-8 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <div className="flex justify-between items-center">
            <h2 className="heading text-xs tracking-widest flex items-center gap-2" style={{ color: 'var(--neon-primary)' }}>
              <Users size={16} /> Team Management
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-dim)' }}>
                {teamCount} {teamCount === 1 ? 'Squad' : 'Squads'} Active
              </span>
              {teamCount > 0 && (
                <button onClick={handleDeleteAllTeams} className="btn-secondary" style={{ borderColor: '#ef4444', color: '#ef4444', fontSize: '0.65rem' }}>
                  <Trash2 size={12} /> Purge All
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-8 flex flex-col gap-8">
          {/* Create Team Form */}
          <form onSubmit={handleCreateTeam} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <UserPlus size={16} style={{ color: '#10b981' }} />
              <h3 className="heading text-xs tracking-widest" style={{ color: '#10b981' }}>Deploy New Squad</h3>
            </div>
            <div className="grid grid-cols-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-dim)' }}>Team Name</label>
                <input
                  type="text"
                  placeholder="e.g. Team Alpha"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-dim)' }}>Username</label>
                <input
                  type="text"
                  placeholder="e.g. alpha2026"
                  value={newTeamUsername}
                  onChange={(e) => setNewTeamUsername(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-dim)' }}>Password</label>
                <input
                  type="text"
                  placeholder="e.g. war@123"
                  value={newTeamPassword}
                  onChange={(e) => setNewTeamPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn-primary w-full mt-4"
              disabled={creatingTeam}
              style={{ padding: '1rem', fontSize: '0.85rem' }}
            >
              <UserPlus size={18} />
              {creatingTeam ? 'Deploying...' : 'Deploy Squad'}
            </button>
          </form>

          {/* Team List */}
          {teamCount > 0 && (
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Team Name</th>
                    <th>Username</th>
                    <th>Password</th>
                    <th>Score</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(teams).sort(([a], [b]) => a.localeCompare(b)).map(([id, team]) => (
                    <tr key={id}>
                      <td className="font-bold" style={{ color: 'var(--neon-primary)' }}>{id}</td>
                      <td className="font-bold">{team.name || id}</td>
                      <td>
                        <span style={{ 
                          background: 'rgba(6, 182, 212, 0.1)',
                          color: 'var(--neon-secondary)',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.5rem',
                          fontSize: '0.8rem',
                          fontFamily: 'monospace',
                        }}>
                          {team.username || '—'}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span style={{
                            fontFamily: 'monospace',
                            fontSize: '0.8rem',
                            color: 'var(--text-dim)',
                          }}>
                            {showPassword[id] ? (team.password || '—') : '••••••••'}
                          </span>
                          {team.password && (
                            <button
                              onClick={() => togglePasswordVisibility(id)}
                              style={{ 
                                padding: '0.25rem',
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-dim)',
                                cursor: 'pointer',
                                minWidth: 'auto',
                              }}
                            >
                              {showPassword[id] ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="font-black" style={{ color: 'var(--neon-secondary)' }}>{team.total || 0}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => handleDeleteTeam(id)}
                          className="btn-secondary"
                          style={{ borderColor: '#ef4444', color: '#ef4444', padding: '0.5rem 0.75rem' }}
                        >
                          <X size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {teamCount === 0 && (
            <div className="text-center p-12" style={{ opacity: 0.4 }}>
              <Users size={48} className="m-auto mb-4" style={{ color: 'var(--text-dim)' }} />
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-dim)' }}>No Squads Deployed</p>
              <p className="text-xs mt-2" style={{ color: 'var(--text-dim)' }}>Create your first team above to get started</p>
            </div>
          )}
        </div>
      </section>

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
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        <input 
                            type="url" 
                            placeholder="PASTE IMAGE URL" 
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
                            <Plus size={18} />
                        </button>
                    </div>
                    <button 
                      onClick={fetchOnlineTemplates}
                      className="btn-secondary w-full text-[10px] py-2 border-dashed border-neon-secondary text-neon-secondary flex items-center justify-center gap-2"
                      disabled={isFetching}
                    >
                      <Globe size={12} /> {isFetching ? 'FETCHING INTEL...' : 'BROWSE ONLINE TEMPLATES'}
                    </button>
                </div>
            </div>
          </div>

          {showOnlineBrowser && (
            <div className="p-6 glass-card border-neon-secondary bg-neon-secondary bg-opacity-5 animate-reveal">
               <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={14} />
                    <input 
                      type="text" 
                      placeholder="SEARCH MEME DATABASE..."
                      value={templateSearch}
                      onChange={(e) => setTemplateSearch(e.target.value)}
                      className="pl-10 text-xs py-2"
                    />
                  </div>
                  <button onClick={() => setShowOnlineBrowser(false)} className="btn-secondary p-2 min-w-0">
                    <X size={14} />
                  </button>
               </div>
               <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {onlineTemplates
                    .filter(m => m.name.toLowerCase().includes(templateSearch.toLowerCase()))
                    .map(meme => (
                      <div 
                        key={meme.id} 
                        onClick={() => addTemplateFromOnline(meme.url)}
                        className="relative cursor-pointer group rounded-lg overflow-hidden border border-white/5 hover:border-neon-secondary transition-all aspect-square"
                      >
                         <img src={meme.url} alt={meme.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                         <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                            <Plus size={20} className="text-neon-secondary" />
                         </div>
                      </div>
                    ))}
               </div>
            </div>
          )}

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
