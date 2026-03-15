import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { defaultFacultyData } from './src/data/facultyData.ts';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedFaculty() {
  console.log('Clearing existing faculty (if any)...');
  await supabase.from('faculty').delete().neq('id', 'dummy');

  console.log(`Uploading ${defaultFacultyData.length} faculty members...`);
  
  const payload = defaultFacultyData.map(f => ({
    name: f.name,
    designation: f.designation,
    qualification: f.qualification || '',
    specialization: f.specialization || '',
    email: f.email || '',
    experience: f.experience || '',
    department_role: f.departmentRole || '',
    order: f.order || 0
  }));

  const { data, error } = await supabase.from('faculty').insert(payload);
  
  if (error) {
    console.error("Error inserting faculty:", error.message);
  } else {
    console.log("Successfully restored faculty data!");
  }
}

seedFaculty();
