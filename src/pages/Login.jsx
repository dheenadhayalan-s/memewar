import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { Shield, Zap, Target, Lock, User, AlertCircle } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Enter both username and password');
      return;
    }

    setLoading(true);
    setError('');

    // Read all teams once to check credentials
    const teamsRef = ref(db, 'teams');
    onValue(teamsRef, (snapshot) => {
      const teams = snapshot.val();
      if (!teams) {
        setError('No teams registered. Contact the admin.');
        setLoading(false);
        return;
      }

      // Find team matching username and password
      let matchedTeamId = null;
      for (const [teamId, teamData] of Object.entries(teams)) {
        if (
          teamData.username?.toLowerCase() === username.trim().toLowerCase() &&
          teamData.password === password.trim()
        ) {
          matchedTeamId = teamId;
          break;
        }
      }

      if (matchedTeamId) {
        localStorage.setItem('teamId', matchedTeamId);
        navigate('/team');
      } else {
        setError('Invalid username or password');
        setLoading(false);
      }
    }, { onlyOnce: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-deep">
      <div className="glass-card p-10 w-full max-w-lg animate-reveal shadow-2xl">
        <div className="text-center mb-10">
            <Shield className="text-neon-cyan mb-6 m-auto" size={56} />
            <h1 className="text-4xl font-black text-gradient italic uppercase">War Entry</h1>
            <p className="text-secondary text-xs font-bold tracking-widest uppercase mt-4">Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <label className="text-xs text-secondary font-black uppercase tracking-widest flex items-center gap-2">
              <User size={12} /> Squad Username
            </label>
            <input
              type="text"
              placeholder="ENTER USERNAME"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
              className="text-center font-bold"
              autoComplete="username"
              required
            />
          </div>

          <div className="flex flex-col gap-4">
            <label className="text-xs text-secondary font-black uppercase tracking-widest flex items-center gap-2">
              <Lock size={12} /> Access Key
            </label>
            <input
              type="password"
              placeholder="ENTER PASSWORD"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="text-center font-bold"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="flex items-center justify-center gap-2 p-4 glass-card" style={{
              borderColor: 'rgba(217, 70, 239, 0.4)',
              background: 'rgba(217, 70, 239, 0.05)',
            }}>
              <AlertCircle size={16} style={{ color: 'var(--neon-accent)' }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--neon-accent)' }}>{error}</span>
            </div>
          )}

          <div className="flex flex-col gap-4">
             <button
               type="submit"
               className="btn-primary w-full py-5 text-xl flex items-center justify-center gap-4"
               disabled={loading}
               style={loading ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
             >
                <Target size={24} /> {loading ? 'Authenticating...' : 'Initialize Sync'}
             </button>
             <p className="text-center text-[10px] text-secondary uppercase tracking-[0.2em] font-bold opacity-30 mt-4">
                Connection established via Secure Uplink V.2.0
             </p>
          </div>
        </form>
      </div>
      
      {/* Decorative Background Element */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-cyan opacity-[0.03] rounded-full blur-[120px] pointer-events-none"></div>
    </div>
  );
};

export default Login;
