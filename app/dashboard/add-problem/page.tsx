"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, CheckCircle2, Loader2, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import FormFields from '@/components/FormFields';
import PhotoUpload from '@/components/PhotoUpload';
import { supabase } from '@/lib/supabase';

export default function AddProblemPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  
  const [uploadedPhotos, setUploadedPhotos] = useState<{ url: string; description: string }[]>([]);
  const [formError, setFormError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // 保存確認モーダル
  const [showSuccessModal, setShowSuccessModal] = useState(false); // 完了モーダル
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. バリデーション
  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(false);

    if (uploadedPhotos.length === 0) {
      setFormError(true);
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      return;
    }

    setIsModalOpen(true);
  };

  // 2. Supabaseへの保存実行
  const handleFinalSubmit = async () => {
    if (!formRef.current) return;
    
    setIsModalOpen(false);
    setIsSubmitting(true);

    const formData = new FormData(formRef.current);
    
    try {
      const { error } = await supabase
        .from('ProblemUnit')
        .insert([
          {
            date: formData.get('date'),
            customer_name: formData.get('customer'),
            unit_name: formData.get('unit'),
            location: formData.get('location'),
            problem_title: formData.get('title'),
            complains: formData.get('complains'),
            symptoms: formData.get('symptoms'),
            actions: formData.get('actions'),
            remarks: formData.get('remarks'), 
            image_url: uploadedPhotos, 
          }
        ]);

      if (error) throw error;

      // 成功モーダルを表示
      setShowSuccessModal(true);
      
    } catch (error: any) {
      console.error("保存失敗:", error.message);
      alert("❌ エラー: " + error.message); 
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] text-slate-800 pb-12 relative">
      <Navbar />

      <main className="mx-auto max-w-6xl p-6 mt-8 text-left">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              type="button"
              onClick={() => router.back()} 
              className="p-2 rounded-full bg-white hover:bg-blue-50 border border-slate-200 shadow-sm transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-2xl font-extrabold text-slate-900 uppercase tracking-tight">不具合報告の追加</h2>
          </div>
        </div>

        <form 
          ref={formRef}
          onSubmit={handlePreSubmit} 
          className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/50"
        >
          <FormFields />
          
          <PhotoUpload 
            onUploadSuccess={(data) => {
              setUploadedPhotos(data);
              setFormError(false);
            }} 
            isError={formError} 
          />

          <div className="flex justify-end gap-4 mt-12 border-t border-slate-100 pt-8">
            <button 
              type="button" 
              onClick={() => router.back()} 
              className="px-8 py-2.5 rounded-xl font-bold text-xs text-slate-500 hover:bg-slate-100 uppercase tracking-widest"
            >
              キャンセル
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-10 py-2.5 rounded-xl font-bold text-xs text-white shadow-lg shadow-blue-200 active:scale-95 transition-all disabled:opacity-50 uppercase tracking-widest"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {isSubmitting ? "保存中..." : "報告を保存する"}
            </button>
          </div>
        </form>
      </main>

      {/* --- モーダル 1: 保存確認 --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"></div>
          <div className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">保存の確認</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                入力内容に間違いはありませんか？<br/> 
                <span className="font-bold text-blue-600">この報告はシステム上のデータベースに直接登録されます。</span>
              </p>
              <div className="grid grid-cols-2 gap-4 w-full">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl font-bold text-sm text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  再確認する
                </button>
                <button 
                  type="button"
                  onClick={handleFinalSubmit}
                  className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-lg transition-all active:scale-95"
                >
                  はい、保存します
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- モーダル 2: 成功 --- */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"></div>
          <div className="relative bg-white rounded-3xl p-10 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-inner">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase">保存完了！</h3>
            <p className="text-slate-500 text-sm mb-10 leading-relaxed">
              報告が正常にシステムへ登録されました。お疲れ様でした。
            </p>
            <button 
              onClick={() => {
                setShowSuccessModal(false);
                router.push('/dashboard');
              }} 
              className="w-full px-6 py-4 rounded-2xl font-black text-xs text-white bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200 transition-all active:scale-95 uppercase tracking-widest"
            >
              ダッシュボードへ戻る
            </button>
          </div>
        </div>
      )}
    </div>
  );
}