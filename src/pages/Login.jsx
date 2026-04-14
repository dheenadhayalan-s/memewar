import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap, Target } from 'lucide-react';

const Login = () => {
  const [selectedTeam, setSelectedTeam] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (selectedTeam) {
      localStorage.setItem('teamId', selectedTeam);
      navigate('/team');
    }
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
            <label className="text-xs text-secondary font-black uppercase tracking-widest">Select Squad Identity</label>
            <select 
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full text-center font-bold"
              required
            >
              <option value="" disabled>CHOOSE YOUR TEAM</option>
              {Array.from({ length: 15 }, (_, i) => `T${i + 1}`).map(id => (
                <option key={id} value={id}>SQUAD {id}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-4">
             <button type="submit" className="btn-primary w-full py-5 text-xl flex items-center justify-center gap-4">
                <Target size={24} /> Initialize Sync
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
