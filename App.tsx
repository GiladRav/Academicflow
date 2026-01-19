
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Flag, 
  Users, 
  Sparkles, 
  Search,
  LayoutGrid,
  List as ListIcon,
  ChevronRight,
  Clock,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { Task, Priority, TaskCategory, SubTask } from './types';
import TaskCard from './components/TaskCard';
import TaskForm from './components/TaskForm';
import Sidebar from './components/Sidebar';
import { getSmartAdvice } from './services/geminiService';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiAdvice, setAiAdvice] = useState<string>('Loading academic insights...');
  const [isRefreshingAdvice, setIsRefreshingAdvice] = useState(false);

  // Initial dummy data
  useEffect(() => {
    const initialTasks: Task[] = [
      {
        id: '1',
        title: 'Submit CS301 Database Project',
        description: 'Finalize the SQL schema and normalization documentation.',
        priority: Priority.URGENT,
        category: TaskCategory.PROJECT,
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        isCompleted: false,
        subTasks: [
          { id: 's1', title: 'ER Diagram update', isCompleted: true },
          { id: 's2', title: 'Normalization proof', isCompleted: false }
        ],
        collaborators: ['Sarah L.', 'Mike R.'],
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Psychology 101 Midterm',
        description: 'Read chapters 5-8 on cognitive development.',
        priority: Priority.HIGH,
        category: TaskCategory.EXAM,
        dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
        isCompleted: false,
        subTasks: [],
        collaborators: [],
        createdAt: new Date().toISOString()
      }
    ];
    setTasks(initialTasks);
  }, []);

  const refreshAdvice = async () => {
    if (tasks.length === 0) return;
    setIsRefreshingAdvice(true);
    const advice = await getSmartAdvice(tasks);
    setAiAdvice(advice);
    setIsRefreshingAdvice(false);
  };

  useEffect(() => {
    if (tasks.length > 0) {
      const timer = setTimeout(() => refreshAdvice(), 1000);
      return () => clearTimeout(timer);
    }
  }, [tasks.length]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
      
      let matchesDate = true;
      const today = new Date().toISOString().split('T')[0];
      if (filter === 'today') matchesDate = task.dueDate === today;
      if (filter === 'upcoming') matchesDate = task.dueDate > today;
      if (filter === 'completed') matchesDate = task.isCompleted;

      return matchesSearch && matchesCategory && (filter === 'completed' ? task.isCompleted : (!task.isCompleted || filter === 'all'));
    });
  }, [tasks, searchQuery, categoryFilter, filter]);

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'isCompleted'>) => {
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      isCompleted: false
    };
    setTasks([newTask, ...tasks]);
    setIsFormOpen(false);
  };

  const handleUpdateTask = (taskData: Task) => {
    setTasks(tasks.map(t => t.id === taskData.id ? taskData : t));
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
    ));
  };

  const deleteTask = (id: string) => {
    if (confirm('Delete this task?')) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar 
        currentFilter={filter} 
        setFilter={setFilter}
        currentCategory={categoryFilter}
        setCategory={setCategoryFilter}
        taskCount={tasks.length}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search tasks, notes, collaborators..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl text-sm transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-indigo-200"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {/* AI Banner */}
          <div className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 flex items-start gap-4">
            <div className="bg-white p-3 rounded-xl shadow-sm">
              <Sparkles className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider">AI Study Advisor</h3>
                <button 
                  onClick={refreshAdvice}
                  disabled={isRefreshingAdvice}
                  className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1"
                >
                  {isRefreshingAdvice ? 'Analyzing...' : 'Refresh Insights'}
                </button>
              </div>
              <p className="text-indigo-800 text-sm leading-relaxed whitespace-pre-wrap">
                {aiAdvice}
              </p>
            </div>
          </div>

          {/* Task Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onToggle={() => toggleTaskCompletion(task.id)}
                  onEdit={() => {
                    setEditingTask(task);
                    setIsFormOpen(true);
                  }}
                  onDelete={() => deleteTask(task.id)}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
                <div className="bg-slate-100 p-6 rounded-full mb-4">
                  <Calendar className="w-12 h-12" />
                </div>
                <p className="text-lg font-medium">No tasks found in this view</p>
                <p className="text-sm">Try changing filters or adding a new task!</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Task Form Modal */}
      {(isFormOpen || editingTask) && (
        <TaskForm 
          isOpen={isFormOpen} 
          onClose={() => {
            setIsFormOpen(false);
            setEditingTask(null);
          }}
          onSubmit={editingTask ? handleUpdateTask : handleAddTask}
          initialData={editingTask}
        />
      )}
    </div>
  );
};

export default App;
