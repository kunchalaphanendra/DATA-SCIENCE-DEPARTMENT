import React, { useState, useEffect } from 'react';
import AdminLayout from '@/src/components/AdminLayout';
import { supabase, uploadFile } from '@/src/lib/supabase';
import { Achievement } from '@/src/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Trophy, Loader2, Image as ImageIcon } from 'lucide-react';

const achievementSchema = z.object({
  studentName: z.string().min(1, 'Student name is required'),
  title: z.string().min(1, 'Title is required'),
  category: z.enum(['Academic', 'Sports', 'Technical', 'Cultural']),
  year: z.string().min(1, 'Year is required'),
  description: z.string().min(1, 'Description is required'),
});

type AchievementFormData = z.infer<typeof achievementSchema>;

export default function AdminAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<AchievementFormData>({
    resolver: zodResolver(achievementSchema),
  });

  const fetchAchievements = async () => {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      setAchievements(data.map(r => ({
        id: r.id,
        studentName: r.student_name,
        title: r.title,
        category: r.category,
        year: r.year,
        description: r.description,
        photoUrl: r.photo_url || '',
      })));
    }
  };

  useEffect(() => {
    fetchAchievements();
    const channel = supabase
      .channel('achievements-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'achievements' }, fetchAchievements)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: AchievementFormData) => {
    setLoading(true);
    try {
      let photoUrl = editingAchievement?.photoUrl || '';

      if (imageFile) {
        const path = `${Date.now()}_${imageFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        photoUrl = await uploadFile('achievements', path, imageFile);
      }

      if (editingAchievement) {
        const { error } = await supabase.from('achievements').update({
          student_name: data.studentName,
          title: data.title,
          category: data.category,
          year: data.year,
          description: data.description,
          photo_url: photoUrl,
          updated_at: new Date().toISOString(),
        }).eq('id', editingAchievement.id);
        if (error) throw error;
        toast.success('Achievement updated');
      } else {
        const { error } = await supabase.from('achievements').insert({
          student_name: data.studentName,
          title: data.title,
          category: data.category,
          year: data.year,
          description: data.description,
          photo_url: photoUrl,
        });
        if (error) throw error;
        toast.success('Achievement added');
      }
      closeModal();
      await fetchAchievements();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this achievement?')) return;
    try {
      const { error } = await supabase.from('achievements').delete().eq('id', id);
      if (error) throw error;
      toast.success('Achievement deleted');
      await fetchAchievements();
    } catch (error: any) {
      toast.error(error.message || 'Delete failed');
    }
  };

  const restoreDefaultAchievements = async () => {
    if (!confirm('Restore default achievements data? This will add 10 new members.')) return;
    setLoading(true);
    try {
      const newAchievements = [
        { title: "1st Prize in National Hackathon", student_name: "Rahul Kumar", category: "Technical", year: "2024", description: "Won first place in a national-level hackathon by developing an AI-based traffic management system." },
        { title: "Best Paper Award at IEEE Conference", student_name: "Ananya Reddy", category: "Academic", year: "2023", description: "Received the best research paper award for work on machine learning optimization." },
        { title: "Winner – Inter College Coding Competition", student_name: "Karthik Varma", category: "Technical", year: "2024", description: "Secured first position among 150 participants in a competitive coding contest." },
        { title: "Gold Medal in University Examinations", student_name: "Sneha Sharma", category: "Academic", year: "2023", description: "Achieved the highest CGPA in the department and received a university gold medal." },
        { title: "2nd Prize in National Level Data Science Challenge", student_name: "Vikram Patel", category: "Technical", year: "2024", description: "Built a predictive analytics model for healthcare data." },
        { title: "Winner – State Level Debate Competition", student_name: "Priya Nair", category: "Cultural", year: "2023", description: "Represented the college and won the first prize in a state-level debate event." },
        { title: "Finalist in Smart India Hackathon", student_name: "Rohit Singh", category: "Technical", year: "2024", description: "Developed an innovative solution for smart city waste management." },
        { title: "Best Innovator Award", student_name: "Neha Gupta", category: "Technical", year: "2023", description: "Designed a low-cost IoT device for real-time environmental monitoring." },
        { title: "1st Prize in Inter University Robotics Competition", student_name: "Arjun Mehta", category: "Technical", year: "2024", description: "Led a team that built an autonomous robot for obstacle navigation." },
        { title: "Excellence in Community Service", student_name: "Aisha Khan", category: "Cultural", year: "2023", description: "Organized multiple tech awareness workshops for rural school students." }
      ];

      const { error } = await supabase.from('achievements').insert(newAchievements);
      if (error) throw error;
      
      toast.success('Achievements data restored!');
      await fetchAchievements();
    } catch (error: any) {
      toast.error(error.message || 'Restore failed');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (a?: Achievement) => {
    if (a) {
      setEditingAchievement(a);
      setValue('studentName', a.studentName);
      setValue('title', a.title);
      setValue('category', a.category as any);
      setValue('year', a.year);
      setValue('description', a.description);
      setImagePreview(a.photoUrl || null);
    } else {
      setEditingAchievement(null);
      reset();
      setImagePreview(null);
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAchievement(null);
    reset();
    setImagePreview(null);
    setImageFile(null);
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-violet-900">Manage Achievements</h1>
          <p className="text-gray-500">Celebrate student successes</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={restoreDefaultAchievements}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-bold text-white transition-all hover:bg-emerald-700 disabled:opacity-50"
          >
            Import Default Data
          </button>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 rounded-lg bg-violet-900 px-4 py-2 font-bold text-white transition-all hover:bg-violet-800"
          >
            <Plus size={20} />
            Add Achievement
          </button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((a) => (
          <div key={a.id} className="overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="mb-4 flex items-center justify-between">
              <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                <img src={a.photoUrl || `https://picsum.photos/seed/${a.id}/100/100`} alt={a.studentName} className="h-full w-full object-cover" />
              </div>
              <div className="flex gap-1">
                <button onClick={() => openModal(a)} className="rounded-md p-1.5 text-blue-600 hover:bg-blue-50">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(a.id)} className="rounded-md p-1.5 text-red-600 hover:bg-red-50">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <h3 className="font-bold text-violet-900">{a.studentName}</h3>
            <p className="text-xs font-bold text-amber-600">{a.title}</p>
            <p className="mt-2 text-xs text-gray-500 line-clamp-2">{a.description}</p>
          </div>
        ))}
        {achievements.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 italic">No achievements found.</div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="my-8 w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-violet-900">
                {editingAchievement ? 'Edit Achievement' : 'Add Achievement'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-dashed border-gray-200 bg-gray-50">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center text-gray-400">
                      <ImageIcon size={24} />
                      <span className="text-[10px]">Photo</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Student Name</label>
                <input
                  {...register('studentName')}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Achievement Title</label>
                <input
                  {...register('title')}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none"
                  placeholder="e.g., 1st Prize in Hackathon"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
                  <select
                    {...register('category')}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Sports">Sports</option>
                    <option value="Technical">Technical</option>
                    <option value="Cultural">Cultural</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Year/Batch</label>
                  <input
                    {...register('year')}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none"
                    placeholder="e.g., 2024"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none"
                />
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-lg border border-gray-200 py-3 font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-violet-900 py-3 font-bold text-white hover:bg-violet-800 disabled:opacity-50"
                >
                  {loading && <Loader2 size={18} className="animate-spin" />}
                  {loading ? 'Saving...' : 'Save Achievement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
