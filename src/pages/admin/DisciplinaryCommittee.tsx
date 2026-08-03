import React, { useState, useEffect } from 'react';
import AdminLayout from '@/src/components/AdminLayout';
import { supabase } from '@/src/lib/supabase';
import { CommitteeMember } from '@/src/types';
import { defaultDisciplinaryMembers } from '@/src/data/committeeData';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, ShieldAlert, Loader2 } from 'lucide-react';

const committeeSchema = z.object({
  name: z.string().min(1, 'Name of member is required'),
  designation: z.string().min(1, 'Designation is required'),
  order: z.number().min(0),
});

type CommitteeFormData = z.infer<typeof committeeSchema>;

export default function AdminDisciplinaryCommittee() {
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<CommitteeMember | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CommitteeFormData>({
    resolver: zodResolver(committeeSchema),
    defaultValues: {
      name: '',
      designation: 'Member',
      order: 1,
    }
  });

  const loadLocalMembers = () => {
    const stored = localStorage.getItem('vits_disciplinary_committee_v1');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return defaultDisciplinaryMembers;
  };

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('disciplinary_committee')
        .select('*')
        .order('order', { ascending: true });

      if (!error && data && data.length > 0) {
        setMembers(data.map(r => ({
          id: r.id,
          name: r.name,
          designation: r.designation || 'Member',
          order: r.order || 0,
          createdAt: r.created_at,
        })));
      } else {
        setMembers(loadLocalMembers());
      }
    } catch (err) {
      setMembers(loadLocalMembers());
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const onSubmit = async (data: CommitteeFormData) => {
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        designation: data.designation,
        order: data.order,
        updated_at: new Date().toISOString(),
      };

      try {
        if (editingMember) {
          await supabase.from('disciplinary_committee').update(payload).eq('id', editingMember.id);
        } else {
          await supabase.from('disciplinary_committee').insert(payload);
        }
      } catch (err) { /* fallback */ }

      const updatedItem: CommitteeMember = {
        id: editingMember?.id || `dc-${Date.now()}`,
        name: data.name,
        designation: data.designation,
        order: data.order,
      };

      let updatedList: CommitteeMember[];
      if (editingMember) {
        updatedList = members.map(m => m.id === editingMember.id ? updatedItem : m);
        toast.success('Committee member updated');
      } else {
        updatedList = [...members, updatedItem];
        toast.success('Committee member added');
      }
      updatedList.sort((a, b) => a.order - b.order);
      setMembers(updatedList);
      localStorage.setItem('vits_disciplinary_committee_v1', JSON.stringify(updatedList));

      closeModal();
      await fetchMembers();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this committee member?')) return;
    try {
      try {
        await supabase.from('disciplinary_committee').delete().eq('id', id);
      } catch (err) { /* fallback */ }

      const updated = members.filter(m => m.id !== id);
      setMembers(updated);
      localStorage.setItem('vits_disciplinary_committee_v1', JSON.stringify(updated));
      toast.success('Member removed');
    } catch (error: any) {
      toast.error(error.message || 'Delete failed');
    }
  };

  const openModal = (m?: CommitteeMember) => {
    if (m) {
      setEditingMember(m);
      setValue('name', m.name);
      setValue('designation', m.designation);
      setValue('order', m.order);
    } else {
      setEditingMember(null);
      reset({
        name: '',
        designation: 'Member',
        order: members.length + 1,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
    reset();
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-violet-900 flex items-center gap-2">
            <ShieldAlert className="text-[#9d174d]" size={28} />
            Manage Disciplinary Committee
          </h1>
          <p className="text-gray-500">Add or edit members of the Department Disciplinary Committee</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 rounded-lg bg-violet-900 px-4 py-2.5 font-bold text-white transition-all hover:bg-violet-800 shadow-sm"
        >
          <Plus size={20} />
          Add Member
        </button>
      </div>

      {/* Members Table */}
      <div className="overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#9d174d] text-white text-sm font-bold">
              <th className="py-4 px-6 w-20 border-r border-white/20">S.No</th>
              <th className="py-4 px-6 border-r border-white/20">Name of the Member</th>
              <th className="py-4 px-6">Designation</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {members.map((m, idx) => (
              <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 font-semibold text-gray-700">{idx + 1}</td>
                <td className="py-4 px-6 font-bold text-gray-900">{m.name}</td>
                <td className="py-4 px-6 font-semibold text-violet-900">{m.designation}</td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openModal(m)}
                      className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan={4} className="py-12 text-center text-gray-400 italic">
                  No members added yet. Click "Add Member" above to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="my-8 w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between border-b pb-4">
              <h2 className="text-xl font-bold text-violet-900">
                {editingMember ? 'Edit Committee Member' : 'Add Committee Member'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Name & Title</label>
                <input
                  {...register('name')}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-violet-900 focus:outline-none"
                  placeholder="e.g., Dr. B. Srinu, Professor & HoD"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Role / Designation</label>
                <select
                  {...register('designation')}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-violet-900 focus:outline-none"
                >
                  <option value="Chairman">Chairman</option>
                  <option value="Member">Member</option>
                  <option value="Member Secretary">Member Secretary</option>
                </select>
                {errors.designation && <p className="text-xs text-red-500 mt-1">{errors.designation.message}</p>}
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
                  {loading ? 'Saving...' : 'Save Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
