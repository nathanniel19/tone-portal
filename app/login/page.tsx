"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { AlertTriangle } from 'lucide-react'

interface UserAccount {
  username: string
  password: string
  status: string
}

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // Ditambah biar user tau lagi proses login
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 1. Ambil data user dari tabel 'users' berdasarkan username yang diinput
      const { data, error } = await supabase
        .from('UserAccount')
        .select('username, password, status')
        .eq('username', username)
        .maybeSingle() // Mengembalikan null jika user tidak ditemukan (tidak lgsg throw error)

      if (error) {
        throw error
      }

      // 2.Validation
      if (data && data.password === password) {
        // Login OK
        localStorage.setItem('isLoggedIn', 'true')

        if (data.status === 'admin') {
          router.push('/admin-dashboard')
        } else {
          router.push('/dashboard')
        }
      } else {
        // Failed Login (Username data is not available)
        setShowModal(true)
      }
    } catch (err) {
      console.error('Login error:', err)
      alert('もう一度やり直してください。') 
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 px-4">
      
      {/* Card Login */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-full bg-blue-500/20 mb-4">
            {/* Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">ログイン</h1>
          <p className="text-blue-200 mt-2">データベースにアクセスするにはログインしてください</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-1 ml-1">ユーザー名</label>
            <input 
              type="text" 
              required
              disabled={isLoading}
              placeholder="ユーザー名を入力" 
              autoComplete='new-username'
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all disabled:opacity-50"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-100 mb-1 ml-1">パスワード</label>
            <input 
              type="password" 
              required
              disabled={isLoading}
              autoComplete='new-password'
              placeholder="••••••••" 
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all disabled:opacity-50"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-900/20 transform transition active:scale-95 duration-200 disabled:opacity-50 disabled:scale-100"
          >
            {isLoading ? 'サインイン中...' : 'サインイン'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-blue-300/60 uppercase tracking-widest">アカウントをお持ちでない場合は</p>
          <a href="#" className="text-blue-400 font-bold text-sm hover:underline" onClick={(e) => router.push('/register')}>
            登録
          </a>
        </div>
      </div>

      {/* Error modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowModal(false)}
          ></div>
          
          {/* Box Modal */}
          <div className="relative bg-[#0f172a] border border-slate-700 rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-600/10 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-inner border border-red-500/20">
                <AlertTriangle size={32} />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">エラー</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                ユーザー名またはパスワードが正しくありません。
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
  )
}