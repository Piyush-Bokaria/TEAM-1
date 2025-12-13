import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Search, 
  Settings, 
  Bell, 
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Library,
  Bot,
  ClipboardList,
  GitCompare
} from 'lucide-react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  setRole: (role: UserRole) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, role, setRole }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync the prop role with the global state. 
  // This ensures that when a user lands on a hardcoded route (like /admin), 
  // the global role state updates to match, preventing redirection to 'User' 
  // when navigating to shared routes like /search.
  useEffect(() => {
    setRole(role);
  }, [role, setRole]);

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
    <Link
      to={to}
      onClick={() => setMobileMenuOpen(false)}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
        isActive(to) 
          ? 'bg-reg-teal/10 text-reg-teal' 
          : 'text-slate-400 hover:text-white hover:bg-slate-800'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );

  return (
    <div className="flex h-screen bg-reg-surface overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-reg-navy text-white transform transition-transform duration-300 lg:relative lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <Link to="/" className="p-6 flex items-center gap-2 border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
            <div className="w-8 h-8 rounded bg-reg-teal flex items-center justify-center">
              <ShieldCheck className="text-white" size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight">RegTech Assist</span>
          </Link>

          <nav className="flex-1 px-4 py-6 space-y-2">
            <div className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Platform</div>
            {role === UserRole.ADMIN ? (
              <>
                <NavItem to="/admin" icon={LayoutDashboard} label="Admin Overview" />
                <NavItem to="/search" icon={Search} label="Regulations" />
                <NavItem to="/admin/upload" icon={FileText} label="Document Management" />
              </>
            ) : (
              <>
                <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                <NavItem to="/documents" icon={Library} label="Document Library" />
                <NavItem to="/ask-ai" icon={Bot} label="Ask Compliance AI" />
                <NavItem to="/checklists" icon={ClipboardList} label="Checklist Generator" />
                <NavItem to="/compare" icon={GitCompare} label="Version Comparison" />
              </>
            )}
          </nav>

          <div className="p-4 border-t border-slate-800 bg-slate-900/50">
             <div className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Simulate Role</div>
             <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setRole(UserRole.USER);
                    navigate('/dashboard');
                  }}
                  className={`flex-1 text-xs py-1 rounded border ${role === UserRole.USER ? 'bg-reg-teal border-reg-teal text-white' : 'border-slate-600 text-slate-400'}`}
                >
                  User
                </button>
                <button 
                  onClick={() => {
                    setRole(UserRole.ADMIN);
                    navigate('/admin');
                  }}
                  className={`flex-1 text-xs py-1 rounded border ${role === UserRole.ADMIN ? 'bg-reg-teal border-reg-teal text-white' : 'border-slate-600 text-slate-400'}`}
                >
                  Admin
                </button>
             </div>
          </div>

          <div className="p-4 border-t border-slate-800">
            <button className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors w-full px-4">
              <LogOut size={18} />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-reg-border flex items-center justify-between px-6 lg:px-8">
          <button 
            className="lg:hidden text-reg-charcoal"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>

          <div className="flex-1 max-w-xl ml-4 lg:ml-0">
             <div className="text-sm text-slate-500 font-medium">
                {role === UserRole.ADMIN ? 'Administrator Portal' : 'Compliance Workspace'}
             </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-reg-navy transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-reg-navy flex items-center justify-center text-white text-xs font-bold ring-2 ring-slate-100">
              {role === UserRole.ADMIN ? 'AD' : 'JD'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-reg-surface p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};