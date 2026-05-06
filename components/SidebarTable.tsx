"use client";

import { useEffect, useState } from 'react';
import { AlertTriangle, Plus, Loader2, ArrowRight, Calendar, User } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// Definisi tipe data
interface ProblemReport {
  id: number;
  date: string;
  customer_name: string;
  unit_name: string;
}

export default function SidebarTable() {
  const [reports, setReports] = useState<ProblemReport[]>([]);
  const [loading, setLoading] = useState(true);

  // Ambil 4 data terbaru
  const fetchRecentlyProblems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ProblemUnit')
        .select('id, date, customer_name, unit_name')
        .order('id', { ascending: false })
        .limit(4);

      if (error) throw error;
      setReports(data || []);
    } catch (error: any) {
      console.error('Fetch Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentlyProblems();
  }, []);

  return (
    <aside className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-tight">
          <AlertTriangle size={18} className="text-amber-500" />
          最新の不具合報告
        </h3>
        <Link href="/dashboard/add-problem">
          <button className="bg-slate-900 hover:bg-black text-white text-[10px] font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all active:scale-95 uppercase tracking-wider shadow-md shadow-slate-200">
            <Plus size={14} /> 新規登録
          </button>
        </Link>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-8 flex flex-col items-center justify-center min-h-[300px]">
             <Loader2 className="animate-spin text-blue-500 mb-2" size={24} />
             <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">読み込み中...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="p-8 flex flex-col items-center justify-center min-h-[300px]">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-50 text-amber-300 rounded-xl mb-3">
                <AlertTriangle size={24} />
              </div>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">データがありません</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {reports.map((item) => (
              <Link 
                href={`/dashboard/detail/${item.id}`} 
                key={item.id} 
                className="block p-5 hover:bg-blue-50/50 transition-all group relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-200" />

                <div className="flex justify-between items-start mb-2">
                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                     <Calendar size={10} />
                     {item.date}
                   </div>
                   <div className="text-[10px] font-bold text-slate-300">ID #{item.id}</div>
                </div>
                
                <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1 uppercase">
                  {item.unit_name}
                </h4>
                
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                    <User size={12} className="text-slate-400" />
                    {item.customer_name} 様
                  </div>
                  <ArrowRight size={14} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
            
            {/* Footer link to view all */}
            <div className="p-4 bg-slate-50/30">
              <Link href="/dashboard/all-reports" className="block w-full py-2.5 rounded-lg border border-dashed border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:border-blue-200 hover:text-blue-500 transition-all bg-white text-center">
                すべての報告を表示
              </Link>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}