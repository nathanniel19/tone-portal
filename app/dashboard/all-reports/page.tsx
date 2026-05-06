"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft, Search, Loader2, Calendar, 
  User, Truck, MapPin, ChevronRight 
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

interface ProblemReport {
  id: number;
  date: string;
  customer_name: string;
  unit_name: string;
  problem_title: string;
  location: string;
}

export default function AllReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<ProblemReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<ProblemReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  // リアルタイム検索ロジック
  useEffect(() => {
    const filtered = reports.filter(item => 
      item.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.unit_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.problem_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredReports(filtered);
  }, [searchQuery, reports]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ProblemUnit')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      setReports(data || []);
      setFilteredReports(data || []);
    } catch (err: any) {
      console.error("データ取得失敗:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        
        {/* ヘッダー & 検索セクション */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-1">
            <button 
              onClick={() => router.push('/dashboard')}
              className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 mb-4 text-xs font-bold uppercase tracking-widest transition-all"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
              ダッシュボードへ戻る
            </button>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight leading-none">
              報告データベース
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              合計 <span className="text-blue-600 font-bold">{filteredReports.length}</span> 件の不具合記録が見つかりました。
            </p>
          </div>

          {/* 検索ボックス */}
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text"
              placeholder="顧客名、モデル、件名で検索..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* メインテーブルカード */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="py-32 flex flex-col items-center">
              <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
              <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">データベースに接続中...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="py-32 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl mb-4">
                <Search size={32} />
              </div>
              <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">該当するデータが見つかりません</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">ユニット情報</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">不具合の詳細</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">所在地</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">アクション</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredReports.map((item) => (
                    <tr key={item.id} className="group hover:bg-blue-50/30 transition-all cursor-default">
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-slate-800 uppercase tracking-tight">{item.customer_name} 様</span>
                            <span className="text-[10px] bg-white border border-slate-200 text-slate-400 px-2 py-0.5 rounded-lg font-mono">#{item.id}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-blue-600 font-bold uppercase tracking-wider">
                            <Truck size={14} strokeWidth={2.5} /> {item.unit_name}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-sm font-bold text-slate-600 line-clamp-1 group-hover:text-blue-700 transition-colors">
                            {item.problem_title}
                          </span>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase">
                            <Calendar size={12} /> {item.date}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium italic">
                          <MapPin size={14} className="text-slate-300" /> 
                          <span className="line-clamp-1">{item.location}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <Link href={`/dashboard/detail/${item.id}`}>
                          <button className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 group-hover:text-blue-600 group-hover:border-blue-300 group-hover:shadow-lg group-hover:shadow-blue-200/50 transition-all active:scale-90">
                            <ChevronRight size={20} />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* フッター情報 */}
        <div className="mt-8 text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">
          Portal Tone Service Management System v1.0
        </div>
      </main>
    </div>
  );
}