import React, { useState, useEffect } from 'react';
import AdminLayout from '@/src/components/AdminLayout';
import { supabase, uploadFile } from '@/src/lib/supabase';
import { Event, EventStatus } from '@/src/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Loader2 } from 'lucide-react';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  venue: z.string().min(1, 'Venue is required'),
  category: z.string().min(1, 'Category is required'),
  status: z.enum(['Upcoming', 'Past']),
});

type EventFormData = z.infer<typeof eventSchema>;

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: { status: 'Upcoming' }
  });

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      setEvents(data.map(r => ({
        id: r.id,
        title: r.title,
        description: r.description,
        date: r.date,
        venue: r.venue,
        category: r.category,
        status: r.status as EventStatus,
        imageUrl: r.image_url || '',
      })));
    }
  };

  useEffect(() => {
    fetchEvents();
    const channel = supabase
      .channel('events-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, fetchEvents)
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

  const onSubmit = async (data: EventFormData) => {
    setLoading(true);
    try {
      let imageUrl = editingEvent?.imageUrl || '';

      if (imageFile) {
        const path = `${Date.now()}_${imageFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        imageUrl = await uploadFile('events', path, imageFile);
      }

      if (editingEvent) {
        const { error } = await supabase.from('events').update({
          title: data.title,
          description: data.description,
          date: data.date,
          venue: data.venue,
          category: data.category,
          status: data.status,
          image_url: imageUrl,
          updated_at: new Date().toISOString(),
        }).eq('id', editingEvent.id);
        if (error) throw error;
        toast.success('Event updated');
      } else {
        const { error } = await supabase.from('events').insert({
          title: data.title,
          description: data.description,
          date: data.date,
          venue: data.venue,
          category: data.category,
          status: data.status,
          image_url: imageUrl,
        });
        if (error) throw error;
        toast.success('Event added');
      }
      closeModal();
      await fetchEvents();
    } catch (error: any) {
      console.error('Event save error:', error);
      toast.error(error.message || 'Operation failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      toast.success('Event deleted');
      await fetchEvents();
    } catch (error: any) {
      toast.error(error.message || 'Delete failed');
    }
  };

  const openModal = (event?: Event) => {
    if (event) {
      setEditingEvent(event);
      setValue('title', event.title);
      setValue('description', event.description);
      setValue('date', event.date);
      setValue('venue', event.venue);
      setValue('category', event.category);
      setValue('status', event.status);
      setImagePreview(event.imageUrl || null);
    } else {
      setEditingEvent(null);
      reset();
      setImagePreview(null);
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
    reset();
    setImagePreview(null);
    setImageFile(null);
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-violet-900">Manage Events</h1>
          <p className="text-gray-500">Add or edit department events and news</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 rounded-lg bg-violet-900 px-4 py-2 font-bold text-white transition-all hover:bg-violet-800"
        >
          <Plus size={20} />
          Add Event
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <div key={event.id} className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
            <div className="relative h-40">
              <img
                src={event.imageUrl || `https://picsum.photos/seed/${event.id}/400/200`}
                alt={event.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute right-2 top-2 flex gap-1">
                <button onClick={() => openModal(event)} className="rounded-full bg-white/90 p-2 text-blue-600 shadow-sm hover:bg-white">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(event.id)} className="rounded-full bg-white/90 p-2 text-red-600 shadow-sm hover:bg-white">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="mb-1 text-xs font-bold uppercase text-amber-600">{event.date}</div>
              <h3 className="font-bold text-violet-900 line-clamp-1">{event.title}</h3>
              <p className="mt-2 text-xs text-gray-500 line-clamp-2">{event.description}</p>
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 italic">No events found.</div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="my-8 w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-violet-900">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h2>
              {/* Always enabled — user can close modal even if upload hangs */}
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Event Title</label>
                    <input
                      {...register('title')}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none"
                    />
                    {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      {...register('description')}
                      rows={4}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none"
                    />
                    {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Cover Image</label>
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-dashed border-gray-200 bg-gray-50">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center text-gray-400">
                          <ImageIcon size={32} />
                          <span className="mt-2 text-xs">Click to upload</span>
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

                  <div className="grid gap-4 grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Date</label>
                      <input
                        type="date"
                        {...register('date')}
                        className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                      <select
                        {...register('status')}
                        className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none"
                      >
                        <option value="Upcoming">Upcoming</option>
                        <option value="Past">Past</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Venue</label>
                  <input
                    {...register('venue')}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none"
                    placeholder="e.g., Seminar Hall 1"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
                  <input
                    {...register('category')}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none"
                    placeholder="e.g., Workshop"
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
                  {loading ? 'Saving...' : 'Save Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
