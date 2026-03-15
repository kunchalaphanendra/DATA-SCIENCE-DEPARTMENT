import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
// Using anon key, if it lacks permissions, this will fail and user will need to use dashboard.

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const bucketsToCreate = ['events', 'achievements', 'gallery', 'faculty', 'placements'];

async function setupBuckets() {
  console.log('Setting up Supabase storage buckets...');
  
  for (const bucketName of bucketsToCreate) {
    console.log(`Creating bucket: ${bucketName}...`);
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: true,
      allowedMimeTypes: ['image/*'],
      fileSizeLimit: 5242880 // 5MB
    });
    
    if (error) {
       if (error.message.includes('already exists')) {
           console.log(`Bucket ${bucketName} already exists.`);
       } else {
           console.error(`Error creating ${bucketName}:`, error.message);
       }
    } else {
      console.log(`Successfully created bucket: ${bucketName}`);
    }
  }
}

setupBuckets();
