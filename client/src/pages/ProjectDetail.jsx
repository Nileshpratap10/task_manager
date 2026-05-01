import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { getTasks, createTask, updateTaskStatus, deleteTask } from '../api/tasks';
import { updateProject, updateMemberRole, removeMember } from '../api/projects';
import { 
  Plus, Users, Settings, MoreHorizontal, 
  Calendar, Flag, MessageSquare, Paperclip,
  CheckCircle2, Circle, Clock, ShieldCheck, 
  User as UserIcon, Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProjectDetail = () => {
  const { id } = useParams();
  const { currentProject, getProject, loading } = useProjects();
  const { user } = useAuth();
  
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('tasks');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [newTask, setNewTask] = useState({ 
    title: '', description: '', priority: 'medium', assignedTo: '' 
  });

  useEffect(() => {
    const fetchData = async () => {
      await getProject(id);
      try {
        const { data } = await getTasks(id);
        setTasks(data);
      } catch (error) {
        console.error('Failed to fetch tasks');
      } finally {
        setLoadingTasks(false);
      }
    };
    fetchData();
  }, [id]);

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;

    const updatedTasks = tasks.map(t => 
      t._id === draggableId ? { ...t, status: newStatus } : t
    );
    setTasks(updatedTasks);

    try {
      await updateTaskStatus(draggableId, newStatus);
    } catch (error) {
      toast.error('Failed to update task status');
      const { data } = await getTasks(id);
      setTasks(data);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const { data } = await createTask(id, newTask);
      setTasks([...tasks, data]);
      setIsTaskModalOpen(false);
      setNewTask({ title: '', description: '', priority: 'medium', assignedTo: '' });
      toast.success('Task created');
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateProject(id, { status: newStatus });
      toast.success('Project status updated');
      getProject(id);
    } catch (error) {
      toast.error('Failed to update project status');
    }
  };

  const handleUpdateMemberRole = async (userId, role) => {
    try {
      await updateMemberRole(id, userId, role);
      toast.success('Member role updated');
      getProject(id);
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    try {
      await removeMember(id, userId);
      toast.success('Member removed');
      getProject(id);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove member');
    }
  };

  const isAdmin = currentProject?.members.some(
    (m) => m.user._id === user?._id && m.role === 'admin'
  );

  const columns = [
    { id: 'todo', title: 'To Do', icon: Circle, color: 'text-gray-400' },
    { id: 'in-progress', title: 'In Progress', icon: Clock, color: 'text-amber-500' },
    { id: 'done', title: 'Done', icon: CheckCircle2, color: 'text-emerald-500' },
  ];

  if (loading || loadingTasks) return <div className="flex justify-center py-20"><div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2 flex-1">
          <div className="flex items-center space-x-2 text-sm text-gray-500 font-medium">
            <span>Projects</span>
            <span>/</span>
            <span className="text-blue-600">{currentProject?.name}</span>
          </div>
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{currentProject?.name}</h1>
            <select 
              value={currentProject?.status || 'pending'}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={!isAdmin}
              className={`text-xs font-bold px-3 py-1 rounded-full border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer capitalize ${
                currentProject?.status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                currentProject?.status === 'in-progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300'
              } ${!isAdmin && 'opacity-70 cursor-not-allowed'}`}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <p className="text-gray-500 dark:text-slate-400 max-w-2xl">{currentProject?.description}</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex -space-x-2">
            {currentProject?.members.slice(0, 3).map((member, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-gray-200 dark:bg-slate-700 overflow-hidden shadow-sm" title={member.user.name}>
                <img 
                  src={(member.user.avatar && member.user.avatar !== 'undefined' && member.user.avatar !== 'null') ? member.user.avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(member.user.name || '')}&background=3b82f6&color=fff`} 
                  alt="" 
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.user.name || '')}&background=3b82f6&color=fff`;
                  }}
                  className="w-full h-full object-cover" 
                />
              </div>
            ))}
            {currentProject?.members.length > 3 && (
              <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold">
                +{currentProject.members.length - 3}
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsTaskModalOpen(true)}
            className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 font-semibold"
          >
            <Plus size={20} />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-8 border-b border-gray-100 dark:border-slate-800">
        <button 
          onClick={() => setActiveTab('tasks')}
          className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'tasks' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-slate-300'}`}
        >
          Tasks
          {activeTab === 'tasks' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('members')}
          className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'members' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-slate-300'}`}
        >
          Members ({currentProject?.members.length})
          {activeTab === 'members' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"></div>}
        </button>
      </div>

      {activeTab === 'tasks' ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex space-x-6 overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide">
            {columns.map(column => (
              <div key={column.id} className="flex-shrink-0 w-80">
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center space-x-2">
                    <column.icon size={18} className={column.color} />
                    <h3 className="font-bold text-gray-700 dark:text-slate-200">{column.title}</h3>
                    <span className="bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {tasks.filter(t => t.status === column.id).length}
                    </span>
                  </div>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`min-h-[500px] rounded-2xl transition-colors ${
                        snapshot.isDraggingOver ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'bg-gray-50/50 dark:bg-slate-900/50'
                      } p-3 space-y-3`}
                    >
                      {tasks
                        .filter(t => t.status === column.id)
                        .map((task, index) => (
                          <Draggable key={task._id} draggableId={task._id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm group hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-md transition-all ${
                                  snapshot.isDragging ? 'shadow-2xl ring-2 ring-blue-500/20' : ''
                                }`}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                    task.priority === 'high' ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400' :
                                    task.priority === 'medium' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' :
                                    'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                  }`}>
                                    {task.priority}
                                  </span>
                                  <button className="text-gray-300 dark:text-slate-600 group-hover:text-gray-500 dark:group-hover:text-slate-400">
                                    <MoreHorizontal size={16} />
                                  </button>
                                </div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 leading-tight">{task.title}</h4>
                                <p className="text-gray-500 dark:text-slate-400 text-[11px] line-clamp-2 mb-4 leading-relaxed">
                                  {task.description}
                                </p>
                                
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3 text-gray-300 dark:text-slate-600">
                                    <div className="flex items-center text-[10px] font-medium">
                                      <MessageSquare size={14} className="mr-1" />
                                      <span>2</span>
                                    </div>
                                    <div className="flex items-center text-[10px] font-medium">
                                      <Paperclip size={14} className="mr-1" />
                                      <span>1</span>
                                    </div>
                                  </div>
                                  <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden border border-white dark:border-slate-800 shadow-sm">
                                    {task.assignedTo ? (
                                      <img 
                                        src={(task.assignedTo.avatar && task.assignedTo.avatar !== 'undefined' && task.assignedTo.avatar !== 'null') ? task.assignedTo.avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignedTo.name || '')}&background=3b82f6&color=fff`} 
                                        alt="" 
                                        onError={(e) => {
                                          e.target.onerror = null; 
                                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignedTo.name || '')}&background=3b82f6&color=fff`;
                                        }}
                                        className="w-full h-full object-cover" 
                                      />
                                    ) : (
                                      <UserIcon className="w-full h-full p-1 text-gray-300 dark:text-slate-600" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
          <div className="p-8 border-b border-gray-100 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-800/20">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Users size={24} className="text-blue-600 dark:text-blue-400" />
              Manage Team Composition
            </h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 ml-8">Add, remove or update roles for this workspace</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50 dark:border-slate-800">
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">User</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Role</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Joined On</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                {currentProject?.members.map((member) => (
                  <tr key={member.user._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-slate-800 overflow-hidden shadow-sm">
                          <img 
                            src={(member.user.avatar && member.user.avatar !== 'undefined' && member.user.avatar !== 'null') ? member.user.avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(member.user.name || '')}&background=3b82f6&color=fff`} 
                            alt="" 
                            onError={(e) => {
                              e.target.onerror = null; 
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.user.name || '')}&background=3b82f6&color=fff`;
                            }}
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{member.user.name}</p>
                          <p className="text-[11px] text-gray-500 dark:text-slate-500 font-medium">{member.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      {isAdmin && member.user._id !== user?._id ? (
                        <select
                          value={member.role}
                          onChange={(e) => handleUpdateMemberRole(member.user._id, e.target.value)}
                          className="text-xs font-bold bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm dark:text-white"
                        >
                          <option value="admin">Admin</option>
                          <option value="member">Member</option>
                        </select>
                      ) : (
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                          member.role === 'admin' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400'
                        }`}>
                          {member.role}
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-xs text-gray-500 dark:text-slate-400 font-medium">
                      {new Date(currentProject.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-5 text-right">
                      {isAdmin && member.user._id !== user?._id && (
                        <button 
                          onClick={() => handleRemoveMember(member.user._id)}
                          className="p-2 text-rose-300 dark:text-rose-900 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                          title="Remove Member"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Task Title</label>
                <input 
                  type="text" required
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="What needs to be done?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Description</label>
                <textarea 
                  rows="3"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Add more details..."
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Priority</label>
                  <select 
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none capitalize"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Assignee</label>
                  <select 
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Unassigned</option>
                    {currentProject?.members?.map(m => (
                      <option key={m.user._id} value={m.user._id}>{m.user.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center space-x-4 pt-6">
                <button 
                  type="button" 
                  onClick={() => setIsTaskModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
