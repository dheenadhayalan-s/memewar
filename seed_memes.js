import { db } from './src/firebase.js';
import { update, ref, get } from 'firebase/database';

async function run() {
  console.log("Fetching top memes from Imgflip...");
  const resp = await fetch('https://api.imgflip.com/get_memes');
  const data = await resp.json();
  
  if (data.success) {
    const newTemplates = data.data.memes.slice(0, 50).map(m => m.url);
    
    // Fetch existing so we don't overwrite
    const eventSnap = await get(ref(db, 'event/availableTemplates'));
    const existing = eventSnap.val() || [];
    
    // Merge unique
    const merged = [...new Set([...existing, ...newTemplates])];
    
    console.log(`Uploading ${merged.length} templates (added ${newTemplates.length}) to Firebase...`);
    await update(ref(db, 'event'), { availableTemplates: merged });
    console.log("Done! Memes successfully injected.");
  } else {
    console.log("Imgflip API failed.");
  }
  process.exit(0);
}

run().catch(console.error);
