"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Admin check logic
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('isLoggedIn', 'true')
      router.push('/dashboard')
    } else {
      alert('ユーザー名またはパスワードが正しくありません。')
    }
  }

  return (
    // Background 
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
              placeholder="ユーザー名を入力" 
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-100 mb-1 ml-1">パスワード</label>
            <input 
              type="password" 
              required
              placeholder="••••••••" 
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-900/20 transform transition active:scale-95 duration-200">
            サインイン
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-blue-300/60 uppercase tracking-widest">
            Portal Tone Service Management System
          </p>
        </div>
      </div>
    </div>
  )
}