'use client';

import React, { useState, useEffect } from 'react';
import { Search, BookOpen, PlusCircle, Loader2, CheckCircle2, Send, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const SUBJECTS = [
  'Mathematics for Programming',
  'Introduction to Computer Programming',
  'Web Development',
  'Data Structures & Algorithms',
  'System Design'
];

interface Doubt {
  id: string;
  user_id?: string | null;
  title: string;
  subject_code: string;
  description: string;
  image_url?: string | null;
  is_resolved: boolean;
  forwarded_to_instructor: boolean;
  created_at?: string;
}

export default function AcademicModule() {
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');

  // Form States
  const [title, setTitle] = useState('');
  const [subjectCode, setSubjectCode] = useState(SUBJECTS[0]);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDoubts();
  }, []);

  const fetchDoubts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('doubts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch error:', error.message);
    } else {
      setDoubts((data as Doubt[]) || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase.from('doubts').insert([
        {
          title,
          subject_code: subjectCode,
          description,
          is_resolved: false,
          forwarded_to_instructor: false
        }
      ]);

      if (error) {
        alert(`Database Error: ${error.message}`);
      } else {
        setTitle('');
        setDescription('');
        fetchDoubts();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit doubt';
      alert(`Error: ${message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleResolved = async (doubt: Doubt) => {
    const { error } = await supabase
      .from('doubts')
      .update({ is_resolved: !doubt.is_resolved })
      .eq('id', doubt.id);

    if (error) alert(error.message);
    else fetchDoubts();
  };

  const toggleForwarded = async (doubt: Doubt) => {
    const { error } = await supabase
      .from('doubts')
      .update({ forwarded_to_instructor: !doubt.forwarded_to_instructor })
      .eq('id', doubt.id);

    if (error) alert(error.message);
    else fetchDoubts();
  };

  const filteredDoubts = doubts.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) &&
      (subjectFilter === '' || d.subject_code === subjectFilter)
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" /> Academic Doubts Portal
            </h2>
            <p className="text-xs font-semibold text-slate-600">
              Post your doubts and collaborate with peers or mentors
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              placeholder="Search doubts by title or topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
            />
          </div>
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="sm:w-64 py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800"
          >
            <option value="">All Subject Codes</option>
            {SUBJECTS.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Submit Form */}
      <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-indigo-700 font-black text-sm">
          <PlusCircle className="w-4 h-4 text-indigo-600" /> Ask an Academic Doubt
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            required
            placeholder="Doubt Title (e.g. Recursion base condition confusion)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
          />
          <select
            value={subjectCode}
            onChange={(e) => setSubjectCode(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {SUBJECTS.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
        <textarea
          required
          placeholder="Explain your issue in detail or paste snippet..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
        />
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 shadow-md shadow-indigo-100 transition"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />} Submit Academic Doubt
        </button>
      </form>

      {/* Feed */}
      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-28 bg-slate-200 rounded-2xl"></div>
        </div>
      ) : filteredDoubts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm font-bold">
          No doubts posted yet. Be the first to ask!
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDoubts.map((doubt) => (
            <div key={doubt.id} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3">
              <div className="flex flex-wrap justify-between items-start gap-2">
                <span className="text-xs font-extrabold px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {doubt.subject_code}
                </span>

                <div className="flex items-center gap-2">
                  {doubt.forwarded_to_instructor && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      <Send className="w-3 h-3" /> Forwarded to Instructor
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      doubt.is_resolved
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {doubt.is_resolved ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5" /> Open
                      </>
                    )}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900">{doubt.title}</h3>
                <p className="text-xs font-medium text-slate-700 leading-relaxed mt-1">{doubt.description}</p>
              </div>

              {/* Action Toolbar */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
                <button
                  onClick={() => toggleForwarded(doubt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    doubt.forwarded_to_instructor
                      ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {doubt.forwarded_to_instructor ? 'Unforward' : 'Forward to Instructor'}
                </button>
                <button
                  onClick={() => toggleResolved(doubt)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                    doubt.is_resolved
                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {doubt.is_resolved ? 'Mark as Unresolved' : 'Mark as Resolved'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}