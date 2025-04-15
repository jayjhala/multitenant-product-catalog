'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown, ChevronRight, LayoutDashboard, Box } from 'lucide-react';

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  const { theme } = useTheme();
  const pathname = usePathname();

  const [isProductOpen, setIsProductOpen] = useState(true);

  const sidebarBackground = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-200';
  const sidebarTextColor = theme === 'dark' ? 'text-white' : 'text-black';
  const hoverBackground = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-300';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-300';
  const activeBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300';
  const activeText = theme === 'dark' ? 'text-white' : 'text-black';

  return (
    <aside
      className={cn(
        `fixed z-40 flex flex-col w-64 h-full transition-transform duration-300 ease-in-out md:translate-x-0 ${sidebarBackground} ${sidebarTextColor} ${borderColor}`,
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}
    >
      {/* Top logo/title */}
      <div className={`h-16 flex items-center justify-center border-b ${borderColor}`}>
        <Link href="/dashboard" className="text-2xl font-extrabold tracking-wide hover:underline">
          Dashboard
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {/* Dashboard Link */}
        <Link
          href="/dashboard"
          className={cn(
            'flex items-center gap-2 p-2 rounded transition-colors',
            pathname === '/dashboard'
              ? `${activeBg} ${activeText} font-semibold`
              : `${hoverBackground}`
          )}
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </Link>

        {/* Collapsible Section */}
        <div>
          <button
            onClick={() => setIsProductOpen(!isProductOpen)}
            className={cn(
              'flex items-center justify-between w-full px-2 py-2 rounded transition-colors font-medium',
              hoverBackground
            )}
          >
            <div className="flex items-center gap-2">
              <Box className="w-4 h-4" />
              Products
            </div>
            {isProductOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {isProductOpen && (
            <div className="ml-6 mt-2 space-y-1">
              <Link
                href="/products"
                className={cn(
                  'block px-2 py-1 rounded text-sm transition-colors',
                  pathname === '/products'
                    ? `${activeBg} ${activeText} font-semibold`
                    : hoverBackground
                )}
              >
                Product List
              </Link>

              <Link
                href="/add-product"
                className={cn(
                  'block px-2 py-1 rounded text-sm transition-colors',
                  pathname === '/add-product'
                    ? `${activeBg} ${activeText} font-semibold`
                    : hoverBackground
                )}
              >
                Add Product
              </Link>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}
