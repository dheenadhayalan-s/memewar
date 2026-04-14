import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { db, eventRef, teamsRef } from './firebase';
import { onValue } from 'firebase/database';

import ParticipantView from './pages/ParticipantView';
import AdminView from './pages/AdminView';
import SelectorView from './pages/SelectorView';
import BoardDisplay from './pages/BoardDisplay';
import Login from './pages/Login';

function App() {
  const [eventData, setEventData] = useState(null);
  const [teams, setTeams] = useState({});
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribeEvent = () => {};
    let unsubscribeTeams = () => {};

    try {
      unsubscribeEvent = onValue(eventRef, (snapshot) => {
        setEventData(snapshot.val() || {});
      }, (err) => {
        console.error("Firebase Event Error:", err);
        setError(`Database connection failed: ${err.message}. Did you update Firebase rules to allow public read/write for testing?`);
        setLoading(false);
      });

      unsubscribeTeams = onValue(teamsRef, (snapshot) => {
        setTeams(snapshot.val() || {});
        setLoading(false);
      }, (err) => {
        console.error("Firebase Teams Error:", err);
        setError(`Database connection failed: ${err.message}.`);
        setLoading(false);
      });
    } catch (err) {
      console.error("Firebase Initialization Error:", err);
      setError(`Initialization failed: ${err.message}`);
      setLoading(false);
    }

    return () => {
      unsubscribeEvent();
      unsubscribeTeams();
    };
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-black">
        <div className="glass-card neon-border-pink text-center max-w-md">
          <h2 className="text-neon-pink mb-4">Connection Error</h2>
          <p className="text-secondary">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-neon-cyan heading animate-pulse">Loading Meme War...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/team" />} />
          <Route path="/team" element={<ParticipantView eventData={eventData} teams={teams} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminView eventData={eventData} teams={teams} />} />
          <Route path="/board" element={<BoardDisplay eventData={eventData} teams={teams} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
