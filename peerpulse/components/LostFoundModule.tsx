'use client';

import React, { useState, useEffect } from 'react';
import { Search, ImagePlus, MapPin, CheckCircle2, AlertTriangle, PlusCircle, Loader2, Phone } from 'lucide-react';
import { supabase, compressAndUploadImage } from '@/lib/supabase';
import { LostFoundItem } from '@/types/database';

export default function LostFoundModule() {
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<'all' | 'lost' | 'found'>('all');
  const [search, setSearch] = useState('');

  // Form States
  const [type, setType] = useState<'lost' | 'found'>('lost');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase.from('lost_found').select('*').order('created_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    let imageUrl = null;
    if (imageFile) imageUrl = await compressAndUploadImage(imageFile, 'lost-found');

    const { data: userData } = await supabase.auth.getUser();
    await supabase.from('lost_found').insert([{
      user_id: userData.user?.id || '00000000-0000-0000-0000-000000000000',
      type,
      title,
      location,
      contact_info: contactInfo,
      description,
      image_url: imageUrl,
      status: 'open'
    }]);

    setTitle(''); setLocation(''); setContactInfo(''); setDescription(''); setImageFile(null); setPreview(null);
    setSubmitting(false);
    fetchItems();
  };

  const markClaimed = async (id: string) => {
    await supabase.from('lost_found').update({ status: 'claimed' }).eq('id', id);
    fetchItems();
  };

  const filteredItems = items.filter(i =>
    (typeFilter === 'all' || i.type === typeFilter) &&
    (i.title.toLowerCase().includes(search.toLowerCase()) || i.location.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Campus Lost & Found
            </h2>
            <p className="text-xs text-slate-500">Quickly report or recover misplaced items around campus</p>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {(['all', 'lost', 'found'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg capitalize transition-all ${
                  typeFilter === t ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            placeholder="Search by item title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900"
          />
        </div>
      </div>

      {/* Report Form */}
      <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
          <PlusCircle className="w-4 h-4" /> Post a Lost or Found Item
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'lost' | 'found')}
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="lost">Lost Item</option>
            <option value="found">Found Item</option>
          </select>
          <input
            required
            placeholder="Item (e.g. Blue Boat Earbuds)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900"
          />
          <input
            required
            placeholder="Location (e.g. SST Lab 3)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900"
          />
          <input
            required
            placeholder="Contact (e.g. +91 9876543210)"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <textarea
            required
            placeholder="Item color, unique marks, or details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="sm:col-span-2 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900"
          />
          <div className="flex items-center gap-2">
            <label className="cursor-pointer flex items-center justify-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200/70 text-slate-700 text-xs font-semibold rounded-xl border border-dashed border-slate-300 flex-1 transition h-full">
              <ImagePlus className="w-4 h-4 text-amber-600" /> Upload Photo
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
            {preview && <img src={preview} className="w-12 h-12 rounded-lg object-cover border" alt="Preview" />}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-bold hover:bg-amber-600 disabled:opacity-50 flex items-center gap-2 shadow-md shadow-amber-100 transition"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />} Post Report
        </button>
      </form>

      {/* Feed List */}
      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-28 bg-slate-200 rounded-2xl"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wide border ${
                    item.type === 'lost' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {item.type}
                  </span>
                  {item.status === 'claimed' && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" /> Resolved
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-slate-900">{item.title}</h3>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" /> {item.location}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                {item.image_url && <img src={item.image_url} alt={item.title} className="max-h-48 rounded-xl object-contain border w-full mt-2" />}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-slate-700 font-bold bg-slate-50 px-2.5 py-1 rounded-lg border">
                  <Phone className="w-3.5 h-3.5 text-indigo-600" /> {item.contact_info}
                </div>
                {item.status === 'open' && (
                  <button
                    onClick={() => markClaimed(item.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition"
                  >
                    Mark Claimed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}