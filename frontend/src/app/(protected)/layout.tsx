'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'
import Sidebar from '@/component/ui/Sidebar'
import { useRouter } from 'next/navigation'
import authApi from '@/services/auth-api'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const handleLogout = async () => {
    try {
      await authApi.post('/auth/logout');
      router.push('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div
        className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${
          sidebarOpen ? 'ml-0' : '' // For mobile: no margin if sidebar is closed
        }`}
      >
        {/* Header */}
        <header className="flex justify-between items-center bg-white dark:bg-gray-800 p-3 shadow-md md:pl-64">
          <div className="flex items-center space-x-4">
            {/* Mobile menu toggle */}
            <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="px-3 py-2 border rounded cursor-pointer"
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer"
              onClick={handleLogout} // Trigger logout on click
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main
          className={`flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-950 transition-all duration-300 ${
            sidebarOpen ? 'ml-0' : 'md:ml-64' // For desktop: margin-left when sidebar is open
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
