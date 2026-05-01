"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (isLoggedIn) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [router])

  return <div className="bg-gray-900 h-screen text-white p-10">Loading...</div>
}