import React, { useState, useEffect } from 'react';
import AdminLayout from '@/src/components/AdminLayout';
import { supabase, uploadFile } from '@/src/lib/supabase';
import { Placement } from '@/src/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Loader2, Image as ImageIcon } from 'lucide-react';

const placementSchema = z.object({
  studentName: z.string().min(1, 'Student name is required'),
  company: z.string().min(1, 'Company is required'),
  package: z.string().min(1, 'Package is required'),
  batchYear: z.string().min(1, 'Batch year is required'),
});

type PlacementFormData = z.infer<typeof placementSchema>;

export default function AdminPlacements() {
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlacement, setEditingPlacement] = useState<Placement | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<PlacementFormData>({
    resolver: zodResolver(placementSchema),
  });

  const fetchPlacements = async () => {
    const { data, error } = await supabase
      .from('placements')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      setPlacements(data.map(r => ({
        id: r.id,
        studentName: r.student_name,
        company: r.company,
        package: r.package,
        batchYear: r.batch_year,
        photoUrl: r.photo_url || '',
      })));
    }
  };

  useEffect(() => {
    fetchPlacements();
    const channel = supabase
      .channel('placements-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'placements' }, fetchPlacements)
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

  const onSubmit = async (data: PlacementFormData) => {
    setLoading(true);
    try {
      let photoUrl = editingPlacement?.photoUrl || '';

      if (imageFile) {
        const path = `${Date.now()}_${imageFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        photoUrl = await uploadFile('placements', path, imageFile);
      }

      if (editingPlacement) {
        const { error } = await supabase.from('placements').update({
          student_name: data.studentName,
          company: data.company,
          package: data.package,
          batch_year: data.batchYear,
          photo_url: photoUrl,
          updated_at: new Date().toISOString(),
        }).eq('id', editingPlacement.id);
        if (error) throw error;
        toast.success('Placement updated');
      } else {
        const { error } = await supabase.from('placements').insert({
          student_name: data.studentName,
          company: data.company,
          package: data.package,
          batch_year: data.batchYear,
          photo_url: photoUrl,
        });
        if (error) throw error;
        toast.success('Placement added');
      }
      closeModal();
      await fetchPlacements();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this placement?')) return;
    try {
      const { error } = await supabase.from('placements').delete().eq('id', id);
      if (error) throw error;
      toast.success('Placement deleted');
      await fetchPlacements();
    } catch (error: any) {
      toast.error(error.message || 'Delete failed');
    }
  };

  const openModal = (p?: Placement) => {
    if (p) {
      setEditingPlacement(p);
      setValue('studentName', p.studentName);
      setValue('company', p.company);
      setValue('package', p.package);
      setValue('batchYear', p.batchYear);
      setImagePreview(p.photoUrl || null);
    } else {
      setEditingPlacement(null);
      reset();
      setImagePreview(null);
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPlacement(null);
    reset();
    setImagePreview(null);
    setImageFile(null);
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-violet-900">Manage Placements</h1>
          <p className="text-gray-500">Track student career success</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 rounded-lg bg-violet-900 px-4 py-2 font-bold text-white transition-all hover:bg-violet-800"
        >
          <Plus size={20} />
          Add Placement
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {placements.map((p) => (
          <div key={p.id} className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
            <div className="relative aspect-square">
              <img src={p.photoUrl || `https://picsum.photos/seed/${p.id}/300/300`} alt={p.studentName} className="h-full w-full object-cover" />
              <div className="absolute right-2 top-2 flex gap-1">
                <button onClick={() => openModal(p)} className="rounded-full bg-white/90 p-2 text-blue-600 shadow-sm hover:bg-white">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(p.id)} className="rounded-full bg-white/90 p-2 text-red-600 shadow-sm hover:bg-white">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="p-4 text-center">
              <h3 className="font-bold text-violet-900">{p.studentName}</h3>
              <p className="text-xs font-bold text-amber-600">{p.company}</p>
            </div>
          </div>
        ))}
        {placements.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 italic">No placements found.</div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="my-8 w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-violet-900">
                {editingPlacement ? 'Edit Placement' : 'Add Placement'}
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
                <label className="mb-1 block text-sm font-medium text-gray-700">Company Name</label>
                <input
                  {...register('company')}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Package (e.g., 6 LPA)</label>
                  <input
                    {...register('package')}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Batch Year</label>
                  <input
                    {...register('batchYear')}
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
                  {loading ? 'Saving...' : 'Save Placement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
