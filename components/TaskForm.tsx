
import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Sparkles, 
  Calendar, 
  Flag, 
  Users, 
  ChevronRight,
  CheckCircle2,
  Trash2,
  Loader2
} from 'lucide-react';
import { Task, Priority, TaskCategory, SubTask } from '../types';
import { breakdownTaskWithAI } from '../services/geminiService';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: any) => void;
  initialData?: Task | null;
}

const TaskForm: React.FC<TaskFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: initialData?.priority || Priority.MEDIUM,
    category: initialData?.category || TaskCategory.HOMEWORK,
    dueDate: initialData?.dueDate || new Date().toISOString().split('T')[0],
    subTasks: initialData?.subTasks || [] as SubTask[],
    collaborators: initialData?.collaborators || [] as string[]
  });

  const [newSubTask, setNewSubTask] = useState('');
  const [newCollaborator, setNewCollaborator] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        priority: initialData.priority,
        category: initialData.category,
        dueDate: initialData.dueDate,
        subTasks: initialData.subTasks,
        collaborators: initialData.collaborators
      });
    }
  }, [initialData]);

  const addSubTask = () => {
    if (!newSubTask.trim()) return;
    setFormData({
      ...formData,
      subTasks: [...formData.subTasks, { id: Math.random().toString(), title: newSubTask, isCompleted: false }]
    });
    setNewSubTask('');
  };

  const addCollaborator = () => {
    if (!newCollaborator.trim()) return;
    setFormData({
      ...formData,
      collaborators: [...formData.collaborators, newCollaborator]
    });
    setNewCollaborator('');
  };

  const handleAiBreakdown = async () => {
    if (!formData.title) return alert('Enter a title first!');
    setIsAiLoading(true);
    const result = await breakdownTaskWithAI(formData);
    if (result && result.breakdown) {
      const newSubTasks: SubTask[] = result.breakdown.map((t: string) => ({
        id: Math.random().toString(),
        title: t,
        isCompleted: false
      }));
      setFormData({
        ...formData,
        description: formData.description || `AI Estimate: ${result.estimatedHours} hours. \nTip: ${result.proTip}`,
        subTasks: [...formData.subTasks, ...newSubTasks]
      });
    }
    setIsAiLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(initialData ? { ...initialData, ...formData } : formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-bold text-slate-900">{initialData ? 'Edit Task' : 'New Academic Task'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="space-y-6">
            {/* Title & Description */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Title</label>
              <input 
                autoFocus
                type="text" 
                required
                className="w-full text-xl font-bold bg-slate-50 border-none focus:ring-2 focus:ring-indigo-100 rounded-xl px-4 py-3 placeholder-slate-300"
                placeholder="e.g., Organic Chemistry Lab Report"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Details & Notes</label>
              <textarea 
                className="w-full bg-slate-50 border-none focus:ring-2 focus:ring-indigo-100 rounded-xl px-4 py-3 min-h-[100px] text-sm resize-none"
                placeholder="Add assignment details, requirements, or links..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Config Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Priority</label>
                <select 
                  className="w-full bg-slate-50 border-none focus:ring-2 focus:ring-indigo-100 rounded-xl px-4 py-3 text-sm font-medium"
                  value={formData.priority}
                  onChange={e => setFormData({ ...formData, priority: e.target.value as Priority })}
                >
                  {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Category</label>
                <select 
                  className="w-full bg-slate-50 border-none focus:ring-2 focus:ring-indigo-100 rounded-xl px-4 py-3 text-sm font-medium"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as TaskCategory })}
                >
                  {Object.values(TaskCategory).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Due Date</label>
                <input 
                  type="date" 
                  required
                  className="w-full bg-slate-50 border-none focus:ring-2 focus:ring-indigo-100 rounded-xl px-4 py-3 text-sm"
                  value={formData.dueDate}
                  onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
            </div>

            {/* AI Action */}
            <button 
              type="button"
              onClick={handleAiBreakdown}
              disabled={isAiLoading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-3 rounded-xl text-sm transition-all border border-indigo-100 border-dashed"
            >
              {isAiLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {isAiLoading ? 'Breaking it down...' : 'Use AI to break this task into sub-tasks'}
            </button>

            {/* Checklist */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Checklist Items</label>
              <div className="space-y-2 mb-4">
                {formData.subTasks.map((st, idx) => (
                  <div key={st.id} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl group">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm flex-1 text-slate-700">{st.title}</span>
                    <button 
                      type="button" 
                      onClick={() => setFormData({ ...formData, subTasks: formData.subTasks.filter(s => s.id !== st.id) })}
                      className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 bg-slate-50 border-none focus:ring-2 focus:ring-indigo-100 rounded-xl px-4 py-3 text-sm"
                  placeholder="Add a step..."
                  value={newSubTask}
                  onChange={e => setNewSubTask(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSubTask())}
                />
                <button 
                  type="button" 
                  onClick={addSubTask}
                  className="bg-slate-200 hover:bg-slate-300 p-3 rounded-xl transition-colors"
                >
                  <Plus className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>

            {/* Collaborators */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Collaborators</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.collaborators.map((c, idx) => (
                  <div key={idx} className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2">
                    {c}
                    <button type="button" onClick={() => setFormData({ ...formData, collaborators: formData.collaborators.filter(coll => coll !== c) })}>
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 bg-slate-50 border-none focus:ring-2 focus:ring-indigo-100 rounded-xl px-4 py-3 text-sm"
                  placeholder="Invite peer (e.g. John Doe)..."
                  value={newCollaborator}
                  onChange={e => setNewCollaborator(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addCollaborator())}
                />
                <button 
                  type="button" 
                  onClick={addCollaborator}
                  className="bg-slate-200 hover:bg-slate-300 p-3 rounded-xl transition-colors"
                >
                  <Users className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            {initialData ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
