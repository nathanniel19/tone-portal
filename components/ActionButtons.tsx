"use client";

import { useRouter } from 'next/navigation';
import { Search, BookOpen } from 'lucide-react';

export default function ActionButtons() {
  const router = useRouter();

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/60 border border-slate-100 flex flex-wrap gap-4">
      <button 
        onClick={() => router.push('/dashboard/parts-manual')}
        className="flex-1 flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-blue-200 active:scale-95"
      >
        <Search size={20} />
        パーツマニュアル検索
      </button>
      <button 
        onClick={() => router.push('/dashboard/service-manual')}
        className="flex-1 flex items-center justify-center gap-3 bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-blue-100 active:scale-95"
      >
        <BookOpen size={20} />
        サービスマニュアル検索
      </button>
    </div>
  );
}