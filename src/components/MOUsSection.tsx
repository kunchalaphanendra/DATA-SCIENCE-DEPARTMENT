import { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import { MOU } from '@/src/types';
import { defaultMOUs } from '@/src/data/mouData';

export default function MOUsSection() {
  const [mous, setMous] = useState<MOU[]>([]);

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

  useEffect(() => {
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
          })));
        } else {
          setMous(loadLocalMOUs());
        }
      } catch (err) {
        setMous(loadLocalMOUs());
      }
    };
    fetchMOUs();
  }, []);

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-10 border border-slate-200/70 shadow-xs">
      <div className="mb-8">
        <h2 className="text-3xl font-[900] text-slate-900 tracking-tight">MOUs</h2>
        <div className="mt-3 h-1 w-16 bg-[#9d174d] rounded-full" />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 shadow-2xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#9d174d] text-white text-base font-bold">
              <th className="py-4 px-6 w-24 border-r border-white/20">S.No</th>
              <th className="py-4 px-6 border-r border-white/20">Name of MOU</th>
              <th className="py-4 px-6 w-36 border-r border-white/20">Duration</th>
              <th className="py-4 px-6">Activities Included</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80 text-base">
            {mous.map((item, idx) => (
              <tr
                key={item.id}
                className={idx % 2 === 1 ? 'bg-slate-50/60 hover:bg-slate-100/70' : 'bg-white hover:bg-slate-50'}
              >
                <td className="py-4 px-6 font-semibold text-slate-600 border-r border-slate-200/60">{idx + 1}</td>
                <td className="py-4 px-6 font-bold text-slate-900 border-r border-slate-200/60">{item.name}</td>
                <td className="py-4 px-6 font-medium text-slate-700 border-r border-slate-200/60">{item.duration}</td>
                <td className="py-4 px-6 text-slate-700 leading-relaxed">{item.activities}</td>
              </tr>
            ))}
            {mous.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-400 italic">No MOUs registered yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
