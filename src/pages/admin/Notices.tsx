import { useState, useEffect } from 'react';
import AdminLayout from '@/src/components/AdminLayout';
import { supabase } from '@/src/lib/supabase';
import { Notice, Priority } from '@/src/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Megaphone } from 'lucide-react';

const noticeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().min(1, 'Content is required'),
  date: z.string().min(1, 'Date is required'),
  priority: z.enum(['High', 'Normal']),
});

type NoticeFormData = z.infer<typeof noticeSchema>;

export default function AdminNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<NoticeFormData>({
    resolver: zodResolver(noticeSchema),
    defaultValues: { priority: 'Normal' }
  });

  const fetchNotices = async () => {
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      setNotices(data.map(r => ({
        id: r.id,
        title: r.title,
        content: r.content,
        date: r.date,
        priority: r.priority as Priority,
      })));
    }
  };

  useEffect(() => {
    fetchNotices();
    // Real-time subscription
    const channel = supabase
      .channel('notices-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notices' }, fetchNotices)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const onSubmit = async (data: NoticeFormData) => {
    setLoading(true);
    try {
      if (editingNotice) {
        const { error } = await supabase.from('notices').update({
          title: data.title,
          content: data.content,
          date: data.date,
          priority: data.priority,
          updated_at: new Date().toISOString(),
        }).eq('id', editingNotice.id);
        if (error) throw error;
        toast.success('Notice updated');
      } else {
        const { error } = await supabase.from('notices').insert({
          title: data.title,
          content: data.content,
          date: data.date,
          priority: data.priority,
        });
        if (error) throw error;
        toast.success('Notice added');
      }
      closeModal();
      await fetchNotices();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;
    try {
      const { error } = await supabase.from('notices').delete().eq('id', id);
      if (error) throw error;
      toast.success('Notice deleted');
      await fetchNotices();
    } catch (error: any) {
      toast.error(error.message || 'Delete failed');
    }
  };

  const openModal = (notice?: Notice) => {
    if (notice) {
      setEditingNotice(notice);
      setValue('title', notice.title);
      setValue('content', notice.content);
      setValue('date', notice.date);
      setValue('priority', notice.priority);
    } else {
      setEditingNotice(null);
      reset();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNotice(null);
    reset();
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-violet-900">Manage Notices</h1>
          <p className="text-gray-500">Add or edit department announcements</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 rounded-lg bg-violet-900 px-4 py-2 font-bold text-white transition-all hover:bg-violet-800"
        >
          <Plus size={20} />
          Add Notice
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-sm font-bold text-violet-900">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Priority</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-600">
            {notices.map((notice) => (
              <tr key={notice.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{notice.title}</td>
                <td className="px-6 py-4">{notice.date}</td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                    notice.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {notice.priority}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openModal(notice)} className="rounded-md p-2 text-blue-600 hover:bg-blue-50">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(notice.id)} className="rounded-md p-2 text-red-600 hover:bg-red-50">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {notices.length === 0 && (
              <tr>
                <td colSpan={4} className="py-12 text-center text-gray-500 italic">No notices found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-violet-900">
                {editingNotice ? 'Edit Notice' : 'Add New Notice'}
              </h2>
              {/* X always enabled so modal can be closed even during loading */}
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Notice Title</label>
                <input
                  {...register('title')}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none"
                  placeholder="e.g., Mid-term Exam Schedule"
                />
                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  {...register('content')}
                  rows={4}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none"
                  placeholder="Detailed announcement..."
                />
                {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content.message}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    {...register('date')}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none"
                  />
                  {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date.message}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Priority</label>
                  <select
                    {...register('priority')}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                  </select>
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
                  className="flex-1 rounded-lg bg-violet-900 py-3 font-bold text-white hover:bg-violet-800 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
