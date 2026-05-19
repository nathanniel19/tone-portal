"use client";

import { useState } from 'react';
import { 
  AlertCircle, ClipboardList, FileText, Calendar, 
  User, Truck, MapPin, Tag, Info 
} from 'lucide-react';

export default function FormFields() {
  const [errors, setErrors] = useState<Record<string, boolean | undefined>>({});

  const today = new Date().toISOString().split('T')[0];

  const inputStyle = (name: string) => `
    bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 
    transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
    ${errors[name] ? 'border-red-500 ring-4 ring-red-500/10' : ''}
  `;

  const labelStyle = "text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1 mb-1 flex items-center gap-2";

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* SECTION 1: 基本情報 (Informasi Dasar) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col">
          <label className={labelStyle}>
            <Calendar size={14} className="text-blue-500" /> 報告日 <span className="text-red-500">*</span>
          </label>
          <input 
            type="date" 
            name="date" 
            defaultValue={today} 
            required 
            className={inputStyle("date")}
          />
        </div>

        <div className="flex flex-col md:col-span-2">
          <label className={labelStyle}>
            <User size={14} className="text-blue-500" /> 顧客名 <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            name="customer" 
            placeholder="顧客の氏名を入力してください" 
            required 
            className={inputStyle("customer")}
          />
        </div>

        <div className="flex flex-col md:col-span-1">
          <label className={labelStyle}>
            <Truck size={14} className="text-blue-500" /> 車両モデル <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            name="unit" 
            placeholder="例: CMX" 
            required 
            className={inputStyle("unit")}
          />
        </div>

        <div className="flex flex-col md:col-span-2">
          <label className={labelStyle}>
            <MapPin size={14} className="text-blue-500" /> 現場住所 / 所在地 <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            name="location" 
            placeholder="ユニットの所在地を入力してください" 
            required 
            className={inputStyle("location")}
          />
        </div>

        <div className="flex flex-col md:col-span-3">
          <label className={labelStyle}>
            <Tag size={14} className="text-blue-500" /> 不具合の件名 <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            name="title" 
            placeholder="問題の概要（例：油漏れ）" 
            required 
            className={inputStyle("title")}
          />
        </div>
      </div>

      {/* SECTION 2: 詳細分析 (Analisis Detail) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
        <div className="flex flex-col gap-1.5">
          <label className={labelStyle}>
            <AlertCircle size={14} className="text-orange-500" /> 顧客の指摘事項 (クレーム)
          </label>
          <textarea 
            name="complains"
            rows={4} 
            className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none" 
            placeholder="ユーザーからの指摘内容を入力してください"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelStyle}>
            <ClipboardList size={14} className="text-orange-500" /> 技術的症状
          </label>
          <textarea 
            name="symptoms"
            rows={4} 
            className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none" 
            placeholder="確認された技術的な症状（エラーコード、異音など）"
          />
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className={labelStyle}>
            <FileText size={14} className="text-green-500" /> 実施した処置の詳細
          </label>
          <textarea 
            name="actions"
            rows={5} 
            className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none" 
            placeholder="実施した修理や点検の工程を時系列で説明してください..."
          />
        </div>

        {/* --- KOLOM REMARKS (Baru) --- */}
        <div className="flex flex-col gap-1.5 md:col-span-2 pt-4">
          <label className={labelStyle}>
            <Info size={14} className="text-slate-500" /> 備考
          </label>
          <textarea 
            name="remarks"
            rows={3} 
            className="bg-slate-100/50 border border-slate-200 rounded-xl p-4 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none italic" 
            placeholder="その他の補足情報や次回の推奨事項などがあれば入力してください"
          />
        </div>
      </div>
    </div>
  );
}