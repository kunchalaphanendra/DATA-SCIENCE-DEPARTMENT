import { Event } from '@/src/types';

export const defaultEventsData: Event[] = [
  {
    id: 'e-1',
    title: 'National Conference on Data Science & AI (NCDSAI 2026)',
    description: 'A 2-day national conference bringing together researchers, faculty, and students to discuss cutting-edge advances in Machine Learning, Big Data Analytics, and Artificial Intelligence.',
    date: '2026-09-15',
    venue: 'Main Auditorium, VITS Campus',
    category: 'Conference',
    status: 'Upcoming',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'e-2',
    title: 'Data Science & Predictive Analytics Hackathon',
    description: 'A 24-hour non-stop coding hackathon where students build real-world data science solutions for smart city and healthcare challenges.',
    date: '2026-08-28',
    venue: 'CSE(DS) Advanced Data Lab',
    category: 'Hackathon',
    status: 'Upcoming',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'e-3',
    title: 'Workshop on Generative AI & Deep Learning with PyTorch',
    description: 'Hands-on technical workshop focused on Transformer architectures, LLMs, and Generative Adversarial Networks (GANs).',
    date: '2026-07-10',
    venue: 'Seminar Hall 2',
    category: 'Workshop',
    status: 'Past',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'e-4',
    title: 'Guest Lecture on Cloud Data Engineering & Snowflake',
    description: 'Industry expert lecture by Sr. Data Architect from MNC on cloud data warehousing, ETL pipelines, and real-time streaming.',
    date: '2026-06-20',
    venue: 'E-Classroom 401',
    category: 'Guest Lecture',
    status: 'Past',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
  },
];
