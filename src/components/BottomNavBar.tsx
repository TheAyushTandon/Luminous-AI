'use client'

import Link from 'next/link'

interface BottomNavBarProps {
  activePage: 'chat' | 'documents' | 'code' | 'audio' | 'settings'
}

export default function BottomNavBar({ activePage }: BottomNavBarProps) {
  const navItems = [
    { id: 'chat', icon: 'chat', label: 'Chat', href: '/chat' },
    { id: 'documents', icon: 'description', label: 'Docs', href: '/documents' },
    { id: 'code', icon: 'code', label: 'Code', href: '/code' },
    { id: 'audio', icon: 'mic', label: 'Audio', href: '/audio' },
    { id: 'settings', icon: 'settings', label: 'Settings', href: '/settings' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-4 bg-slate-900/40 backdrop-blur-2xl dark:bg-[#101419]/40 rounded-t-[2.5rem]">
      {navItems.map((item) => {
        const isActive = activePage === item.id
        return (
          <Link
            key={item.id}
            href={item.href}
            className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
              isActive
                ? 'bg-gradient-to-tr from-[#bac4fa] to-[#616b9c] text-slate-950 rounded-full px-4 py-1 shadow-[0_0_15px_rgba(186,196,250,0.4)]'
                : 'text-slate-400 dark:text-slate-500 opacity-80 hover:opacity-100 hover:scale-110'
            }`}
          >
            <span className="material-symbols-outlined text-xl">{item.icon}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest font-mono mt-1">
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
