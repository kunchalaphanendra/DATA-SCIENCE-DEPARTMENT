export type Priority = 'High' | 'Normal';
export type EventStatus = 'Upcoming' | 'Past';

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  expiryDate?: string;
  priority: Priority;
  createdAt?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  category: string;
  imageUrl?: string;
  status: EventStatus;
  createdAt?: string;
}

export interface Faculty {
  id: string;
  name: string;
  designation: string;
  departmentRole?: string;
  qualification: string;
  specialization: string;
  email: string;
  portfolioUrl?: string;
  experience?: string;
  publications?: { badge: string; text: string }[];
  awards?: string[];
  linkedin?: string;
  photoUrl?: string;
  order: number;
  createdAt?: string;
}

export interface Achievement {
  id: string;
  studentName: string;
  photoUrl?: string;
  title: string;
  category: string;
  year: string;
  description: string;
  createdAt?: string;
}

export interface GalleryImage {
  id: string;
  imageUrl: string;
  album: string;
  caption?: string;
  createdAt?: string;
}

export interface Placement {
  id: string;
  studentName: string;
  photoUrl?: string;
  company: string;
  package: string;
  batchYear: string;
  createdAt?: string;
}

export interface PlacementStats {
  id: string;
  year: string;
  placed: number;
  highest: string;
  average: string;
  companies: number;
}

export interface CompanyLogo {
  id: string;
  name: string;
  logoUrl: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'user';
}
