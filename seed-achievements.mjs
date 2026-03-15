import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

const newAchievements = [
  {
    title: "1st Prize in National Hackathon",
    student_name: "Rahul Kumar",
    category: "Technical",
    date: "2024-01-15",
    description: "Won first place in a national-level hackathon by developing an AI-based traffic management system.",
    image_url: ""
  },
  {
    title: "Best Paper Award at IEEE Conference",
    student_name: "Ananya Reddy",
    category: "Academic",
    date: "2023-05-20",
    description: "Received the best research paper award for work on machine learning optimization.",
    image_url: ""
  },
  {
    title: "Winner – Inter College Coding Competition",
    student_name: "Karthik Varma",
    category: "Technical",
    date: "2024-02-10",
    description: "Secured first position among 150 participants in a competitive coding contest.",
    image_url: ""
  },
  {
    title: "Gold Medal in University Examinations",
    student_name: "Sneha Sharma",
    category: "Academic",
    date: "2023-08-15",
    description: "Achieved the highest CGPA in the department and received a university gold medal.",
    image_url: ""
  },
  {
    title: "2nd Prize in National Level Data Science Challenge",
    student_name: "Vikram Patel",
    category: "Technical",
    date: "2024-03-05",
    description: "Built a predictive analytics model for healthcare data.",
    image_url: ""
  },
  {
    title: "Winner – State Level Debate Competition",
    student_name: "Priya Nair",
    category: "Curricular",
    date: "2023-11-12",
    description: "Represented the college and won the first prize in a state-level debate event.",
    image_url: ""
  },
  {
    title: "Finalist in Smart India Hackathon",
    student_name: "Rohit Singh",
    category: "Technical",
    date: "2024-04-20",
    description: "Developed an innovative solution for smart city waste management.",
    image_url: ""
  },
  {
    title: "Best Innovator Award",
    student_name: "Neha Gupta",
    category: "Curricular",
    date: "2023-09-25",
    description: "Designed a low-cost IoT device for real-time environmental monitoring.",
    image_url: ""
  },
  {
    title: "1st Prize in Inter University Robotics Competition",
    student_name: "Arjun Mehta",
    category: "Technical",
    date: "2024-01-30",
    description: "Led a team that built an autonomous robot for obstacle navigation.",
    image_url: ""
  },
  {
    title: "Excellence in Community Service",
    student_name: "Aisha Khan",
    category: "Sports",
    date: "2023-12-05",
    description: "Organized multiple tech awareness workshops for rural school students.",
    image_url: ""
  }
];

async function seedAchievements() {
  console.log(`Uploading ${newAchievements.length} achievements...`);
  
  const { data, error } = await supabase.from('achievements').insert(newAchievements);
  
  if (error) {
    console.error("Error inserting achievements:", error.message);
  } else {
    console.log("Successfully added all achievements!");
  }
}

seedAchievements();
