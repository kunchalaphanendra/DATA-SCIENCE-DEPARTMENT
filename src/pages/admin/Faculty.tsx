import React, { useState, useEffect } from 'react';
import AdminLayout from '@/src/components/AdminLayout';
import { supabase, uploadFile } from '@/src/lib/supabase';
import { Faculty } from '@/src/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, User as UserIcon, Loader2 } from 'lucide-react';

const facultySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  designation: z.string().min(1, 'Designation is required'),
  qualification: z.string().min(1, 'Qualification is required'),
  specialization: z.string().min(1, 'Specialization is required'),
  email: z.string().email('Invalid email'),
  linkedin: z.string().optional(),
  departmentRole: z.string().optional(),
  portfolioUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  experience: z.string().optional(),
  publications: z.array(z.object({ badge: z.string(), text: z.string() })).optional(),
  awards: z.array(z.string()).optional(),
  order: z.number().min(0),
});

type FacultyFormData = z.infer<typeof facultySchema>;

export default function AdminFaculty() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FacultyFormData>({
    resolver: zodResolver(facultySchema),
    defaultValues: {
      order: 0,
      linkedin: '',
      departmentRole: '',
      portfolioUrl: '',
      experience: '',
      publications: [],
      awards: []
    }
  });

  const fetchFaculty = async () => {
    const { data, error } = await supabase
      .from('faculty')
      .select('*')
      .order('order', { ascending: true });
    if (!error && data) {
      setFaculty(data.map(r => ({
        id: r.id,
        name: r.name,
        designation: r.designation,
        qualification: r.qualification,
        specialization: r.specialization,
        email: r.email,
        linkedin: r.linkedin || '',
        departmentRole: r.department_role || '',
        portfolioUrl: r.portfolio_url || '',
        experience: r.experience || '',
        publications: r.publications || [],
        awards: r.awards || [],
        photoUrl: r.photo_url || '',
        order: r.order || 0,
      })));
    }
  };

  useEffect(() => {
    fetchFaculty();
    const channel = supabase
      .channel('faculty-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'faculty' }, fetchFaculty)
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

  const onSubmit = async (data: FacultyFormData) => {
    setLoading(true);
    try {
      let photoUrl = editingFaculty?.photoUrl || '';

      if (imageFile) {
        const path = `${Date.now()}_${imageFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        photoUrl = await uploadFile('faculty', path, imageFile);
      }

      const payload = {
        name: data.name,
        designation: data.designation,
        qualification: data.qualification,
        specialization: data.specialization,
        email: data.email,
        linkedin: data.linkedin || '',
        department_role: data.departmentRole || '',
        portfolio_url: data.portfolioUrl || '',
        experience: data.experience || '',
        publications: data.publications || [],
        awards: data.awards || [],
        photo_url: photoUrl,
        order: data.order,
        updated_at: new Date().toISOString(),
      };

      if (editingFaculty) {
        const { error } = await supabase.from('faculty').update(payload).eq('id', editingFaculty.id);
        if (error) throw error;
        toast.success('Faculty updated');
      } else {
        const { error } = await supabase.from('faculty').insert(payload);
        if (error) throw error;
        toast.success('Faculty added');
      }
      closeModal();
      await fetchFaculty();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this faculty member?')) return;
    try {
      const { error } = await supabase.from('faculty').delete().eq('id', id);
      if (error) throw error;
      toast.success('Faculty deleted');
      await fetchFaculty();
    } catch (error: any) {
      toast.error(error.message || 'Delete failed');
    }
  };

  const restoreDefaultFaculty = async () => {
    if (!confirm('Restore default faculty data? This will add 31 members.')) return;
    setLoading(true);
    try {
      const { defaultFacultyData } = await import('@/src/data/facultyData');
      
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

      const { error } = await supabase.from('faculty').insert(payload);
      if (error) throw error;
      
      toast.success('Faculty data restored!');
      await fetchFaculty();
    } catch (error: any) {
      toast.error(error.message || 'Restore failed');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (f?: Faculty) => {
    if (f) {
      setEditingFaculty(f);
      setValue('name', f.name);
      setValue('designation', f.designation);
      setValue('qualification', f.qualification);
      setValue('specialization', f.specialization);
      setValue('email', f.email);
      setValue('linkedin', f.linkedin || '');
      setValue('departmentRole', f.departmentRole || '');
      setValue('portfolioUrl', f.portfolioUrl || '');
      setValue('experience', f.experience || '');
      setValue('publications', f.publications || []);
      setValue('awards', f.awards || []);
      setValue('order', f.order);
      setImagePreview(f.photoUrl || null);
    } else {
      setEditingFaculty(null);
      reset();
      setImagePreview(null);
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFaculty(null);
    reset();
    setImagePreview(null);
    setImageFile(null);
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-violet-900">Manage Faculty</h1>
          <p className="text-gray-500">Add or edit faculty profiles</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={restoreDefaultFaculty}
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
            Add Faculty
          </button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {faculty.map((f) => (
          <div key={f.id} className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
            <div className="relative aspect-[3/4]">
              <img
                src={f.photoUrl || `https://picsum.photos/seed/${f.id}/300/400`}
                alt={f.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute right-2 top-2 flex gap-1">
                <button onClick={() => openModal(f)} className="rounded-full bg-white/90 p-2 text-blue-600 shadow-sm hover:bg-white">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(f.id)} className="rounded-full bg-white/90 p-2 text-red-600 shadow-sm hover:bg-white">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="p-4 text-center">
              <h3 className="font-bold text-violet-900">{f.name}</h3>
              {f.departmentRole && <p className="mt-1 text-sm font-semibold text-blue-600">{f.departmentRole}</p>}
              <p className="text-xs font-bold text-amber-600">{f.designation}</p>
            </div>
          </div>
        ))}
        {faculty.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 italic">No faculty members found.</div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="my-8 w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-violet-900">
                {editingFaculty ? 'Edit Faculty' : 'Add New Faculty'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      {...register('name')}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Designation</label>
                    <select
                      {...register('designation')}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none"
                    >
                      <option value="Professor">Professor</option>
                      <option value="Associate Professor">Associate Professor</option>
                      <option value="Assistant Professor">Assistant Professor</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Qualification</label>
                    <input
                      {...register('qualification')}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none"
                      placeholder="e.g., Ph.D, M.Tech"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Photo</label>
                    <div className="relative aspect-[3/4] w-32 mx-auto overflow-hidden rounded-lg border-2 border-dashed border-gray-200 bg-gray-50">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center text-gray-400">
                          <UserIcon size={32} />
                          <span className="mt-2 text-[10px]">Upload</span>
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
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Specialization</label>
                  <input
                    {...register('specialization')}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Department Role</label>
                  <input
                    {...register('departmentRole')}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none"
                    placeholder="e.g., Head of Department"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Portfolio URL</label>
                  <input
                    {...register('portfolioUrl')}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Experience</label>
                <input
                  {...register('experience')}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none"
                  placeholder="e.g., 17 years of teaching experience"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Publications (JSON)</label>
                  <textarea
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none font-mono text-sm"
                    rows={3}
                    placeholder='[{"badge":"13","text":"Scopus"}]'
                    onChange={(e) => {
                      try {
                        const val = e.target.value ? JSON.parse(e.target.value) : [];
                        setValue('publications', val);
                      } catch (err) { /* ignore parse errors while typing */ }
                    }}
                    defaultValue={editingFaculty?.publications ? JSON.stringify(editingFaculty.publications) : '[]'}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Awards (JSON)</label>
                  <textarea
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none font-mono text-sm"
                    rows={3}
                    placeholder='["Award 1", "Award 2"]'
                    onChange={(e) => {
                      try {
                        const val = e.target.value ? JSON.parse(e.target.value) : [];
                        setValue('awards', val);
                      } catch (err) { /* ignore parse errors while typing */ }
                    }}
                    defaultValue={editingFaculty?.awards ? JSON.stringify(editingFaculty.awards) : '[]'}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">LinkedIn URL</label>
                  <input
                    {...register('linkedin')}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Display Order</label>
                  <input
                    type="number"
                    {...register('order', { valueAsNumber: true })}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none"
                  />
                </div>
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
                  {loading ? 'Saving...' : 'Save Faculty'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
