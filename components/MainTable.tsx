import { Wrench, ChevronRight } from 'lucide-react';

export default function MainTable() {
  return (
    <section className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center gap-2 text-slate-800 font-bold text-lg bg-slate-50/30">
        <Wrench size={20} className="text-blue-600" />
        担当ユニット一覧
      </div>
      
      {/* Area Tabel */}
      <div className="p-12 flex flex-col items-center justify-center bg-slate-50/50 min-h-[400px]">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
           <ChevronRight size={32} className="text-slate-300" />
        </div>
        <span className="text-xl font-bold text-slate-300 uppercase tracking-[0.2em]">ユニットデータ一覧</span>
      </div>
    </section>
  );
}