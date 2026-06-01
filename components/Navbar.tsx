"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Home, AlertTriangle, X } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const confirmLogout = () => {
    setShowModal(false);
    router.push('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between 
        bg-gradient-to-r from-[#0a1931] via-[#10223e] to-[#0a1931] 
        px-8 py-4 text-white shadow-2xl border-b border-blue-500/20 backdrop-blur-md">
        
        {/* 左側 */}
        <div 
          className="flex items-center gap-3 group cursor-pointer" 
          onClick={() => router.push('/dashboard')}
        >
          <div className="bg-blue-500/20 p-2 rounded-lg group-hover:bg-blue-500/30 transition-all border border-blue-400/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
            <Home size={24} className="text-blue-400" />
          </div>
          <h1 className="text-xl font-bold tracking-[0.15em] uppercase bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
            Tone Portal
          </h1>
        </div>

        {/* 右側 */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setShowModal(true)}
            className="group relative flex items-center gap-3 overflow-hidden rounded-md 
              bg-gradient-to-r from-red-600 to-rose-700 px-5 py-2 text-sm font-bold uppercase tracking-wider 
              transition-all hover:from-red-500 hover:to-rose-600 active:scale-95 
              shadow-[0_0_20px_rgba(225,29,72,0.2)] border border-red-500/30 text-white"
          >
            <span className="absolute inset-0 w-full h-full bg-white/20 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
            <LogOut size={18} className="transition-transform group-hover:-translate-x-1" />
            <span className="relative">ログアウト</span>
          </button>
        </div>
      </header>

      {/* ログアウト　*/}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay Gelap */}
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowModal(false)}
          ></div>
          
          {/* Box Modal */}
          <div className="relative bg-[#0f172a] border border-slate-700 rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-inner border border-red-500/20">
                <AlertTriangle size={32} />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">ログアウトの確認</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                ログアウトしてもよろしいですか？<br/>
                ポータルにアクセスするには再度ログインが必要になります。
              </p>

              <div className="grid grid-cols-2 gap-4 w-full">
                <button 
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 rounded-xl font-bold text-slate-400 bg-slate-800 hover:bg-slate-700 hover:text-white transition-all"
                >
                  キャンセル
                </button>
                <button 
                  onClick={confirmLogout}
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-900/20 transition-all active:scale-95"
                >
                  ログアウト
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}