
import React from 'react';
import { 
  MoreVertical, 
  Calendar, 
  Flag, 
  Users, 
  CheckCircle2, 
  Circle,
  Clock,
  Edit,
  Trash2,
  Paperclip
} from 'lucide-react';
import { Task, Priority, TaskCategory } from '../types';

interface TaskCardProps {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onEdit, onDelete }) => {
  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case Priority.URGENT: return 'bg-rose-100 text-rose-700 border-rose-200';
      case Priority.HIGH: return 'bg-orange-100 text-orange-700 border-orange-200';
      case Priority.MEDIUM: return 'bg-amber-100 text-amber-700 border-amber-200';
      case Priority.LOW: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getCategoryColor = (c: TaskCategory) => {
    switch (c) {
      case TaskCategory.EXAM: return 'bg-purple-100 text-purple-700';
      case TaskCategory.PROJECT: return 'bg-indigo-100 text-indigo-700';
      case TaskCategory.PAPER: return 'bg-blue-100 text-blue-700';
      case TaskCategory.LAB: return 'bg-emerald-100 text-emerald-700';
      case TaskCategory.HOMEWORK: return 'bg-cyan-100 text-cyan-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const isOverdue = new Date(task.dueDate) < new Date(new Date().setHours(0,0,0,0)) && !task.isCompleted;

  return (
    <div className={`group bg-white rounded-2xl p-6 border transition-all duration-200 hover:shadow-xl hover:-translate-y-1 ${
      task.isCompleted ? 'border-slate-100 opacity-75' : 'border-slate-200'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <button 
          onClick={onToggle}
          className={`shrink-0 mt-1 transition-colors ${task.isCompleted ? 'text-indigo-600' : 'text-slate-300 hover:text-indigo-400'}`}
        >
          {task.isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
        </button>
        
        <div className="flex gap-2">
          <button onClick={onEdit} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={onDelete} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h3 className={`font-bold text-lg leading-snug mb-2 ${task.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
          {task.title}
        </h3>
        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${getCategoryColor(task.category)}`}>
          {task.category}
        </span>
      </div>

      {task.subTasks.length > 0 && (
        <div className="mb-6 space-y-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Checklist</p>
          {task.subTasks.map(st => (
            <div key={st.id} className="flex items-center gap-2 text-xs text-slate-600">
              <div className={`w-1.5 h-1.5 rounded-full ${st.isCompleted ? 'bg-indigo-400' : 'bg-slate-200'}`} />
              <span className={st.isCompleted ? 'line-through opacity-50' : ''}>{st.title}</span>
            </div>
          ))}
        </div>
      )}

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className={`flex items-center gap-2 text-xs font-medium ${isOverdue ? 'text-rose-600' : 'text-slate-500'}`}>
          <Calendar className="w-4 h-4" />
          {task.dueDate}
          {isOverdue && <span className="flex items-center gap-1 bg-rose-50 px-1.5 py-0.5 rounded text-[10px]"><Clock className="w-3 h-3" /> Overdue</span>}
        </div>

        {task.collaborators.length > 0 && (
          <div className="flex -space-x-2">
            {task.collaborators.slice(0, 3).map((c, i) => (
              <div 
                key={i} 
                className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-indigo-600"
                title={c}
              >
                {c.charAt(0)}
              </div>
            ))}
            {task.collaborators.length > 3 && (
              <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600">
                +{task.collaborators.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
