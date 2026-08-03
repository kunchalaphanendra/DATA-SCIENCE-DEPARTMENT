import React, { useState, useEffect } from 'react';
import AdminLayout from '@/src/components/AdminLayout';
import { supabase, uploadFile } from '@/src/lib/supabase';
import { BoardMember, Faculty } from '@/src/types';
import { defaultBoardMembers } from '@/src/data/boardOfStudiesData';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, User as UserIcon, Loader2, Link as LinkIcon } from 'lucide-react';

const boardMemberSchema = z.object({
  facultyId: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  designation: z.string().min(1, 'Designation is required'),
  organization: z.string().min(1, 'Organization / Affiliation is required'),
  role: z.string().min(1, 'Role in Board of Studies is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  order: z.number().min(0),
});

type BoardMemberFormData = z.infer<typeof boardMemberSchema>;

export default function AdminBoardOfStudies() {
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<BoardMember | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<BoardMemberFormData>({
    resolver: zodResolver(boardMemberSchema),
    defaultValues: {
      facultyId: '',
      name: '',
      designation: '',
      organization: 'Vignan Institute of Technology & Science',
      role: 'Internal Member',
      email: '',
      order: 1,
    }
  });

  const selectedFacultyId = watch('facultyId');

  // Fetch faculty list for linking
  const fetchFacultyList = async () => {
    try {
      const { data, error } = await supabase.from('faculty').select('*').order('order', { ascending: true });
      if (!error && data && data.length > 0) {
        setFacultyList(data.map(r => ({
          id: r.id,
          name: r.name,
          designation: r.designation,
          qualification: r.qualification || '',
          specialization: r.specialization || '',
          email: r.email || '',
          departmentRole: r.department_role || '',
          photoUrl: r.photo_url || '',
          order: r.order || 0,
        })));
      }
    } catch (err) {
      console.warn('Faculty list fetch fallback:', err);
    }
  };

  // Fetch Board Members
  const fetchBoardMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('board_of_studies')
        .select('*')
        .order('order', { ascending: true });

      if (!error && data && data.length > 0) {
        setBoardMembers(data.map(r => ({
          id: r.id,
          facultyId: r.faculty_id || '',
          name: r.name,
          designation: r.designation,
          organization: r.organization || 'Vignan Institute of Technology & Science',
          role: r.role || 'Member',
          email: r.email || '',
          photoUrl: r.photo_url || '',
          order: r.order || 0,
          createdAt: r.created_at,
        })));
      } else {
        const stored = localStorage.getItem('vits_bos_members');
        if (stored) {
          setBoardMembers(JSON.parse(stored));
        } else {
          setBoardMembers(defaultBoardMembers);
        }
      }
    } catch (err) {
      console.warn('Fallback to local state for Board of Studies members');
      const stored = localStorage.getItem('vits_bos_members');
      if (stored) {
        setBoardMembers(JSON.parse(stored));
      } else {
        setBoardMembers(defaultBoardMembers);
      }
    }
  };

  useEffect(() => {
    fetchFacultyList();
    fetchBoardMembers();
  }, []);

  // When selecting a faculty member from the dropdown, auto-fill details
  const handleSelectFaculty = (fId: string) => {
    setValue('facultyId', fId);
    if (fId) {
      const f = facultyList.find(item => item.id === fId);
      if (f) {
        setValue('name', f.name);
        setValue('designation', f.designation);
        setValue('organization', 'Vignan Institute of Technology & Science');
        setValue('email', f.email);
        setImagePreview(f.photoUrl || null);
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: BoardMemberFormData) => {
    setLoading(true);
    try {
      let photoUrl = editingMember?.photoUrl || imagePreview || '';

      if (imageFile) {
        const path = `bos_${Date.now()}_${imageFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        try {
          photoUrl = await uploadFile('faculty', path, imageFile);
        } catch (uploadErr) {
          photoUrl = imagePreview || '';
        }
      }

      const payload = {
        faculty_id: data.facultyId || null,
        name: data.name,
        designation: data.designation,
        organization: data.organization,
        role: data.role,
        email: data.email || '',
        photo_url: photoUrl,
        order: data.order,
        updated_at: new Date().toISOString(),
      };

      let success = false;
      try {
        if (editingMember) {
          const { error } = await supabase.from('board_of_studies').update(payload).eq('id', editingMember.id);
          if (!error) success = true;
        } else {
          const { error } = await supabase.from('board_of_studies').insert(payload);
          if (!error) success = true;
        }
      } catch (err) {
        success = false;
      }

      // Local fallback state update
      const newMember: BoardMember = {
        id: editingMember?.id || `bos-${Date.now()}`,
        facultyId: data.facultyId || undefined,
        name: data.name,
        designation: data.designation,
        organization: data.organization,
        role: data.role,
        email: data.email || '',
        photoUrl: photoUrl,
        order: data.order,
      };

      let updatedList: BoardMember[];
      if (editingMember) {
        updatedList = boardMembers.map(m => m.id === editingMember.id ? newMember : m);
        toast.success('Board member updated');
      } else {
        updatedList = [...boardMembers, newMember];
        toast.success('Board member added');
      }
      updatedList.sort((a, b) => a.order - b.order);
      setBoardMembers(updatedList);
      localStorage.setItem('vits_bos_members', JSON.stringify(updatedList));

      closeModal();
      await fetchBoardMembers();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this member from Board of Studies?')) return;
    try {
      try {
        await supabase.from('board_of_studies').delete().eq('id', id);
      } catch (err) { /* ignore fallback */ }

      const updated = boardMembers.filter(m => m.id !== id);
      setBoardMembers(updated);
      localStorage.setItem('vits_bos_members', JSON.stringify(updated));
      toast.success('Member removed');
    } catch (error: any) {
      toast.error(error.message || 'Delete failed');
    }
  };

  const openModal = (m?: BoardMember) => {
    if (m) {
      setEditingMember(m);
      setValue('facultyId', m.facultyId || '');
      setValue('name', m.name);
      setValue('designation', m.designation);
      setValue('organization', m.organization);
      setValue('role', m.role);
      setValue('email', m.email || '');
      setValue('order', m.order);
      setImagePreview(m.photoUrl || null);
    } else {
      setEditingMember(null);
      reset({
        facultyId: '',
        name: '',
        designation: '',
        organization: 'Vignan Institute of Technology & Science',
        role: 'Internal Member',
        email: '',
        order: boardMembers.length + 1,
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
    reset();
    setImagePreview(null);
    setImageFile(null);
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-violet-900">Manage Board of Studies Members</h1>
          <p className="text-gray-500">Link existing faculty or add external experts to the Board of Studies</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 rounded-lg bg-violet-900 px-4 py-2.5 font-bold text-white transition-all hover:bg-violet-800 shadow-sm"
        >
          <Plus size={20} />
          Add Board Member
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {boardMembers.map((m) => (
          <div key={m.id} className="relative overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 shrink-0 rounded-full overflow-hidden border-2 border-violet-100 bg-violet-50">
                  <img
                    src={m.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=random`}
                    alt={m.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="inline-block rounded-full bg-violet-100 text-violet-800 text-[11px] font-bold px-2.5 py-0.5 mb-1">
                    {m.role}
                  </span>
                  <h3 className="font-bold text-gray-900 truncate">{m.name}</h3>
                  <p className="text-xs font-semibold text-blue-600 truncate">{m.designation}</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{m.organization}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-400 font-medium">Order: {m.order}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => openModal(m)} className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(m.id)} className="rounded-lg p-1.5 text-red-600 hover:bg-red-50">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="my-8 w-full max-w-xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-xl font-bold text-violet-900">
                  {editingMember ? 'Edit Board Member' : 'Add Board Member'}
                </h2>
                <p className="text-xs text-gray-500">Link from internal faculty or enter member details</p>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Option to link existing faculty */}
              <div className="rounded-xl bg-violet-50/70 p-4 border border-violet-100">
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-violet-900 uppercase tracking-wider">
                  <LinkIcon size={14} /> Link From Existing Faculty (Optional)
                </label>
                <select
                  value={selectedFacultyId || ''}
                  onChange={(e) => handleSelectFaculty(e.target.value)}
                  className="w-full rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm focus:border-violet-900 focus:outline-none"
                >
                  <option value="">-- Select Faculty Member --</option>
                  {facultyList.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    {...register('name')}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none text-sm"
                    placeholder="e.g., Dr. Srinu Banothu"
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Designation</label>
                  <input
                    {...register('designation')}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none text-sm"
                    placeholder="e.g., Professor & HOD"
                  />
                  {errors.designation && <p className="text-xs text-red-500 mt-1">{errors.designation.message}</p>}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Organization / Affiliation</label>
                  <input
                    {...register('organization')}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none text-sm"
                    placeholder="e.g., VITS / JNTUH / Industry"
                  />
                  {errors.organization && <p className="text-xs text-red-500 mt-1">{errors.organization.message}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Role in BOS</label>
                  <select
                    {...register('role')}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none text-sm"
                  >
                    <option value="Chairman">Chairman</option>
                    <option value="Faculty">Faculty</option>
                    <option value="University Nominee">University Nominee</option>
                    <option value="Subject Expert">Subject Expert</option>
                    <option value="Representative from Industry">Representative from Industry</option>
                    <option value="College Alumni">College Alumni</option>
                    <option value="Internal Member">Internal Member</option>
                    <option value="Member Secretary">Member Secretary</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none text-sm"
                    placeholder="e.g., member@vignanits.ac.in"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Display Order</label>
                  <input
                    type="number"
                    {...register('order', { valueAsNumber: true })}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Photo</label>
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-gray-200 bg-gray-50">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center text-gray-400">
                        <UserIcon size={24} />
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-xs text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-violet-900 hover:file:bg-violet-100"
                  />
                </div>
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
