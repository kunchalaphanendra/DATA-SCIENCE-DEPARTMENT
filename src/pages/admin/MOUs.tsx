import React, { useState, useEffect } from 'react';
import AdminLayout from '@/src/components/AdminLayout';
import { supabase } from '@/src/lib/supabase';
import { MOU } from '@/src/types';
import { defaultMOUs } from '@/src/data/mouData';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, FileText, Loader2 } from 'lucide-react';

const mouSchema = z.object({
  name: z.string().min(1, 'Name of MOU is required'),
  duration: z.string().min(1, 'Duration is required'),
  activities: z.string().min(1, 'Activities are required'),
  order: z.number().min(0),
});

type MOUFormData = z.infer<typeof mouSchema>;

export default function AdminMOUs() {
  const [mous, setMous] = useState<MOU[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMou, setEditingMou] = useState<MOU | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<MOUFormData>({
    resolver: zodResolver(mouSchema),
    defaultValues: {
      name: '',
      duration: '3 Years',
      activities: '',
      order: 1,
    }
  });

  const loadLocalMOUs = () => {
    const stored = localStorage.getItem('vits_mous_v1');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return defaultMOUs;
  };

  const fetchMOUs = async () => {
    try {
      const { data, error } = await supabase
        .from('mous')
        .select('*')
        .order('order', { ascending: true });

      if (!error && data && data.length > 0) {
        setMous(data.map(r => ({
          id: r.id,
          name: r.name,
          duration: r.duration || '3 Years',
          activities: r.activities || '',
          order: r.order || 0,
          createdAt: r.created_at,
        })));
      } else {
        setMous(loadLocalMOUs());
      }
    } catch (err) {
      setMous(loadLocalMOUs());
    }
  };

  useEffect(() => {
    fetchMOUs();
  }, []);

  const onSubmit = async (data: MOUFormData) => {
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        duration: data.duration,
        activities: data.activities,
        order: data.order,
        updated_at: new Date().toISOString(),
      };

      try {
        if (editingMou) {
          await supabase.from('mous').update(payload).eq('id', editingMou.id);
        } else {
          await supabase.from('mous').insert(payload);
        }
      } catch (err) { /* fallback */ }

      const updatedMou: MOU = {
        id: editingMou?.id || `mou-${Date.now()}`,
        name: data.name,
        duration: data.duration,
        activities: data.activities,
        order: data.order,
      };

      let updatedList: MOU[];
      if (editingMou) {
        updatedList = mous.map(m => m.id === editingMou.id ? updatedMou : m);
        toast.success('MOU updated successfully');
      } else {
        updatedList = [...mous, updatedMou];
        toast.success('MOU added successfully');
      }
      updatedList.sort((a, b) => a.order - b.order);
      setMous(updatedList);
      localStorage.setItem('vits_mous_v1', JSON.stringify(updatedList));

      closeModal();
      await fetchMOUs();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this MOU record?')) return;
    try {
      try {
        await supabase.from('mous').delete().eq('id', id);
      } catch (err) { /* fallback */ }

      const updated = mous.filter(m => m.id !== id);
      setMous(updated);
      localStorage.setItem('vits_mous_v1', JSON.stringify(updated));
      toast.success('MOU deleted');
    } catch (error: any) {
      toast.error(error.message || 'Delete failed');
    }
  };

  const openModal = (mou?: MOU) => {
    if (mou) {
      setEditingMou(mou);
      setValue('name', mou.name);
      setValue('duration', mou.duration);
      setValue('activities', mou.activities);
      setValue('order', mou.order);
    } else {
      setEditingMou(null);
      reset({
        name: '',
        duration: '3 Years',
        activities: '',
        order: mous.length + 1,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMou(null);
    reset();
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-violet-900">Manage MOUs</h1>
          <p className="text-gray-500">Manage Memorandums of Understanding with partner organizations & industry leaders</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 rounded-lg bg-violet-900 px-4 py-2.5 font-bold text-white transition-all hover:bg-violet-800 shadow-sm"
        >
          <Plus size={20} />
          Add New MOU
        </button>
      </div>

      {/* MOU Table */}
      <div className="overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#9d174d] text-white text-sm font-bold">
              <th className="py-4 px-6 w-20">S.No</th>
              <th className="py-4 px-6">Name of MOU</th>
              <th className="py-4 px-6 w-36">Duration</th>
              <th className="py-4 px-6">Activities Included</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {mous.map((mou, idx) => (
              <tr key={mou.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 font-semibold text-gray-700">{idx + 1}</td>
                <td className="py-4 px-6 font-bold text-gray-900">{mou.name}</td>
                <td className="py-4 px-6 text-gray-700 font-medium">{mou.duration}</td>
                <td className="py-4 px-6 text-gray-600 leading-relaxed">{mou.activities}</td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openModal(mou)}
                      className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(mou.id)}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {mous.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-400 italic">
                  No MOUs added yet. Click "Add New MOU" above to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="my-8 w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between border-b pb-4">
              <h2 className="text-xl font-bold text-violet-900">
                {editingMou ? 'Edit MOU Entry' : 'Add New MOU'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Name of MOU</label>
                <input
                  {...register('name')}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-violet-900 focus:outline-none"
                  placeholder="e.g., Augmented Byte Pvt Ltd"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Duration</label>
                <input
                  {...register('duration')}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-violet-900 focus:outline-none"
                  placeholder="e.g., 3 Years"
                />
                {errors.duration && <p className="text-xs text-red-500 mt-1">{errors.duration.message}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Activities Included</label>
                <textarea
                  rows={3}
                  {...register('activities')}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-violet-900 focus:outline-none"
                  placeholder="e.g., FDPs, Consultancy Work, Boot Camps, Project Assistance to students"
                />
                {errors.activities && <p className="text-xs text-red-500 mt-1">{errors.activities.message}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Display Order</label>
                <input
                  type="number"
                  {...register('order', { valueAsNumber: true })}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-violet-900 focus:outline-none"
                />
              </div>

              <div className="mt-8 flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-lg border border-gray-200 py-2.5 font-bold text-gray-600 hover:bg-gray-50 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-violet-900 py-2.5 font-bold text-white hover:bg-violet-800 disabled:opacity-50 text-sm"
                >
                  {loading && <Loader2 size={18} className="animate-spin" />}
                  {loading ? 'Saving...' : 'Save MOU'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
