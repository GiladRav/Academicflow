
import React from 'react';
import { 
  Home, 
  Calendar, 
  CheckCircle2, 
  Layers, 
  BookOpen, 
  FileText, 
  FlaskConical, 
  Rocket, 
  MoreHorizontal,
  Clock
} from 'lucide-react';
import { TaskCategory } from '../types';

interface SidebarProps {
  currentFilter: 'all' | 'today' | 'upcoming' | 'completed';
  setFilter: (f: 'all' | 'today' | 'upcoming' | 'completed') => void;
  currentCategory: TaskCategory | 'all';
  setCategory: (c: TaskCategory | 'all') => void;
  taskCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentFilter, 
  setFilter, 
  currentCategory, 
  setCategory,
  taskCount 
}) => {
  const categories = [
    { name: TaskCategory.EXAM, icon: Rocket, color: 'text-orange-500' },
    { name: TaskCategory.PAPER, icon: FileText, color: 'text-blue-500' },
    { name: TaskCategory.HOMEWORK, icon: BookOpen, color: 'text-emerald-500' },
    { name: TaskCategory.LAB, icon: FlaskConical, color: 'text-purple-500' },
    { name: TaskCategory.PROJECT, icon: Layers, color: 'text-indigo-500' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto hidden md:flex">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">AcademiaFlow</h1>
        </div>

        <nav className="space-y-1 mb-8">
          <p className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Navigation</p>
          <SidebarLink 
            icon={Home} 
            label="All Tasks" 
            isActive={currentFilter === 'all'} 
            onClick={() => { setFilter('all'); setCategory('all'); }} 
          />
          <SidebarLink 
            icon={Clock} 
            label="Today" 
            isActive={currentFilter === 'today'} 
            onClick={() => setFilter('today')} 
          />
          <SidebarLink 
            icon={Calendar} 
            label="Upcoming" 
            isActive={currentFilter === 'upcoming'} 
            onClick={() => setFilter('upcoming')} 
          />
          <SidebarLink 
            icon={CheckCircle2} 
            label="Completed" 
            isActive={currentFilter === 'completed'} 
            onClick={() => setFilter('completed')} 
          />
        </nav>

        <nav className="space-y-1">
          <p className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Categories</p>
          {categories.map((cat) => (
            <SidebarLink 
              key={cat.name}
              icon={cat.icon} 
              label={cat.name} 
              isActive={currentCategory === cat.name} 
              onClick={() => setCategory(cat.name)}
              colorClass={cat.color}
            />
          ))}
          <SidebarLink 
            icon={MoreHorizontal} 
            label="Other" 
            isActive={currentCategory === TaskCategory.OTHER} 
            onClick={() => setCategory(TaskCategory.OTHER)} 
          />
        </nav>
      </div>

      <div className="mt-auto p-8">
        <div className="bg-slate-900 rounded-2xl p-4 text-white">
          <p className="text-xs text-slate-400 mb-1">Total Tasks</p>
          <div className="flex items-center justify-between">
            <h4 className="text-2xl font-bold">{taskCount}</h4>
            <div className="px-2 py-1 bg-indigo-500 rounded text-[10px] font-bold uppercase">Academic Year 24/25</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

interface SidebarLinkProps {
  icon: any;
  label: string;
  isActive: boolean;
  onClick: () => void;
  colorClass?: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon: Icon, label, isActive, onClick, colorClass }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
      isActive 
        ? 'bg-indigo-50 text-indigo-700' 
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : colorClass || 'text-slate-400'}`} />
    {label}
  </button>
);

export default Sidebar;
