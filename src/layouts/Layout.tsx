// src/layouts/Layout.tsx
import * as React from 'react'

type LayoutProps = {
  children: React.ReactNode
  currentPageName: string
}

export default function Layout({ children, currentPageName }: LayoutProps) {
  return (
    // ✅ This is the corrected outer wrapper line for Step 12:
    <div className="min-h-screen flex w-full bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r bg-white">
        <div className="p-4 border-b">
          <a href="/" className="font-semibold">Structural Quiz</a>
        </div>
        <nav className="p-2">
          <a
            href="/"
            className="block rounded px-3 py-2 hover:bg-slate-100"
          >
            Home
          </a>
          <a
            href="/Quiz"
            className="block rounded px-3 py-2 hover:bg-slate-100"
          >
            Quiz
          </a>
          {/* Add more links as you add pages */}
        </nav>
      </aside>

      {/* Main column */}
      <main className="flex-1 min-h-screen">
        {/* Top bar */}
        <header className="border-b bg-white">
          <div className="mx-auto max-w-6xl p-4">
            <h1 className="text-xl font-semibold">{currentPageName}</h1>
          </div>
        </header>

        {/* Page body */}
        <div className="mx-auto max-w-6xl p-4">
          {children}
        </div>
      </main>
    </div>
  )
}
