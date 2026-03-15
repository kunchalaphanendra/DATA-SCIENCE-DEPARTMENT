import React, { useState, useEffect } from 'react';
import AdminLayout from '@/src/components/AdminLayout';
import { supabase, uploadFile } from '@/src/lib/supabase';
import { GalleryImage } from '@/src/types';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, X, Loader2, Upload } from 'lucide-react';

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [album, setAlbum] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      setImages(data.map(r => ({
        id: r.id,
        imageUrl: r.image_url,
        album: r.album,
        caption: r.caption || '',
      })));
    }
  };

  useEffect(() => {
    fetchImages();
    const channel = supabase
      .channel('gallery-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery' }, fetchImages)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFiles || !album) {
      toast.error('Album name and at least one image are required');
      return;
    }

    setLoading(true);
    try {
      for (const file of Array.from(selectedFiles)) {
        const path = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        const imageUrl = await uploadFile('gallery', path, file);

        const { error } = await supabase.from('gallery').insert({
          image_url: imageUrl,
          album,
          caption,
        });
        if (error) throw error;
      }
      toast.success('Images uploaded successfully');
      closeModal();
      await fetchImages();
    } catch (error: any) {
      toast.error(error.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (error) throw error;
      toast.success('Image deleted');
      await fetchImages();
    } catch (error: any) {
      toast.error(error.message || 'Delete failed');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setAlbum('');
    setCaption('');
    setSelectedFiles(null);
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-violet-900">Manage Gallery</h1>
          <p className="text-gray-500">Upload and organize department photos</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-violet-900 px-4 py-2 font-bold text-white transition-all hover:bg-violet-800"
        >
          <Plus size={20} />
          Upload Images
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {images.map((img) => (
          <div key={img.id} className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100 shadow-sm">
            <img src={img.imageUrl} alt={img.caption} className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <button onClick={() => handleDelete(img.id)} className="rounded-full bg-white p-3 text-red-600 shadow-lg hover:bg-red-50">
                <Trash2 size={20} />
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-[10px] text-white">
              {img.album}
            </div>
          </div>
        ))}
        {images.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 italic">No images found in gallery.</div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-violet-900">Upload Gallery Images</h2>
              {/* Always enabled close button */}
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Album Name</label>
                <input
                  type="text"
                  required
                  value={album}
                  onChange={(e) => setAlbum(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none"
                  placeholder="e.g., Annual Day 2024"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Caption (Optional)</label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-violet-900 focus:outline-none"
                  placeholder="Short description..."
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Select Images</label>
                <div className="relative flex h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400">
                  <Upload size={32} />
                  <span className="mt-2 text-xs">
                    {selectedFiles ? `${selectedFiles.length} files selected` : 'Click to select multiple images'}
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setSelectedFiles(e.target.files)}
                    className="absolute inset-0 cursor-pointer opacity-0"
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
                  {loading ? 'Uploading...' : 'Upload Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
