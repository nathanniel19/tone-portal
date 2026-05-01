"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* --- MENU ATAS (NAVBAR) --- */}
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex space-x-8">
              <span className="font-bold text-blue-600 text-xl">PortalTone</span>
              
              
            </div>

            <button 
              onClick={handleLogout}
              className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* --- KONTEN HALAMAN --- */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  )
}