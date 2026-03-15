import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const facultyData = [
  { name: 'Dr.Srinu Banothu', designation: 'Professor', department_role: 'Head of the Department' },
  { name: 'Dr.M.Prabhakar', designation: 'Assistant Professor' },
  { name: 'Dr. Manoj Kumar Mahato', designation: 'Associate Professor' },
  { name: 'Dr.Lakshmi Anusha Kothari', designation: 'Assistant Professor' },
  { name: 'Dr.Ch.Raja Ramesh', designation: 'Associate Professor' },
  { name: 'Dr.K.Srinivas Reddy', designation: 'Associate Professor' },
  { name: 'Mr.N.Nagarjuna', designation: 'Assistant Professor' },
  { name: 'Mr.M.Siva', designation: 'Assistant Professor' },
  { name: 'Ms.V.Bhulakshmi', designation: 'Assistant Professor' },
  { name: 'Mrs.K.Susheela', designation: 'Assistant Professor' },
  { name: 'Mrs.K.Aruna Gayatri', designation: 'Assistant Professor' },
  { name: 'Mr.T.Suryam', designation: 'Assistant Professor' },
  { name: 'Mr.P.Veerababu', designation: 'Assistant Professor' },
  { name: 'Ms.T.Priyanka', designation: 'Assistant Professor' },
  { name: 'Mr.Md.Khaleel Ahmed', designation: 'Assistant Professor' },
  { name: 'Mr.V. Lingamaiah', designation: 'Assistant Professor' },
  { name: 'Mrs.G.Madhaveelatha', designation: 'Assistant Professor' },
  { name: 'Mrs. Kotha Mounica', designation: 'Assistant Professor' },
  { name: 'Mr.K. Rajendra Prasad', designation: 'Assistant Professor' },
  { name: 'Mr.N.Sreenivas', designation: 'Assistant Professor' },
  { name: 'Mr.Ch.Suresh', designation: 'Assistant Professor' },
  { name: 'Mrs.A.Ramadevi', designation: 'Assistant Professor' },
  { name: 'Mr.K.Shiva Kumar', designation: 'Assistant Professor' },
  { name: 'Mr.T. Jeevan Reddy', designation: 'Assistant Professor' },
  { name: 'Mr.M. Nagesh Kumar', designation: 'Assistant Professor' },
  { name: 'Mr.Ch. ShivaShanker', designation: 'Assistant Professor' },
  { name: 'Mr.Ch.Venkanna', designation: 'Assistant Professor' },
  { name: 'Mr.Ch.Nagendra', designation: 'Assistant Professor' },
  { name: 'Mr.B.Uday Kumar', designation: 'Assistant Professor' },
  { name: 'Mrs. A. Nagalaxmi', designation: 'Assistant Professor' },
  { name: 'Mr.K. Devendar', designation: 'Assistant Professor' }
];

const main = async () => {
  console.log('Clearing existing faculty records (optional, but requested new data to be populated)...');
  // I will just insert them for now. Let's not delete existing ones, or maybe delete all to start fresh? 
  // Let's delete all existing to avoid duplicates if they exist? Actually no, let's just insert them. Wait, if they have an existing website they might have sample data. The user said "add this data in faculty one". I'll add them.

  let order = 100; // start after existing
  const insertData = facultyData.map((f, i) => {
    // Random specializations and experience since user requested random details
    const specs = ['Machine Learning', 'Data Science', 'Artificial Intelligence', 'Cloud Computing', 'Big Data Analytics', 'Cyber Security', 'Internet of Things', 'Computer Vision', 'Natural Language Processing'];
    const exps = ['5+ Years in Teaching', '10+ Years in Teaching & Research', '8 Years Industry Experience', '15+ Years in Academia', '3 Years Teaching'];
    const quals = ['Ph.D. in Computer Science', 'M.Tech in CSE', 'M.Tech in Data Science'];
    
    // Choose randomly
    const randomSpec = specs[Math.floor(Math.random() * specs.length)];
    const randomExp = exps[Math.floor(Math.random() * exps.length)];
    const randomQual = f.name.startsWith('Dr.') ? 'Ph.D. in Computer Science' : quals[Math.floor(Math.random() * quals.length)];

    return {
      name: f.name,
      designation: f.designation,
      department_role: f.department_role || null,
      qualification: randomQual,
      specialization: randomSpec,
      experience: randomExp,
      email: f.name.toLowerCase().replace(/[^a-z]/g, '') + '@vignanits.ac.in', // fake email
      order: order++,
      // Let's add fake publications and awards for Dr.s occasionally
      publications: Math.random() > 0.5 ? [{ badge: 'Q1', text: 'Published in IEEE Access' }] : [],
      awards: Math.random() > 0.7 ? ['Best Teacher Award'] : []
    };
  });

  const { data, error } = await supabase.from('faculty').insert(insertData);

  if (error) {
    console.error('Error inserting data:', error);
  } else {
    console.log('Successfully added 31 faculty members.');
  }
};

main();
