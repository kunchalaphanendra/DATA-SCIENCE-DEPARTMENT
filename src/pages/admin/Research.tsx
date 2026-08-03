import React, { useState, useEffect } from 'react';
import AdminLayout from '@/src/components/AdminLayout';
import { supabase, uploadFile } from '@/src/lib/supabase';
import { ResearchDocument } from '@/src/types';
import { defaultResearchDocuments } from '@/src/data/researchData';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, FileText, Upload, ExternalLink, Loader2 } from 'lucide-react';

const researchSchema = z.object({
  category: z.enum(['publications', 'seminars']),
  academicYear: z.string().min(1, 'Academic Year is required'),
  documentUrl: z.string().optional(),
  order: z.number().min(0),
});

type ResearchFormData = z.infer<typeof researchSchema>;

export default function AdminResearch() {
  const [documents, setDocuments] = useState<ResearchDocument[]>([]);
  const [activeCategory, setActiveCategory] = useState<'publications' | 'seminars'>('publications');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<ResearchDocument | null>(null);
  const [loading, setLoading] = useState(false);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docFileName, setDocFileName] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ResearchFormData>({
    resolver: zodResolver(researchSchema),
    defaultValues: {
      category: 'publications',
      academicYear: '2025-2026',
      documentUrl: '',
      order: 1,
    }
  });

  const loadLocalDocs = () => {
    const stored = localStorage.getItem('vits_research_docs_v1');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return defaultResearchDocuments;
  };

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('research_documents')
        .select('*')
        .order('order', { ascending: true });

      if (!error && data && data.length > 0) {
        setDocuments(data.map(r => ({
          id: r.id,
          category: r.category,
          academicYear: r.academic_year,
          documentUrl: r.document_url || '#',
          order: r.order || 0,
          createdAt: r.created_at,
        })));
      } else {
        setDocuments(loadLocalDocs());
      }
    } catch (err) {
      setDocuments(loadLocalDocs());
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocFile(file);
      setDocFileName(file.name);
    }
  };

  const onSubmit = async (data: ResearchFormData) => {
    setLoading(true);
    try {
      let documentUrl = editingDoc?.documentUrl || '#';

      if (docFile) {
        const path = `research_${Date.now()}_${docFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        try {
          documentUrl = await uploadFile('research', path, docFile);
        } catch (uploadErr) {
          // If Supabase storage bucket fails, create local object URL or keep current URL
          documentUrl = URL.createObjectURL(docFile);
        }
      }

      const payload = {
        category: data.category,
        academic_year: data.academicYear,
        document_url: documentUrl,
        order: data.order,
        updated_at: new Date().toISOString(),
      };

      try {
        if (editingDoc) {
          await supabase.from('research_documents').update(payload).eq('id', editingDoc.id);
        } else {
          await supabase.from('research_documents').insert(payload);
        }
      } catch (err) { /* fallback */ }

      const updatedDoc: ResearchDocument = {
        id: editingDoc?.id || `res-${Date.now()}`,
        category: data.category,
        academicYear: data.academicYear,
        documentUrl: documentUrl,
        order: data.order,
      };

      let updatedList: ResearchDocument[];
      if (editingDoc) {
        updatedList = documents.map(d => d.id === editingDoc.id ? updatedDoc : d);
        toast.success('Document updated');
      } else {
        updatedList = [...documents, updatedDoc];
        toast.success('Document added');
      }
      updatedList.sort((a, b) => a.order - b.order);
      setDocuments(updatedList);
      localStorage.setItem('vits_research_docs_v1', JSON.stringify(updatedList));

      closeModal();
      await fetchDocuments();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document entry?')) return;
    try {
      try {
        await supabase.from('research_documents').delete().eq('id', id);
      } catch (err) { /* fallback */ }

      const updated = documents.filter(d => d.id !== id);
      setDocuments(updated);
      localStorage.setItem('vits_research_docs_v1', JSON.stringify(updated));
      toast.success('Document deleted');
    } catch (error: any) {
      toast.error(error.message || 'Delete failed');
    }
  };

  const openModal = (doc?: ResearchDocument, categoryPreset?: 'publications' | 'seminars') => {
    if (doc) {
      setEditingDoc(doc);
      setValue('category', doc.category);
      setValue('academicYear', doc.academicYear);
      setValue('documentUrl', doc.documentUrl || '');
      setValue('order', doc.order);
      setDocFileName(doc.documentUrl && doc.documentUrl !== '#' ? 'Uploaded Document' : null);
    } else {
      setEditingDoc(null);
      const cat = categoryPreset || activeCategory;
      const countInCat = documents.filter(d => d.category === cat).length;
      reset({
        category: cat,
        academicYear: '2025-2026',
        documentUrl: '',
        order: countInCat + 1,
      });
      setDocFileName(null);
    }
    setDocFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDoc(null);
    reset();
    setDocFile(null);
    setDocFileName(null);
  };

  const filteredDocs = documents.filter(d => d.category === activeCategory);

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-violet-900">Manage Research Documents</h1>
          <p className="text-gray-500">Upload academic year document PDFs for Publications & Seminars / Workshops</p>
        </div>
        <button
          onClick={() => openModal(undefined, activeCategory)}
          className="flex items-center gap-2 rounded-lg bg-violet-900 px-4 py-2.5 font-bold text-white transition-all hover:bg-violet-800 shadow-sm"
        >
          <Plus size={20} />
          Add Document
        </button>
      </div>

      {/* Category Tabs */}
      <div className="mb-8 flex border-b border-gray-200">
        <button
          onClick={() => setActiveCategory('publications')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-all ${
            activeCategory === 'publications'
              ? 'border-violet-900 text-violet-900'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Publications
        </button>
        <button
          onClick={() => setActiveCategory('seminars')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-all ${
            activeCategory === 'seminars'
              ? 'border-violet-900 text-violet-900'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Seminars / Workshops / Conferences
        </button>
      </div>

      {/* Document Table */}
      <div className="overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#9d174d] text-white text-sm font-bold">
              <th className="py-4 px-6 w-20">S.No</th>
              <th className="py-4 px-6">Academic Year</th>
              <th className="py-4 px-6">Document Link</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {filteredDocs.map((doc, idx) => (
              <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 font-semibold text-gray-700">{idx + 1}</td>
                <td className="py-4 px-6 font-bold text-gray-900">{doc.academicYear}</td>
                <td className="py-4 px-6">
                  {doc.documentUrl && doc.documentUrl !== '#' ? (
                    <a
                      href={doc.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-violet-900 font-bold hover:underline"
                    >
                      <FileText size={16} /> View Document <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">No document attached</span>
                  )}
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openModal(doc)}
                      className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredDocs.length === 0 && (
              <tr>
                <td colSpan={4} className="py-12 text-center text-gray-400 italic">
                  No documents uploaded for this section yet. Click "Add Document" above to create one.
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
                {editingDoc ? 'Edit Document Entry' : 'Add Research Document'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Section / Category</label>
                <select
                  {...register('category')}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-violet-900 focus:outline-none"
                >
                  <option value="publications">Publications</option>
                  <option value="seminars">Seminars / Workshops / Conferences</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Academic Year</label>
                <input
                  {...register('academicYear')}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-violet-900 focus:outline-none"
                  placeholder="e.g., 2025-2026"
                />
                {errors.academicYear && <p className="text-xs text-red-500 mt-1">{errors.academicYear.message}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Upload PDF / Document</label>
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="text-xs text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-50 file:px-3.5 file:py-2.5 file:text-xs file:font-bold file:text-violet-900 hover:file:bg-violet-100 cursor-pointer"
                  />
                  {docFileName && (
                    <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <FileText size={14} /> Selected: {docFileName}
                    </p>
                  )}
                </div>
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
                  {loading ? 'Saving...' : 'Save Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
