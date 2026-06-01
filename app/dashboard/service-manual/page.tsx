"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { 
  ArrowLeft, 
  BookOpen, 
  Download, 
  Search as SearchIcon, 
  Eye, 
  FileCheck,
  Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ServiceManualPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Data Dummy (Bahasa judul tetap teknis, kategori diubah)
  const SERVICE_DATA = [
    { id: 1, model: "ZX-200", title: "整備標準マニュアル", lang: "JP/EN", size: "12.5 MB" },
    { id: 2, model: "ZX-210", title: "故障診断ガイド Vol. 1", lang: "EN", size: "8.2 MB" },
    { id: 3, model: "ZX-350", title: "エンジンオーバーホールサービスマニュアル", lang: "JP", size: "25.1 MB" },
    { id: 4, model: "ZX-130", title: "油圧回路図", lang: "EN", size: "5.7 MB" },
  ];

  const filteredData = SERVICE_DATA.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800">
      <Navbar />

      <main className="max-w-6xl mx-auto p-6 md:p-10">
        {/* 上 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="text-left">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-4 transition-all"
            >
              <ArrowLeft size={14} /> ダッシュボードへ戻る
            </button>
            <h1 className="text-4xl font-black text-slate-900 leading-none uppercase">
              サービス <span className="text-blue-500">マニュアル</span>
            </h1>
            <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest">技術ワークショップ資料</p>
          </div>

          {/* 検索 */}
          <div className="relative max-w-md w-full group">
            <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="モデル名または資料名で検索..."
                className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-bold text-sm shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 表 */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden">
          <div className="overflow-x-auto text-left">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">対象モデル</th>
                  <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">資料名称</th>
                  <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">対応言語</th>
                  <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-left">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/20 transition-all group">
                      <td className="p-8 text-left">
                        <span className="font-mono text-xs font-black bg-blue-50 text-blue-600 px-4 py-2 rounded-xl border border-blue-100">
                          {item.model}
                        </span>
                      </td>
                      <td className="p-8 text-left">
                        <div className="flex items-center gap-4 text-left">
                          <div className="p-2 bg-slate-100 rounded-lg text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <BookOpen size={18} />
                          </div>
                          <div>
                            <p className="font-black text-slate-800 text-sm uppercase leading-tight">{item.title}</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">サイズ: {item.size}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-8 text-left">
                        <div className="flex items-center gap-2">
                          <FileCheck size={14} className="text-green-500" />
                          <span className="text-[10px] font-black text-slate-500 uppercase">{item.lang}</span>
                        </div>
                      </td>
                      <td className="p-8">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            className="flex items-center gap-2 bg-slate-900 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black transition-all active:scale-95 shadow-lg shadow-slate-200"
                          >
                            <Eye size={14} /> 閲覧
                          </button>
                          <button 
                            className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 rounded-xl transition-all"
                            title="PDFダウンロード"
                          >
                            <Download size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-6 bg-slate-50 rounded-full">
                          <SearchIcon size={40} className="text-slate-200" />
                        </div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">該当するマニュアルが見つかりません</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 下 */}
        <div className="mt-10 flex items-center justify-between px-4">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">
            利根ポータル • サービスドキュメントシステム
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase">データベース接続完了</span>
          </div>
        </div>
      </main>
    </div>
  );
}