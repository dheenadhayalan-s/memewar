import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, update, push, remove } from "firebase/database";

// REPLACE WITH YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "meme-war-b7dfe.firebaseapp.com",
  projectId: "meme-war-b7dfe",
  storageBucket: "meme-war-b7dfe.firebasestorage.app",
  messagingSenderId: "239672909198",
  appId: "1:239672909198:web:d1039716a3906b75e6d8df",
  databaseURL: "https://meme-war-b7dfe-default-rtdb.firebaseio.com",
  measurementId: "G-4Z274MK07T"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// DB Helper Methods
export const teamsRef = ref(db, 'teams');
export const eventRef = ref(db, 'event');

export const updateTeamScore = (teamId, scores) => {
  const total = (scores.r1 || 0) + (scores.r2 || 0) + (scores.r3 || 0);
  return update(ref(db, `teams/${teamId}`), { ...scores, total });
};

export const setEventData = (data) => {
  return update(eventRef, data);
};

export const submitCaption = (teamId, caption) => {
  return update(ref(db, `event/submissions`), { [teamId]: caption });
};

export const resetSubmissions = () => {
  return set(ref(db, `event/submissions`), {});
};

export const selectWinners = (winners) => {
  return update(ref(db, `event/rankings`), winners);
};

export const clearSessionData = () => {
  return update(ref(db, 'event'), {
    submissions: {},
    template: null,
    rankings: null,
    submissionOpen: false,
    showMiniRoundResults: false
  });
};

export const wipeProjectData = () => {
  return update(ref(db, 'event'), {
    submissions: {},
    availableTemplates: [],
    template: null,
    rankings: null,
    submissionOpen: false,
    showMiniRoundResults: false
  });
};

// Team Management Helpers
export const createTeam = (teamId, teamData) => {
  return set(ref(db, `teams/${teamId}`), {
    name: teamData.name,
    username: teamData.username,
    password: teamData.password,
    r1: 0,
    r2: 0,
    r3: 0,
    total: 0,
  });
};

export const deleteTeam = (teamId) => {
  return remove(ref(db, `teams/${teamId}`));
};

export const deleteAllTeams = () => {
  return set(ref(db, 'teams'), null);
};
