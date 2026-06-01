"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { ArrowLeft, FileText, Download, Search as SearchIcon, ExternalLink } from 'lucide-react';

// Data dummy (nanti diganti fetch dari Supabase)
const DUMMY_MANUALS = [
  { id: 1, code: "PM-V2026", name: "エンジンパーツマニュアル V2", category: "エンジン", version: "2026" },
  { id: 2, code: "PM-H4012", name: "油圧システムパーツマニュアル", category: "油圧", version: "2025" },
  { id: 3, code: "PM-E9001", name: "電気配線パーツリスト", category: "電装", version: "2026" },
];

export default function ManualSearchPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = DUMMY_MANUALS.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800">
      <Navbar />

      <main className="max-w-6xl mx-auto p-6 md:p-10">
        {/* 上 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-xs uppercase mb-4 transition-colors"
            >
              <ArrowLeft size={16} /> ダッシュボードへ戻る
            </button>
            <h1 className="text-3xl font-black text-slate-900 uppercase">
              パーツマニュアル <span className="text-blue-600">検索</span>
            </h1>
          </div>

          {/* 検索 */}
          <div className="relative max-w-md w-full">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="マニュアル名またはコードで検索..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 表 */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">資料コード</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">マニュアル名称</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">カテゴリー</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="p-6">
                        <span className="font-mono text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-600">
                          {item.code}
                        </span>
                      </td>
                      <td className="p-6 font-bold text-slate-800 text-sm">
                        <div className="flex items-center gap-3">
                          <FileText size={18} className="text-blue-500" />
                          {item.name}
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="text-[10px] font-black uppercase text-slate-400 border border-slate-200 px-2.5 py-1 rounded-md bg-white">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-6 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button className="p-2 hover:bg-blue-600 hover:text-white rounded-lg transition-all text-slate-400" title="閲覧">
                            <ExternalLink size={18} />
                          </button>
                          <button className="p-2 hover:bg-slate-900 hover:text-white rounded-lg transition-all text-slate-400" title="ダウンロード">
                            <Download size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-20 text-center text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <SearchIcon size={40} className="opacity-20" />
                        <p className="text-sm font-bold italic">該当する資料が見つかりませんでした。</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 下 */}
        <p className="mt-6 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">
          検索結果: 全 {filteredData.length} 件
        </p>
      </main>
    </div>
  );
}