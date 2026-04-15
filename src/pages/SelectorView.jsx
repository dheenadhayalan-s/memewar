import React, { useState, useMemo, useEffect } from 'react';
import { updateTeamScore, selectWinners, setEventData } from '../firebase';
import { Trophy, Star, Clock, Image as ImageIcon } from 'lucide-react';

const SelectorView = ({ eventData, teams }) => {
  const teamId = localStorage.getItem('teamId');
  const [selections, setSelections] = useState({ first: '', second: '', third: '' });
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (!eventData?.template) {
      setSelections({ first: '', second: '', third: '' });
      setIsLocked(false);
    }
  }, [eventData?.template]);

  // ALL HOOKS MUST BE AT THE TOP - Fixed the "Rendered more hooks" error
  const shuffledSubmissions = useMemo(() => {
    const caps = Object.entries(eventData?.submissions || {})
      .filter(([id]) => id !== teamId)
      .map(([id, caption]) => ({ id, caption }));
    return caps.sort(() => Math.random() - 0.5);
  }, [eventData?.submissions, teamId]);

  if (eventData.currentSelector !== teamId) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center animate-reveal">
        <div className="glass-card p-12 max-w-lg border-primary">
          <Trophy size={60} className="m-auto mb-6 text-neon-pink" />
          <h2 className="text-3xl font-bold mb-4 uppercase">Wait Your Turn</h2>
          <p className="text-secondary leading-relaxed uppercase tracking-widest text-xs">
            Only <span className="text-neon-cyan font-bold">Team {eventData.currentSelector}</span> is allowed to pick winners right now.
          </p>
          <button onClick={() => window.location.href = '/team'} className="btn-primary mt-8">Go Back</button>
        </div>
      </div>
    );
  }

  const handleSetTemplate = async (selectedUrl) => {
    if (!selectedUrl) return;
    try {
      await setEventData({ template: selectedUrl });
    } catch (err) {
      alert("Failed to set template");
    }
  };

  const handleSelect = (rank, targetTeamId) => {
    if (isLocked) return;
    setSelections(prev => {
      const newSelections = { ...prev };
      Object.keys(newSelections).forEach(key => {
        if (newSelections[key] === targetTeamId) newSelections[key] = '';
      });
      newSelections[rank] = targetTeamId;
      return newSelections;
    });
  };

  const submitFinalSelection = async () => {
    if (!selections.first || !selections.second || !selections.third) return;
    try {
      const { first, second, third } = selections;
      await updateTeamScore(first, { ...teams[first], r2: (teams[first]?.r2 || 0) + 5 });
      await updateTeamScore(second, { ...teams[second], r2: (teams[second]?.r2 || 0) + 3 });
      await updateTeamScore(third, { ...teams[third], r2: (teams[third]?.r2 || 0) + 2 });
      await selectWinners(selections);
      setIsLocked(true);
    } catch (err) {
      alert("Error finalizing rankings");
    }
  };

  // Selection View
  if (!eventData.template || eventData.template === "") {
    const availableTemplates = eventData.availableTemplates || [];
    return (
      <div className="flex flex-col gap-8 animate-reveal">
        <div className="text-center flex flex-col gap-4">
          <h1 className="text-4xl font-black text-gradient uppercase italic">Pick a Meme</h1>
          <p className="text-secondary text-xs uppercase tracking-widest">Choose the image everyone will write a caption for.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
           {availableTemplates.map((url, i) => (
              <div 
                key={i}
                className="glass-card p-3 cursor-pointer overflow-hidden transform"
                onClick={() => handleSetTemplate(url)}
              >
                 <img src={url} alt={`template-${i}`} className="w-full object-cover h-64 rounded-xl" />
                 <div className="text-center mt-3">
                    <span className="btn-primary text-xs py-2 px-6">Select</span>
                 </div>
              </div>
           ))}
           {availableTemplates.length === 0 && (
              <div className="col-span-full py-20 glass-card text-center flex flex-col items-center gap-4 opacity-50">
                  <ImageIcon size={48} className="text-secondary" />
                  <p className="text-secondary uppercase tracking-widest text-xs font-bold">Waiting for admin to add memes...</p>
              </div>
           )}
        </div>
      </div>
    );
  }

  // Judging View
  return (
    <div className="flex flex-col gap-12 animate-reveal pb-32">
      <header className="text-center flex flex-col gap-4">
        <div className="m-auto flex items-center gap-3 px-4 py-1 rounded-full bg-neon-primary bg-opacity-10 border border-neon-primary border-opacity-20 text-neon-primary text-xs font-bold uppercase tracking-widest">
            <Star size={12} /> Judge Panel
        </div>
        <h1 className="text-4xl font-black text-gradient uppercase italic">Pick Winners</h1>
        <p className="text-secondary text-xs uppercase tracking-widest">Select the best 3 captions below.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        {shuffledSubmissions.map((sub, index) => {
          const rank = Object.keys(selections).find(k => selections[k] === sub.id);
          const rankLabel = rank === 'first' ? '1ST' : rank === 'second' ? '2ND' : rank === 'third' ? '3RD' : null;

          return (
            <div 
              key={sub.id} 
              className={`glass-card p-8 relative flex flex-col gap-6 ${rank ? 'border-neon-primary' : ''}`}
            >
              {rankLabel && (
                  <div className={`absolute -top-4 -right-4 w-12 h-12 rounded-xl flex items-center justify-center font-black ${rankLabel === '1ST' ? 'bg-neon-emerald text-black' : rankLabel === '2ND' ? 'bg-neon-cyan text-black' : 'bg-neon-pink text-black'}`}>
                      {rankLabel}
                  </div>
              )}

              <div className="flex flex-col gap-4">
                <span className="text-xs font-bold text-secondary uppercase tracking-widest">Entry #{index + 1}</span>
                <p className="text-xl font-bold italic text-white">"{sub.caption}"</p>
                
                <div className="flex gap-4 pt-4 border-t border-white border-opacity-5">
                  <button onClick={() => handleSelect('first', sub.id)} className={`rank-btn ${rank === 'first' ? 'active-1' : ''}`}>1ST</button>
                  <button onClick={() => handleSelect('second', sub.id)} className={`rank-btn ${rank === 'second' ? 'active-2' : ''}`}>2ND</button>
                  <button onClick={() => handleSelect('third', sub.id)} className={`rank-btn ${rank === 'third' ? 'active-3' : ''}`}>3RD</button>
                </div>
              </div>
            </div>
          );
        })}

        {shuffledSubmissions.length === 0 && (
          <div className="col-span-full h-80 glass-card flex flex-col items-center justify-center gap-6 opacity-50">
            <Clock size={40} className="text-neon-primary" />
            <p className="uppercase tracking-widest text-xs font-bold">Waiting for others to submit captions...</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 z-50">
          <div className="max-w-6xl m-auto glass-card p-6 flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl">
                <div className="flex gap-8 items-center">
                    <span className={`text-xs font-black uppercase tracking-widest ${selections.first ? 'text-neon-emerald' : 'text-secondary opacity-30'}`}>GOLD</span>
                    <span className={`text-xs font-black uppercase tracking-widest ${selections.second ? 'text-neon-cyan' : 'text-secondary opacity-30'}`}>SILVER</span>
                    <span className={`text-xs font-black uppercase tracking-widest ${selections.third ? 'text-neon-pink' : 'text-secondary opacity-30'}`}>BRONZE</span>
                </div>

                <button 
                  onClick={submitFinalSelection} 
                  disabled={isLocked || !selections.first || !selections.second || !selections.third}
                  className={`btn-primary px-12 ${isLocked || !selections.first || !selections.second || !selections.third ? 'opacity-30' : ''}`}
                >
                   {isLocked ? 'Rankings Locked' : 'Submit Rankings'}
                </button>
          </div>
      </div>
    </div>
  );
};

export default SelectorView;
