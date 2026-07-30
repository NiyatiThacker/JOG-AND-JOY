import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import BrandLogo from '../../components/ui/BrandLogo';
import { LayoutDashboard, ShoppingBag, PackageSearch, Settings, LogOut, Package, Tag, BarChart3, Star, Truck, MessageSquare, IndianRupee, Bell, BellOff, CheckCircle, Users } from 'lucide-react';
import { useAuth as useAdmin } from '../../context/AuthContext';
import AdminLogin from './AdminLogin';
import { SettingsProvider, useSettingsContext } from '../../context/SettingsContext';
import { UIProvider } from '../../context/UIContext';
import { useRecentActivity } from '../../queries/useRecentActivity';

function AdminLayoutContent() {
  const location = useLocation();
  const { user, logout } = useAdmin();
  const isAuthenticated = user && user.role === 'ADMIN';
  const { settings } = useSettingsContext();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isNotifMuted, setIsNotifMuted] = useState(false);
  const [readState, setReadState] = useState({}); // Track read notifications locally
  
  const { activities } = useRecentActivity();
  
  const notifications = activities.map(a => ({
    ...a,
    read: readState[a.id] ?? a.read
  }));

  const markAllRead = () => {
    const newReadState = { ...readState };
    activities.forEach(a => { newReadState[a.id] = true; });
    setReadState(newReadState);
  };

 const navItems = [
 { name: 'Overview', path: '/admin', icon: LayoutDashboard },
 { name: 'Customers', path: '/admin/customers', icon: Users },
 { name: 'Products', path: '/admin/products', icon: PackageSearch },
 { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
 { name: 'Inventory', path: '/admin/inventory', icon: Package },
 { name: 'Promotions', path: '/admin/promotions', icon: Tag },
 { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
 { name: 'Reviews', path: '/admin/reviews', icon: Star },
 { name: 'Shipping', path: '/admin/shipping', icon: Truck },
 { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
 { name: 'Financials', path: '/admin/financials', icon: IndianRupee },
 { name: 'Settings', path: '/admin/settings', icon: Settings },
 ];

 if (!isAuthenticated) {
 return <AdminLogin />;
 }

 return (
 <div className="min-h-screen bg-bg-main text-text-primary admin-theme flex">
 {/* Sidebar */}
 <div className="w-64 bg-surface border-r border-border hidden md:flex flex-col fixed h-full z-10">
 <div className="h-16 px-6 border-b border-border flex items-center justify-center shrink-0">
  <BrandLogo className="h-12" linkTo="/admin" showTagline={false} animate={true} />
 </div>
 
 <nav className="mt-4 px-4 flex-1 flex flex-col gap-1 overflow-y-auto pb-4 custom-scrollbar">
 <div className="mb-2 px-2 text-[10px] font-bold text-text-secondary uppercase tracking-wider">Management</div>
 {navItems.map((item) => {
 const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
 const Icon = item.icon;
 return (
 <Link
 key={item.name}
 to={item.path}
 className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-semibold ${
 isActive 
 ? 'bg-accent-green/10 text-accent-green' 
 : 'text-text-secondary hover:bg-zinc-100 hover:text-text-primary'
 }`}
 >
 <Icon className="w-4 h-4" />
 {item.name}
 </Link>
 );
 })}
 </nav>

 <div className="p-4 border-t border-border mt-auto">
 <button 
 onClick={logout}
 className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-semibold text-text-secondary hover:bg-error/10 hover:text-error w-full"
 >
 <LogOut className="w-5 h-5" />
 Logout
 </button>
 </div>
 </div>

 {/* Main Content */}
 <div className="flex-1 md:ml-64 relative min-h-screen flex flex-col">
 {/* Top Navbar */}
 <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
 <div className="w-96">
 <div className="relative">
 <input 
 type="text" 
 placeholder="Search orders, products, etc." 
 className="w-full bg-zinc-50 border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent-green"
 />
 <svg className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
 </div>
 </div>
 <div className="flex items-center gap-4">
 <Link to="/" className="flex items-center gap-2 px-4 py-1.5 border border-border rounded-lg text-sm font-semibold hover:bg-zinc-50 transition-colors">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
 Go to Home
 </Link>
 
 <div className="relative">
   <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="relative p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 rounded-lg transition-colors">
     {isNotifMuted ? <BellOff className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
     {!isNotifMuted && notifications.some(n => !n.read) && (
       <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
     )}
   </button>
   
   {isNotifOpen && (
     <div className="absolute right-0 mt-2 w-80 bg-white border border-border rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
       <div className="p-4 border-b border-border flex items-center justify-between bg-zinc-50/80 rounded-t-xl">
         <h3 className="font-bold text-primary-dark">Notifications</h3>
         <div className="flex gap-2">
           <button onClick={markAllRead} className="p-1.5 text-zinc-400 hover:text-accent-green hover:bg-accent-green/10 rounded-md transition-colors" title="Mark all as read">
             <CheckCircle className="w-4 h-4" />
           </button>
           <button onClick={() => setIsNotifMuted(!isNotifMuted)} className={`p-1.5 rounded-md transition-colors ${isNotifMuted ? 'text-warning-dark bg-warning/10 hover:bg-warning/20' : 'text-zinc-400 hover:bg-zinc-200'}`} title={isNotifMuted ? 'Unmute' : 'Mute alerts'}>
             {isNotifMuted ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
           </button>
         </div>
       </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-zinc-400 text-sm">No notifications</div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map(n => (
                <Link 
                  key={n.id} 
                  to={`/admin/orders?orderId=${n.sourceId}`}
                  onClick={() => setIsNotifOpen(false)}
                  className={`block p-4 hover:bg-zinc-50 transition-colors ${!n.read ? 'bg-accent-green/5' : ''}`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <p className={`text-sm ${!n.read ? 'font-bold text-primary-dark' : 'text-zinc-600 font-medium'}`}>{n.title}</p>
                      <p className="text-xs text-zinc-400 mt-1">{n.time}</p>
                    </div>
                    {!n.read && <span className="w-2 h-2 bg-accent-green rounded-full mt-1 shrink-0"></span>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
     </div>
   )}
 </div>
 <div className="flex items-center gap-3 pl-4 border-l border-border">
 <div className="w-8 h-8 bg-zinc-200 rounded-full flex items-center justify-center text-zinc-600 font-bold text-xs uppercase">
   {user?.name ? user.name.substring(0, 2) : 'AD'}
 </div>
 <div className="hidden sm:block">
 <p className="text-sm font-bold text-text-primary leading-none truncate w-28">{user?.name || 'Administrator'}</p>
 <p className="text-xs text-text-secondary mt-1 truncate w-28">{user?.email}</p>
 </div>
 </div>
 </div>
 </header>

 <main className="max-w-[1280px] w-full mx-auto space-y-6 px-6 md:px-12 py-8 flex-1">
 <Outlet />
 </main>
 </div>
 </div>
 );
}

export default function AdminLayout() {
  return (
    <SettingsProvider>
      <UIProvider>
        <AdminLayoutContent />
      </UIProvider>
    </SettingsProvider>
  );
}
