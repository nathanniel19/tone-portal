"use client";

import { useState, ChangeEvent, useEffect } from 'react';
import { Camera, X, Plus, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface PhotoEntry {
  id: number;
  previewUrl: string | null;
  storageUrl: string | null;
  description: string;
  isUploading: boolean;
}

interface PhotoUploadProps {
  onUploadSuccess: (data: { url: string; description: string }[]) => void; 
  isError?: boolean;
}

export default function PhotoUpload({ onUploadSuccess, isError }: PhotoUploadProps) {
  const [photos, setPhotos] = useState<PhotoEntry[]>([]);

  useEffect(() => {
    const uploadData = photos
      .filter(p => p.storageUrl !== null)
      .map(p => ({
        url: p.storageUrl as string,
        description: p.description
      }));
    
    onUploadSuccess(uploadData);
  }, [photos]);

  const addPhotoField = () => {
    setPhotos([...photos, { 
      id: Date.now(), 
      previewUrl: null, 
      storageUrl: null, 
      description: '', 
      isUploading: false 
    }]);
  };

  const removePhotoField = (id: number) => {
    setPhotos(photos.filter(p => p.id !== id));
  };

  const handleDescriptionChange = (id: number, text: string) => {
    setPhotos(prev => prev.map(p => 
      p.id === id ? { ...p, description: text } : p
    ));
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>, id: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, previewUrl: localUrl, isUploading: true } : p));

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `problem-units/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('problem-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('problem-photos')
        .getPublicUrl(filePath);

      setPhotos(prev => prev.map(p => 
        p.id === id ? { ...p, storageUrl: data.publicUrl, isUploading: false } : p
      ));

    } catch (error: any) {
      alert("アップロードに失敗しました: " + error.message);
      setPhotos(prev => prev.map(p => p.id === id ? { ...p, isUploading: false } : p));
    }
  };

  return (
    <div className={`mt-10 border-t pt-8 transition-colors ${isError ? 'border-red-200' : 'border-slate-100'}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-bold flex items-center gap-2 ${isError ? 'text-red-600' : 'text-slate-800'}`}>
          <Camera size={22} className={isError ? 'text-red-500' : 'text-blue-600'} /> 
          エビデンス写真 <span className="text-red-500">*</span>
        </h3>
        <button 
          type="button"
          onClick={addPhotoField}
          className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg transition-all border ${
            isError ? 'bg-red-50 text-red-600 border-red-200 shadow-sm' : 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100'
          }`}
        >
          <Plus size={18} /> 写真を追加
        </button>
      </div>

      {isError && photos.filter(p => p.storageUrl).length === 0 && (
        <div className="mb-4 flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-bold animate-bounce">
          <AlertCircle size={20} />
          報告を保存するには、少なくとも1枚の写真をアップロードする必要があります。
        </div>
      )}

      {photos.length === 0 ? (
        <div 
          onClick={addPhotoField} 
          className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all group ${
            isError ? 'border-red-300 bg-red-50/50' : 'border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300'
          }`}
        >
          <Camera size={48} className={`${isError ? 'text-red-400' : 'text-slate-300 group-hover:text-blue-500'} mb-3 transition-colors`} />
          <p className={`${isError ? 'text-red-600 font-bold' : 'text-slate-500'} font-medium`}>
            クリックしてエビデンス写真を追加してください（必須）
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="flex flex-col md:flex-row gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-full md:w-56 h-36 bg-slate-200 rounded-lg flex flex-col items-center justify-center border border-slate-300 relative overflow-hidden group">
                {photo.previewUrl ? (
                  <div className="relative w-full h-full">
                    <img src={photo.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    {photo.isUploading && (
                      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
                        <Loader2 className="animate-spin mb-2" size={24} />
                        <span className="text-[10px] font-bold uppercase">アップロード中...</span>
                      </div>
                    )}
                    {photo.storageUrl && !photo.isUploading && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1 shadow-lg">
                        <CheckCircle size={14} />
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Camera size={28} className="text-slate-500 mb-1" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase">画像を選択</span>
                  </>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleFileChange(e, photo.id)} 
                  className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                  disabled={photo.isUploading}
                />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">写真の説明</label>
                <textarea 
                  placeholder="写真の詳細を説明してください（例：故障箇所、エラーコードなど）..." 
                  value={photo.description}
                  onChange={(e) => handleDescriptionChange(photo.id, e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none" 
                />
              </div>
              <button 
                type="button" 
                onClick={() => removePhotoField(photo.id)} 
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all self-start"
              >
                <X size={22} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}