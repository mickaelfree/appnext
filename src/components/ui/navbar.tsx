'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LuBrain, LuCode, LuLayoutDashboard, LuChartBar } from 'react-icons/lu';

// Separate the NavLink component to handle active state
function NavLink({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link
      href={href}
      className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
        isActive ? 'text-foreground' : 'text-muted-foreground'
      }`}
    >
      <Icon className="h-4 w-4 md:mr-2" />
      <span className="hidden md:inline">{label}</span>
    </Link>
  );
}

export function Navbar() {
  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LuLayoutDashboard,
    },
    {
      label: 'Flashcards',
      href: '/flashcards',
      icon: LuBrain,
    },
    {
      label: 'Shadow Coding',
      href: '/shadow-coding',
      icon: LuCode,
    },
    {
      label: 'Analytics',
      href: '/analytics',
      icon: LuChartBar,
    },
  ];

  return (
    <nav className="flex items-center bg-background h-16 px-4 border-b">
      <Link href="/" className="text-xl font-bold mr-4 flex-shrink-0">
        AppNext
      </Link>
      <div className="ml-auto flex items-center space-x-2 md:space-x-4 overflow-x-auto no-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
          />
        ))}
      </div>
    </nav>
  );
}