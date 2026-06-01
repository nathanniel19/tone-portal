"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useReactToPrint } from 'react-to-print';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import { 
  ArrowLeft, Calendar, User, MapPin, Truck, 
  AlertCircle, ClipboardList, FileText, Loader2,
  Trash2, Edit3, Save, X, ImageIcon, Printer, 
  AlertTriangle, CheckCircle2, Info 
} from 'lucide-react';
import { text } from 'stream/consumers';
import { on } from 'events';

export default function DetailProblemPage() {
  const params = useParams();
  const router = useRouter();
  const componentRef = useRef<HTMLDivElement>(null); 
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePrint = useReactToPrint({
    // @ts-ignore
    contentRef: componentRef, 
    documentTitle: `サービスレポート_${data?.id || 'ユニット'}`,
  });

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: report, error } = await supabase
        .from('ProblemUnit')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setData(report);
      setEditData(report); 
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('ProblemUnit')
        .update({
          problem_title: editData.problem_title,
          customer_name: editData.customer_name,
          unit_name: editData.unit_name,
          location: editData.location,
          complains: editData.complains,
          symptoms: editData.symptoms,
          actions: editData.actions,
          remarks: editData.remarks
        })
        .eq('id', params.id);

      if (error) throw error;
      
      setShowSaveModal(false);
      setIsEditing(false);
      await fetchData(); 
      setShowSuccessModal(true); 
    } catch (err: any) {
      alert("更新に失敗しました: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      if (data?.image_url && Array.isArray(data.image_url)) {
        const pathsToDelete = data.image_url.map((item: any) => {
          const url = item.url || item;
          const parts = url.split('/problem-photos/'); 
          return parts[1]; 
        });
        await supabase.storage.from('problem-photos').remove(pathsToDelete);
      }
      const { error: dbError } = await supabase.from('ProblemUnit').delete().eq('id', params.id);
      if (dbError) throw dbError;
      setShowDeleteModal(false);
      router.push('/dashboard');
    } catch (err: any) {
      alert("削除に失敗しました: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800">
      <div className="print:hidden">
        <Navbar />
      </div>

      <style jsx global>{`
        @media print {
          @page { 
            size: A4; 
            margin: 15mm; /* Memberi ruang agar tidak mepet ke pinggir kertas */
          }
          body { 
            background-color: white !important; 
            -webkit-print-color-adjust: exact; 
          }
          .print-area { 
            box-shadow: none !important; 
            border: none !important; 
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          /* Mencegah elemen terpotong di tengah (seperti di foto kamu) */
          section, .break-inside-avoid {
            break-inside: avoid;
            page-break-inside: avoid;
            margin-bottom: 10mm;
          }
          /* Memastikan gambar tidak terpotong */
          img, .photo-item {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>

      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4 print:hidden">
          <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold text-xs uppercase">
            <ArrowLeft size={16} /> 戻る
          </button>

          <div className="flex gap-2">

            {!isEditing ? (
              <>
                <button onClick={() => handlePrint()} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black hover:bg-black transition-all shadow-md uppercase">
                  <Printer size={14} /> PDF出力
                </button>
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-[10px] font-black hover:bg-slate-50 uppercase">
                  <Edit3 size={14} /> 編集
                </button>
                <button onClick={() => setShowDeleteModal(true)} className="flex items-center gap-2 bg-white border border-red-100 text-red-500 px-4 py-2 rounded-xl text-[10px] font-black hover:bg-red-50 uppercase">
                  <Trash2 size={14} /> 削除
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setShowCancelModal(true)} className="flex items-center gap-2 bg-white border border-red-100 text-red-500 px-4 py-2 rounded-xl text-[10px] font-black hover:bg-red-50 uppercase">
                  <ArrowLeft size={14} /> 取り消す
                </button>
                <button onClick={() => setShowSaveModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black hover:bg-blue-700 uppercase">
                  <Save size={14} /> 変更を保存
                </button>
              </>

            )}
          </div>
        </div>

        <div ref={componentRef} className="print-area bg-white shadow-xl border border-slate-200 overflow-hidden md:rounded-[2rem]">
          {/* 上 */}
          <div className="hidden print:flex items-center justify-between p-10 border-b-4 border-blue-600 mb-6 bg-slate-50/30">
            <div className="text-left">
              <h1 className="text-2xl font-black text-blue-600 leading-none">サービスレポート</h1>
              <p className="text-[9px] font-bold text-slate-500 mt-2 tracking-[0.3em] uppercase">公式技術ドキュメント</p>
            </div>
            <div className="text-right">
              <p className="text-[8px] font-black text-slate-400 uppercase">レポート参照番号</p>
              <p className="text-sm font-mono font-bold text-slate-800">MSR-#{data?.id}</p>
            </div>
          </div>

          <div className="p-8 md:p-10 bg-slate-50/30 print:bg-white border-b border-slate-100 text-left">
            <div className="text-[10px] font-mono font-bold bg-white border border-slate-200 px-3 py-1 rounded-md text-slate-500 mb-4 inline-block font-bold">
              報告日: {data?.date}
            </div>
            {isEditing ? (
              <input 
                className="w-full text-2xl font-black text-slate-900 border-b-2 border-blue-500 bg-transparent py-2 uppercase outline-none"
                value={editData.problem_title || ""} 
                onChange={(e) => setEditData({...editData, problem_title: e.target.value})}
              />
            ) : (
              <h1 className="text-3xl font-black text-slate-900 leading-tight uppercase">{data?.problem_title}</h1>
            )}
          </div>

          {/* 基本情報 */}
          <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 bg-white">
            {[
              { label: "顧客名", key: "customer_name", icon: <User size={16} /> },
              { label: "車両モデル", key: "unit_name", icon: <Truck size={16} /> },
              { label: "所在地", key: "location", icon: <MapPin size={16} /> }
            ].map((field) => (
              <div key={field.key} className="p-6 text-left">
                {isEditing ? (
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-black text-slate-800 uppercase">
                      <span className="text-blue-500">{field.icon}</span>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{field.label}</p>
                    </div>
                    <textarea
                    className="w-full bg-slate-50 mt-2 border border-slate-100 rounded-l p-3 text-sm outline-none focus:border-blue-500 transition-all"
                    rows={field.key === "remarks" ? 3 : 6}
                    value={editData[field.key] || ""}
                    onChange={(e) => setEditData({...editData, [field.key]: e.target.value})}
                    />
                  </div>
                  
                ) : (
                  <div className="p-6 text-left">
                    <p className="text-[8px] font-bold text-slate-400 uppercase mb-2 tracking-widest">{field.label}</p>
                    <div className="flex items-center gap-2 text-[11px] font-black text-slate-800 uppercase">
                      <span className="text-blue-500">{field.icon}</span> {data?.[field.key]}
                    </div>
                  </div>
                )
                }
             
              </div>
            ))}
          </div>

          {/* 情報 */}
          <div className="p-8 md:p-10 space-y-8 bg-white">
            {[
              { label: "顧客の指摘事項 (クレーム)", key: "complains", icon: <AlertCircle size={16} className="text-orange-500" /> },
              { label: "技術的症状", key: "symptoms", icon: <ClipboardList size={16} className="text-orange-500" /> },
              { label: "実施した処置の詳細", key: "actions", icon: <FileText size={16} className="text-green-500" /> },
              { label: "備考", key: "remarks", icon: <Info size={16} className="text-slate-500" /> }
            ].map((section) => (
              <section key={section.key} className="text-left break-inside-avoid">
                <h3 className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-widest mb-3">
                  {section.icon} {section.label}
                </h3>
                {isEditing ? (
                  <textarea 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-blue-500 transition-all whitespace-pre-wrap"
                    rows={section.key === 'remarks' ? 3 : 6}
                    value={editData[section.key] || ""} 
                    onChange={(e) => setEditData({...editData, [section.key]: e.target.value})}
                  />
                ) : (
                  <div className={`p-5 rounded-xl border text-[11px] leading-relaxed shadow-sm text-left whitespace-pre-wrap ${
                    section.key === 'actions' ? 'bg-blue-50/20 border-blue-100 text-slate-700 font-medium' : 
                    section.key === 'remarks' ? 'bg-slate-100/50 border-slate-100 text-slate-500 italic' :
                    'bg-slate-50/50 border-slate-100 text-slate-600 italic'
                  }`}>
                    {data?.[section.key] || "記録なし"}
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* 写真 */}
          {!isEditing && data?.image_url && (
            <div className="p-8 md:p-10 bg-white border-t border-slate-50 text-left break-inside-avoid">
              <p className="text-[9px] font-black text-slate-400 uppercase mb-6 tracking-widest flex items-center gap-2">
                <ImageIcon size={14} className="text-blue-500" /> エビデンス写真・ドキュメント
              </p>
              <div className="grid grid-cols-2 gap-6">
                {Array.isArray(data.image_url) && data.image_url.map((item: any, index: number) => (
                  <div key={index} className="flex flex-col gap-2 photo-item">
                    <div onClick={() => setSelectedImage(item.url || item)} className="relative aspect-video rounded-xl overflow-hidden border border-slate-100 shadow-sm cursor-zoom-in">
                      <div className="absolute top-2 right-2 z-10 bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold shadow-md">{index + 1}</div>
                      <img src={item.url || item} className="w-full h-full object-cover" alt="Documentation" />
                    </div>
                    {item.description && (
                      <div className="bg-slate-50 py-2.5 px-3 rounded-lg border border-slate-100 text-center font-bold">
                        <p className="text-[10px] text-slate-500 italic leading-relaxed whitespace-pre-wrap">"{item.description}"</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* サイン */}
          <div className="hidden print:grid grid-cols-2 gap-12 p-10 md:p-12 bg-white mt-10 border-t border-slate-100 break-inside-avoid">
            <div className="text-center">
              <p className="text-[9px] font-bold text-slate-400 uppercase mb-16 tracking-[0.2em]">お客様承認</p>
              <div className="w-full h-px bg-slate-200 mb-2"></div>
              <p className="text-[10px] font-black text-slate-800 uppercase">署名・捺印</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] font-bold text-slate-400 uppercase mb-16 tracking-[0.2em]">サービス担当者</p>
              <div className="w-full h-px bg-slate-200 mb-2"></div>
              <p className="text-[10px] font-black text-slate-800 uppercase">サービス部門責任者</p>
            </div>
          </div>
        </div>
      </div>

      {/* ポップアップ */}
      {selectedImage && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300" onClick={() => setSelectedImage(null)}>
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"></div>
          <div className="relative z-10 max-w-5xl w-full flex flex-col items-center animate-in zoom-in-95 duration-300">
            <button className="absolute -top-14 right-0 bg-white/10 hover:bg-red-500 text-white p-3 rounded-full border border-white/20 active:scale-90 shadow-xl transition-all" onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}>
              <X size={20} />
            </button>
            <div className="bg-slate-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img src={selectedImage} className="max-w-full max-h-[75vh] w-auto h-auto object-contain" alt="Zoom" />
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 text-center">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in" onClick={() => !isSubmitting && setShowDeleteModal(false)}></div>
          <div className="relative bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6 mx-auto"><Trash2 size={32} /></div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">レポートを削除しますか？</h3>
            <p className="text-slate-500 text-sm mb-8">データベースおよびストレージ内のファイルが永久に削除されます。</p>
            <div className="grid grid-cols-2 gap-4">
              <button disabled={isSubmitting} onClick={() => setShowDeleteModal(false)} className="px-6 py-2.5 rounded-xl font-bold text-slate-400 bg-slate-100 hover:bg-slate-200">キャンセル</button>
              <button disabled={isSubmitting} onClick={handleDelete} className="px-6 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg">{isSubmitting ? <Loader2 className="animate-spin mx-auto" size={18} /> : "削除する"}</button>
            </div>
          </div>
        </div>
      )}

      {showCancelModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 text-center">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in" ></div>
          <div className="relative bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6 mx-auto"><AlertTriangle size={32} /></div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">変更を取り消しますか？</h3>
            <p className="text-slate-500 text-sm mb-8">変更した内容が取り消されます。</p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setShowCancelModal(false)} className="px-6 py-2.5 rounded-xl font-bold text-slate-400 bg-slate-100 hover:bg-slate-200">キャンセル</button>
              <button onClick={() => {setShowCancelModal(false); setIsEditing(false);}} className="px-6 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg">{isSubmitting ? <Loader2 className="animate-spin mx-auto" size={18} /> : "取り消す"}</button>
            </div>
          </div>
        </div>
      )}

      {showSaveModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 text-center">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in" onClick={() => !isSubmitting && setShowSaveModal(false)}></div>
          <div className="relative bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto"><AlertTriangle size={32} /></div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">変更を保存しますか？</h3>
            <p className="text-slate-500 text-sm mb-8 text-center">データベースのレポート内容が更新されます。</p>
            <div className="grid grid-cols-2 gap-4">
              <button disabled={isSubmitting} onClick={() => setShowSaveModal(false)} className="px-6 py-2.5 rounded-xl font-bold text-slate-400 bg-slate-100 hover:bg-slate-200 text-center">キャンセル</button>
              <button disabled={isSubmitting} onClick={handleUpdate} className="px-6 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg">{isSubmitting ? <Loader2 className="animate-spin mx-auto" size={18} /> : "保存する"}</button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 text-center">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm animate-in fade-in" onClick={() => setShowSuccessModal(false)}></div>
          <div className="relative bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 mx-auto">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 mx-auto font-bold"><CheckCircle2 size={32} /></div>
            <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase text-center">保存完了！</h3>
            <p className="text-slate-500 text-sm mb-8 text-center">最新のレポートが正常にシステムへ更新されました。</p>
            <button onClick={() => setShowSuccessModal(false)} className="w-full px-6 py-4 rounded-2xl font-black text-xs text-white bg-green-600 hover:bg-green-700 shadow-lg uppercase tracking-widest text-center">OK</button>
          </div>
        </div>
      )}
    </div>
  );
}