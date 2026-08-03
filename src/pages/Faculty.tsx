import { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import { Faculty, BoardMember, CommitteeMember } from '@/src/types';
import { defaultFacultyData } from '@/src/data/facultyData';
import { defaultBoardMembers } from '@/src/data/boardOfStudiesData';
import { defaultDisciplinaryMembers } from '@/src/data/committeeData';
import { Search, X, Award, GraduationCap, ShieldAlert } from 'lucide-react';

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const [committeeMembers, setCommitteeMembers] = useState<CommitteeMember[]>([]);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);

  useEffect(() => {
    supabase.from('faculty').select('*').order('order', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
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
        } else {
          setFaculty(defaultFacultyData);
        }
      });

    const loadBOSData = () => {
      const stored = localStorage.getItem('vits_bos_members_v3');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length >= defaultBoardMembers.length) {
            return parsed;
          }
        } catch (e) {}
      }
      return defaultBoardMembers;
    };

    const loadCommitteeData = () => {
      const stored = localStorage.getItem('vits_disciplinary_committee_v1');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {}
      }
      return defaultDisciplinaryMembers;
    };

    // Fetch Board of Studies members
    const fetchBOS = async () => {
      try {
        const { data, error } = await supabase.from('board_of_studies').select('*').order('order', { ascending: true });
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
          })));
        } else {
          setBoardMembers(loadBOSData());
        }
      } catch (err) {
        setBoardMembers(loadBOSData());
      }
    };

    // Fetch Disciplinary Committee members
    const fetchCommittee = async () => {
      try {
        const { data, error } = await supabase.from('disciplinary_committee').select('*').order('order', { ascending: true });
        if (!error && data && data.length > 0) {
          setCommitteeMembers(data.map(r => ({
            id: r.id,
            name: r.name,
            designation: r.designation || 'Member',
            order: r.order || 0,
          })));
        } else {
          setCommitteeMembers(loadCommitteeData());
        }
      } catch (err) {
        setCommitteeMembers(loadCommitteeData());
      }
    };

    fetchBOS();
    fetchCommittee();
  }, []);

  const designations = ['All', 'Professor', 'Associate Professor', 'Assistant Professor', 'Board of Studies', 'Disciplinary Committee'];

  const filteredFaculty = faculty.filter(f => {
    const name = f.name?.toLowerCase() || '';
    const specialization = f.specialization?.toLowerCase() || '';
    const designation = f.designation || '';
    const search = searchTerm.toLowerCase();

    const matchesFilter = filter === 'All' || designation === filter;
    const matchesSearch = name.includes(search) || specialization.includes(search);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-violet-900">Our Faculty</h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Our department has highly qualified and experienced faculty members dedicated to providing quality education and mentoring to students.
          </p>
          <div className="mx-auto mt-4 h-1 w-24 bg-amber-500 rounded-full" />
        </div>

        {/* Filters */}
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-center">
          <div className="flex flex-wrap justify-center gap-3">
            {designations.map((d) => (
              <button
                key={d}
                onClick={() => setFilter(d)}
                className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all shadow-sm ${
                  filter === d
                    ? 'bg-violet-900 text-white ring-2 ring-violet-900 ring-offset-2'
                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-violet-900 border border-gray-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <div className="relative w-full max-w-md mx-auto md:mx-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-gray-200 py-3 pl-12 pr-4 shadow-sm focus:border-violet-900 focus:ring-1 focus:ring-violet-900 focus:outline-none transition-shadow"
            />
          </div>
        </div>

        {/* Faculty Grid or Board of Studies Grid */}
        {filter === 'Board of Studies' ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {boardMembers.map((m) => (
              <div key={m.id} className="flex items-center p-5 rounded-[20px] shadow-sm border border-gray-100 bg-white hover:shadow-md transition-all">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-[72px] h-[72px] rounded-full overflow-hidden border-4 border-violet-100 shadow-sm">
                    <img
                      src={m.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=random`}
                      alt={m.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="inline-block rounded-full bg-violet-100 text-violet-800 text-[11px] font-bold px-2.5 py-0.5 mb-1">
                    {m.role}
                  </span>
                  <h3 className="text-base font-bold text-gray-900 truncate">{m.name}</h3>
                  <p className="text-xs font-semibold text-blue-600 truncate">{m.designation}</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{m.organization}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredFaculty.map((f, i) => {
                const bgColors = ['bg-blue-50/70', 'bg-purple-50/70', 'bg-blue-50/70', 'bg-purple-50/70'];
                const cardBg = bgColors[i % bgColors.length];

                return (
                  <div
                    key={f.id}
                    onClick={() => setSelectedFaculty(f)}
                    className={`group flex items-center p-4 rounded-[20px] shadow-sm border border-gray-100 cursor-pointer transition-all hover:shadow-md hover:-translate-y-1 ${cardBg}`}
                  >
                    <div className="flex-shrink-0 mr-5 relative">
                      <div className="w-[84px] h-[84px] rounded-full overflow-hidden border-4 border-white shadow-sm">
                        <img
                          src={f.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(f.name)}&background=random`}
                          alt={f.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-violet-900 transition-colors">{f.name}</h3>
                      {f.departmentRole ? (
                        <p className="text-[13px] font-semibold text-blue-600 truncate mt-0.5">{f.departmentRole}</p>
                      ) : null}
                      <p className="text-[13px] font-medium text-purple-700 truncate mt-0.5">{f.designation}</p>
                      {(!f.departmentRole && f.specialization) && (
                        <p className="text-[12px] text-gray-500 truncate mt-0.5">{f.specialization}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredFaculty.length === 0 && (
              <div className="py-20 text-center text-gray-500 italic bg-white rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-lg">No faculty members found matching your criteria.</p>
              </div>
            )}

            {/* Board of Studies Section */}
            {filter === 'All' && boardMembers.length > 0 && (
              <div className="mt-20 border-t border-gray-200 pt-16">
                <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-violet-900 flex items-center gap-2 justify-center sm:justify-start">
                      <GraduationCap className="text-amber-500" size={28} />
                      Board of Studies Members
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">Distinguished faculty and experts guiding department curriculum & academic standards.</p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {boardMembers.map((m) => (
                    <div key={m.id} className="flex items-center p-5 rounded-[20px] shadow-sm border border-gray-100 bg-white hover:shadow-md transition-all">
                      <div className="flex-shrink-0 mr-4">
                        <div className="w-[72px] h-[72px] rounded-full overflow-hidden border-4 border-violet-100 shadow-sm">
                          <img
                            src={m.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=random`}
                            alt={m.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="inline-block rounded-full bg-violet-100 text-violet-800 text-[11px] font-bold px-2.5 py-0.5 mb-1">
                          {m.role}
                        </span>
                        <h3 className="text-base font-bold text-gray-900 truncate">{m.name}</h3>
                        <p className="text-xs font-semibold text-blue-600 truncate">{m.designation}</p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{m.organization}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Disciplinary Committee Section */}
            {(filter === 'All' || filter === 'Disciplinary Committee') && committeeMembers.length > 0 && (
              <div className="mt-16 border-t border-gray-200 pt-16">
                <div className="rounded-3xl bg-white p-6 sm:p-10 border border-slate-200/70 shadow-xs">
                  <div className="mb-8">
                    <h2 className="text-3xl font-[900] text-slate-900 tracking-tight">Disciplinary Committee</h2>
                    <div className="mt-3 h-1 w-16 bg-[#9d174d] rounded-full" />
                  </div>

                  <div className="overflow-hidden rounded-xl border border-slate-200 shadow-2xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#9d174d] text-white text-base font-bold">
                          <th className="py-4 px-6 w-24 border-r border-white/20">S.No</th>
                          <th className="py-4 px-6 border-r border-white/20">Name of the Member</th>
                          <th className="py-4 px-6">Designation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200/80 text-base">
                        {committeeMembers.map((m, idx) => (
                          <tr
                            key={m.id}
                            className={idx % 2 === 1 ? 'bg-slate-50/60 hover:bg-slate-100/70' : 'bg-white hover:bg-slate-50'}
                          >
                            <td className="py-4 px-6 font-semibold text-slate-600 border-r border-slate-200/60">{idx + 1}</td>
                            <td className="py-4 px-6 font-bold text-slate-900 border-r border-slate-200/60">{m.name}</td>
                            <td className="py-4 px-6 font-semibold text-slate-800">{m.designation}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Details Modal */}
      {selectedFaculty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
            onClick={() => setSelectedFaculty(null)}
          />
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <button
              onClick={() => setSelectedFaculty(null)}
              className="absolute top-6 right-6 p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors z-10 border border-blue-200"
            >
              <X size={20} />
            </button>

            <div className="p-8 sm:p-10 overflow-y-auto">
              <div className="flex flex-col md:flex-row gap-10 items-start md:items-center">
                <div className="flex-shrink-0 mx-auto md:mx-0">
                  <div className="w-48 h-48 rounded-full overflow-hidden border-[6px] border-white outline outline-2 outline-blue-500 shadow-lg">
                    <img
                      src={selectedFaculty.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedFaculty.name)}&background=random`}
                      alt={selectedFaculty.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex-1 space-y-5 text-center md:text-left">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{selectedFaculty.name}</h2>
                    {selectedFaculty.departmentRole && (
                      <p className="text-lg text-gray-500 mt-1">{selectedFaculty.departmentRole}</p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8 text-sm text-gray-600">
                    <div>
                      <h4 className="font-bold text-gray-500 tracking-wider text-xs uppercase mb-1">Position</h4>
                      <p className="text-blue-600 font-medium text-base">{selectedFaculty.designation}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-500 tracking-wider text-xs uppercase mb-1">Qualification</h4>
                      <p className="text-gray-900 font-medium">{selectedFaculty.qualification}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-500 tracking-wider text-xs uppercase mb-1">Email</h4>
                      <a href={`mailto:${selectedFaculty.email}`} className="text-gray-900 font-medium hover:text-blue-600 transition-colors">
                        {selectedFaculty.email}
                      </a>
                    </div>
                    {selectedFaculty.portfolioUrl && (
                      <div>
                        <h4 className="font-bold text-gray-500 tracking-wider text-xs uppercase mb-1">Portfolio Page</h4>
                        <a href={selectedFaculty.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium inline-flex items-center gap-1 hover:underline">
                          {selectedFaculty.portfolioUrl}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-12 grid md:grid-cols-2 gap-6">
                <div className="bg-[#f8f9fc] rounded-2xl p-6 border border-gray-100">
                  <h4 className="font-bold text-gray-600 tracking-wider text-xs uppercase mb-3">About</h4>
                  <p className="text-gray-800 whitespace-pre-line">{selectedFaculty.experience || 'Not specified'}</p>
                </div>
                <div className="bg-[#faf5ff] rounded-2xl p-6 border border-gray-100">
                  <h4 className="font-bold text-gray-600 tracking-wider text-xs uppercase mb-3">Specialization</h4>
                  <p className="text-gray-800 whitespace-pre-line">{selectedFaculty.specialization || 'Not specified'}</p>
                </div>
                <div className="bg-[#f0fdf4] rounded-2xl p-6 border border-gray-100">
                  <h4 className="font-bold text-gray-600 tracking-wider text-xs uppercase mb-3">Publications</h4>
                  {typeof selectedFaculty.publications === 'string' && selectedFaculty.publications.trim() ? (
                    <p className="text-gray-800 whitespace-pre-line">{selectedFaculty.publications}</p>
                  ) : Array.isArray(selectedFaculty.publications) && selectedFaculty.publications.length > 0 ? (
                    <div className="space-y-3">
                      {selectedFaculty.publications.map((pub: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-3">
                          {pub.badge && (
                            <span className={`flex items-center justify-center w-8 h-8 rounded-lg text-white font-bold text-sm shadow-sm ${idx % 2 === 0 ? 'bg-blue-600' : 'bg-green-600'}`}>
                              {pub.badge}
                            </span>
                          )}
                          <span className="text-gray-700">{typeof pub === 'string' ? pub : pub.text || JSON.stringify(pub)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No publications listed</p>
                  )}
                </div>
                <div className="bg-[#fff7ed] rounded-2xl p-6 border border-gray-100">
                  <h4 className="font-bold text-gray-600 tracking-wider text-xs uppercase mb-3">Awards</h4>
                  {typeof selectedFaculty.awards === 'string' && selectedFaculty.awards.trim() ? (
                    <p className="text-gray-800 whitespace-pre-line">{selectedFaculty.awards}</p>
                  ) : Array.isArray(selectedFaculty.awards) && selectedFaculty.awards.length > 0 ? (
                    <div className="flex flex-col gap-3">
                      {selectedFaculty.awards.map((award: any, idx: number) => (
                        <span key={idx} className="inline-flex w-fit bg-[#ea580c] text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                          {typeof award === 'string' ? award : JSON.stringify(award)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No awards listed</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
