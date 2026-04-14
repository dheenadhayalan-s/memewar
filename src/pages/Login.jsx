import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [teamId, setTeamId] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (teamId) {
      localStorage.setItem('teamId', teamId.toUpperCase());
      navigate('/team');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card neon-border-cyan w-full max-w-md text-center">
        <h1 className="text-neon-cyan mb-8">Meme War Login</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-secondary mb-2 uppercase text-xs">Team ID (e.g., T1, T2)</label>
            <input 
              type="text" 
              placeholder="ENTER TEAM ID" 
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className="text-center text-xl uppercase tracking-widest"
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full">Join War</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
