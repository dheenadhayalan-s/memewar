import { db } from './src/firebase.js';
import { update, ref, get } from 'firebase/database';

async function run() {
  console.log("Fetching top memes from Imgflip...");
  const resp = await fetch('https://api.imgflip.com/get_memes');
  const data = await resp.json();
  
  if (data.success) {
    // Filter memes to only those that are easily captionable in one sentence (box_count <= 2)
    const newTemplates = data.data.memes
      .filter(m => m.box_count <= 2)
      .slice(0, 100)
      .map(m => m.url);
    
    // Fetch existing so we don't overwrite
    const eventSnap = await get(ref(db, 'event/availableTemplates'));
    const existing = eventSnap.val() || [];
    
    // Merge unique
    const merged = [...new Set([...existing, ...newTemplates])];
    
    console.log(`Uploading ${merged.length} templates (added ${newTemplates.length} easy-caption memes) to Firebase...`);
    await update(ref(db, 'event'), { availableTemplates: merged });
    console.log("Done! Memes successfully injected.");
  } else {
    console.log("Imgflip API failed.");
  }
  process.exit(0);
}

run().catch(console.error);
