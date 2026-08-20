'use client';

import React, { useState, useEffect } from 'react';
import { Search, ImagePlus, CheckCircle2, Clock, ShieldCheck, PlusCircle, Laptop, Loader2 } from 'lucide-react';
import { supabase, compressAndUploadImage } from '@/lib/supabase';
import { Equipment, EquipmentRequest } from '@/types/database';

const CATEGORIES = ['Laptops & Accessories', 'Microcontrollers & Sensors', 'Adapters & Cables', 'Monitors & Displays', 'Other Tech'];

export default function EquipmentModule() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [requests, setRequests] = useState<EquipmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'available' | 'requests'>('available');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeSubTab]);

  const fetchData = async () => {
    setLoading(true);
    if (activeSubTab === 'available') {
      const { data } = await supabase.from('equipment').select('*').order('created_at', { ascending: false });
      setEquipment(data || []);
    } else {
      const { data } = await supabase.from('equipment_requests').select('*').order('created_at', { ascending: false });
      setRequests(data || []);
    }
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
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id || '00000000-0000-0000-0000-000000000000';

    if (activeSubTab === 'available') {
      let imageUrl = null;
      if (imageFile) imageUrl = await compressAndUploadImage(imageFile, 'equipment');
      await supabase.from('equipment').insert([{
        owner_id: userId,
        title,
        category,
        description,
        image_url: imageUrl,
        status: 'available'
      }]);
    } else {
      await supabase.from('equipment_requests').insert([{
        user_id: userId,
        title,
        category,
        description
      }]);
    }

    setTitle(''); setDescription(''); setImageFile(null); setPreview(null);
    setSubmitting(false);
    fetchData();
  };

  const toggleStatus = async (item: Equipment) => {
    const nextStatus = item.status === 'available' ? 'borrowed' : 'available';
    await supabase.from('equipment').update({ status: nextStatus, is_available: nextStatus === 'available' }).eq('id', item.id);
    fetchData();
  };

  const filteredEquipment = equipment.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) &&
    (categoryFilter === '' || e.category === categoryFilter)
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> Hardware & Tech Sharing
            </h2>
            <p className="text-xs text-slate-500">Share or request hardware gear with fellow campus peers</p>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveSubTab('available')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeSubTab === 'available' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Available Gear
            </button>
            <button
              onClick={() => setActiveSubTab('requests')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeSubTab === 'requests' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hardware Requests
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              placeholder="Search gear or requests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="sm:w-60 py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Upload/Post Form */}
      <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
          <PlusCircle className="w-4 h-4" />
          {activeSubTab === 'available' ? 'List Gear for Lending' : 'Request Needed Hardware'}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            required
            placeholder={activeSubTab === 'available' ? "Title (e.g. Raspberry Pi 4 B, USB-C Hub)" : "Title (e.g. HDMI to VGA Adapter)"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {activeSubTab === 'available' && (
            <div className="flex items-center gap-2">
              <label className="cursor-pointer flex items-center justify-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200/70 text-slate-700 text-xs font-semibold rounded-xl border border-dashed border-slate-300 flex-1 transition">
                <ImagePlus className="w-4 h-4 text-emerald-600" /> Equipment Photo
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
              {preview && <img src={preview} className="w-10 h-10 rounded-lg object-cover border" alt="Preview" />}
            </div>
          )}
        </div>
        <textarea
          required
          placeholder="Describe condition, specifications, or duration required..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
        />
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2 shadow-md shadow-emerald-100 transition"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />} Submit Listing
        </button>
      </form>

      {/* Grid Feed */}
      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-28 bg-slate-200 rounded-2xl"></div>
        </div>
      ) : activeSubTab === 'available' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEquipment.map((item) => (
            <div key={item.id} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {item.category}
                  </span>
                  <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                    item.status === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.status === 'available' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    {item.status}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                {item.image_url && <img src={item.image_url} alt={item.title} className="max-h-48 rounded-xl object-contain border w-full mt-2" />}
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => toggleStatus(item)}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition"
                >
                  Toggle Borrow Status
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <div key={req.id} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex justify-between items-center gap-4">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-100">
                  {req.category}
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-1">{req.title}</h4>
                <p className="text-xs text-slate-600">{req.description}</p>
              </div>
              <button className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition whitespace-nowrap">
                Fulfill Request
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}