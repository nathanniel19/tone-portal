"use client"
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'

import { supabase } from "@/lib/supabase"
import { Loader2, AlertTriangle, CheckCircle2 } from "lucide-react"

export default function RegisterPage() {
    const [loading, setLoading] = useState(false)
    const [account, setAccount] = useState<string[]>([])
    const [newUsername, setNewUsername] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    
    // State baru untuk menampung error per field
    const [errors, setErrors] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    })

    const [showModal, setShowModal] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showErrorModal, setShowErrorModal] = useState(false)
    const router = useRouter()

    const fetchAccounts = async () => {
        try {
            const { data, error } = await supabase
                .from("UserAccount")
                .select("username")
            if (error) throw error;
            setAccount(data.map((item) => item.username) || [])
        } catch (error: any) {
            console.error('Fetch Error:', error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAccounts()
    }, [])

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()

        // Reset error terlebih dahulu setiap kali tombol ditekan
        const newErrors = { username: '', password: '', confirmPassword: '' }
        let hasError = false

        // Validasi field kosong
        if (!newUsername.trim()) {
            newErrors.username = 'ユーザー名を入力してください'
            hasError = true
        }
        if (!newPassword) {
            newErrors.password = 'パスワードを入力してください'
            hasError = true
        }
        if (!confirmPassword) {
            newErrors.confirmPassword = '確認用パスワードを入力してください'
            hasError = true
        }

        // Jika ada yang kosong, simpan error ke state dan hentikan proses
        if (hasError) {
            setErrors(newErrors)
            return
        }

        // Bersihkan error jika validasi kosong lolos
        setErrors({ username: '', password: '', confirmPassword: '' })

        if (account.includes(newUsername)) {
            setShowModal(true)
            return
        } else {
            if (newPassword !== confirmPassword) {
                setShowErrorModal(true)
                return
            }
            try {
                setLoading(true)
                const { error } = await supabase
                    .from("UserAccount")
                    .insert({ username: newUsername, password: newPassword, status: "user" })
                if (error) throw error
                setShowSuccessModal(true)

            } catch (error: any) {
                console.error('Register Error:', error.message)
                alert('ユーザー登録に失敗しました。もう一度お試しください。')
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 px-4">
            {loading ? (
                <div className="p-8 flex flex-col items-center justify-center min-h-[300px]">
                    <Loader2 className="animate-spin text-blue-500 mb-2" size={24} />
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">読み込み中...</p>
                </div>
            ) : (
                <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">ユーザー登録</h2>

                    {/* Form Register */}
                    <form className="space-y-5" onSubmit={handleRegister}>
                        <div>
                            <label className="block text-sm font-medium text-blue-100 mb-1 ml-1">ユーザー名</label>
                            <input 
                                type="text" 
                                disabled={loading}
                                placeholder="ユーザー名を入力" 
                                autoComplete="off"
                                className={`w-full p-3 rounded-xl bg-white/5 border text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all disabled:opacity-50 ${
                                    errors.username ? 'border-red-500 focus:ring-red-500' : 'border-white/10'
                                }`}
                                onChange={(e) => {
                                    setNewUsername(e.target.value)
                                    if(errors.username) setErrors(prev => ({...prev, username: ''}))
                                }}
                            />
                            {/* Peringatan Kecil */}
                            {errors.username && <p className="text-red-400 text-xs mt-1 ml-1 animate-pulse">{errors.username}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-blue-100 mb-1 ml-1">パスワード</label>
                            <input 
                                type="password" 
                                disabled={loading}
                                placeholder="••••••••" 
                                autoComplete="new-password"
                                className={`w-full p-3 rounded-xl bg-white/5 border text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all disabled:opacity-50 ${
                                    errors.password ? 'border-red-500 focus:ring-red-500' : 'border-white/10'
                                }`}
                                onChange={(e) => {
                                    setNewPassword(e.target.value)
                                    if(errors.password) setErrors(prev => ({...prev, password: ''}))
                                }}
                            />
                            {/* Peringatan Kecil */}
                            {errors.password && <p className="text-red-400 text-xs mt-1 ml-1 animate-pulse">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-blue-100 mb-1 ml-1">確認のため再度パスワードを入力</label>
                            <input 
                                type="password" 
                                disabled={loading}
                                placeholder="••••••••" 
                                autoComplete="new-password"
                                className={`w-full p-3 rounded-xl bg-white/5 border text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all disabled:opacity-50 ${
                                    errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-white/10'
                                }`}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value)
                                    if(errors.confirmPassword) setErrors(prev => ({...prev, confirmPassword: ''}))
                                }}
                            />
                            {/* Peringatan Kecil */}
                            {errors.confirmPassword && <p className="text-red-400 text-xs mt-1 ml-1 animate-pulse">{errors.confirmPassword}</p>}
                        </div>
                        

                        {/* Register Button */}
                        <button 
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-900/20 transform transition active:scale-95 duration-200 disabled:opacity-50 disabled:scale-100"
                        >
                            登録
                        </button>

                        {/* Back to Login */}
                        <button 
                            type="button"
                            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-slate-900/20 transform transition active:scale-95 duration-200 disabled:opacity-50 disabled:scale-100"
                            onClick={() => router.push('/login')}
                        >
                            ログインに戻る
                        </button>

                    </form>

                    {/* Success Modal */}
                    {showSuccessModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300"></div>
                        <div className="relative bg-[#0f172a] rounded-3xl p-10 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 text-center">
                            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-inner">
                                <CheckCircle2 size={40} />
                            </div>
                            <h3 className="text-2xl font-white text-slate-200 mb-2 uppercase">登録完了！</h3>
                            <p className="text-slate-200 text-sm mb-10 leading-relaxed">
                                ユーザー登録が成功しました。ログインページに移動します。
                            </p>
                            <button 
                            onClick={() => {
                                setShowSuccessModal(false);
                                router.push('/login');
                            }} 
                            className="w-full px-6 py-4 rounded-2xl font-black text-xs text-white bg-green-600 hover:bg-green-700 shadow-s shadow-green-200 transition-all active:scale-95 uppercase tracking-widest"
                            >
                            ダッシュボードへ戻る
                            </button>
                        </div>
                    </div>
                    )}

                    {/* Password Mismatch Modal */}
                    {showErrorModal && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300"></div>
                        <div className="relative bg-[#0f172a] rounded-3xl p-10 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 text-center">
                            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-inner">
                                <AlertTriangle size={40} />
                            </div>
                            <h3 className="text-2xl font-white text-slate-200 mb-2 uppercase">エラー</h3>
                            <p className="text-slate-200 text-sm mb-10 leading-relaxed">
                                パスワードが一致しません。もう一度入力してください。
                            </p>
                            <button
                            onClick={() => setShowErrorModal(false)}
                            className="w-full px-6 py-4 rounded-2xl font-black text-xs text-white bg-red-600 hover:bg-red-700 shadow-s shadow-red-200 transition-all active:scale-95 uppercase tracking-widest"
                            >
                            閉じる
                            </button>
                        </div>
                    </div>
                    )}


                    {/* Warning Modal */}
                    {showModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        {/* Overlay */}
                        <div 
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300"
                            onClick={() => setShowModal(false)}
                        ></div>

                        {/* Box Modal */}
                        <div className="relative bg-[#0f172a]  rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-red-600/10 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-inner border border-red-500/20">
                                    <AlertTriangle size={32} />
                                </div>
                            
                                <h3 className="text-xl font-bold text-white mb-2">エラー</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                                    ユーザー名は既に存在しています。別のユーザー名を選択してください。
                                </p>

                                <div className="gap-4 w-full">
                                    <button 
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2.5 rounded-xl font-bold text-slate-400 bg-slate-800 hover:bg-slate-700 hover:text-white transition-all"
                                    >
                                    再入力
                                    </button>
                                </div>
                            </div>
                        </div>

                        </div>
                    )}
                </div>
            )}
        </div>
  )
}