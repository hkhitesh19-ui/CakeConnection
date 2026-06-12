import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Tag, 
  Users, 
  Settings, 
  LogOut,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ADMIN_LINKS = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
  { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  { name: 'Products', path: '/admin/products', icon: Package },
  { name: 'Coupons', path: '/admin/coupons', icon: Tag },
  { name: 'Customers', path: '/admin/customers', icon: Users },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    // In a real app, clear auth tokens here
    router.push('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-brand-black border-r border-border-secondary">
      <div className="p-6">
        <h2 className="text-2xl font-display font-bold text-brand-rose">Admin Panel</h2>
        <p className="text-text-muted text-sm mt-1">Cake Connection</p>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {ADMIN_LINKS.map((link) => {
          const isActive = link.exact ? pathname === link.path : pathname.startsWith(link.path);
          return (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-brand-rose/10 text-brand-rose border border-brand-rose/20'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
              }`}
            >
              <link.icon className="w-5 h-5" />
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-border-secondary">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-text-secondary hover:text-brand-rose hover:bg-brand-rose/10 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-brand-black overflow-hidden font-sans text-text-primary">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 h-full flex-shrink-0 z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar (Overlay) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 z-50 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-20 flex-shrink-0 bg-brand-black/80 backdrop-blur-md border-b border-border-secondary flex items-center justify-between px-6 lg:px-10 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button
              className="p-2 lg:hidden text-text-secondary hover:text-text-primary"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-medium hidden sm:block">Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-text-secondary hover:text-brand-rose transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-rose rounded-full animate-pulse"></span>
            </button>
            
            <div className="flex items-center gap-3 border-l border-border-secondary pl-6">
              <div className="w-10 h-10 rounded-full bg-brand-rose flex items-center justify-center text-white font-bold">
                AD
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-text-muted">Superadmin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

