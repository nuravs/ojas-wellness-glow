import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Clock, CheckCircle, Circle, Calendar, Target, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface RoutineTask {
  id: string;
  title: string;
  description?: string;
  time: string;
  category: 'medication' | 'exercise' | 'self-care' | 'appointment' | 'other';
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface DailyRoutine {
  id: string;
  routine_date: string;
  routine_data: {
    tasks: RoutineTask[];
    goals: string[];
  };
  completed_tasks: string[];
  wellness_score?: number;
  notes?: string;
}

const DailyRoutinesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [routines, setRoutines] = useState<DailyRoutine[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    time: '09:00',
    category: 'other' as const,
    priority: 'medium' as const
  });

  const currentRoutine = routines.find(r => r.routine_date === selectedDate);

  useEffect(() => {
    if (user) {
      loadRoutines();
    }
  }, [user, selectedDate]);

  const loadRoutines = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_routines')
        .select('*')
        .eq('user_id', user?.id)
        .gte('routine_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('routine_date', { ascending: false });

      if (error) throw error;
      setRoutines(data || []);
    } catch (error) {
      console.error('Error loading routines:', error);
      toast.error('Failed to load daily routines');
    } finally {
      setLoading(false);
    }
  };

  const createOrUpdateRoutine = async (tasks: RoutineTask[], notes?: string) => {
    try {
      const routineData = {
        tasks,
        goals: ['Take medications on time', 'Complete daily exercises', 'Track wellness']
      };

      const { data, error } = await supabase
        .from('daily_routines')
        .upsert({
          user_id: user?.id,
          routine_date: selectedDate,
          routine_data: routineData,
          notes,
          completed_tasks: currentRoutine?.completed_tasks || []
        }, {
          onConflict: 'user_id,routine_date'
        })
        .select()
        .single();

      if (error) throw error;
      
      setRoutines(prev => {
        const updated = prev.filter(r => r.routine_date !== selectedDate);
        return [data, ...updated].sort((a, b) => b.routine_date.localeCompare(a.routine_date));
      });

      toast.success('Routine updated successfully');
    } catch (error) {
      console.error('Error updating routine:', error);
      toast.error('Failed to update routine');
    }
  };

  const addTask = async () => {
    if (!newTask.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    const task: RoutineTask = {
      id: crypto.randomUUID(),
      ...newTask,
      completed: false
    };

    const currentTasks = currentRoutine?.routine_data?.tasks || [];
    await createOrUpdateRoutine([...currentTasks, task]);

    setNewTask({
      title: '',
      description: '',
      time: '09:00',
      category: 'other',
      priority: 'medium'
    });
    setShowCreateDialog(false);
  };

  const toggleTask = async (taskId: string) => {
    if (!currentRoutine) return;

    const updatedCompletedTasks = currentRoutine.completed_tasks.includes(taskId)
      ? currentRoutine.completed_tasks.filter(id => id !== taskId)
      : [...currentRoutine.completed_tasks, taskId];

    try {
      const { error } = await supabase
        .from('daily_routines')
        .update({ completed_tasks: updatedCompletedTasks })
        .eq('id', currentRoutine.id);

      if (error) throw error;

      setRoutines(prev => 
        prev.map(r => 
          r.id === currentRoutine.id 
            ? { ...r, completed_tasks: updatedCompletedTasks }
            : r
        )
      );
    } catch (error) {
      console.error('Error toggling task:', error);
      toast.error('Failed to update task');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'medication': return '💊';
      case 'exercise': return '🏃‍♂️';
      case 'self-care': return '🧘‍♀️';
      case 'appointment': return '🏥';
      default: return '📝';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'medication': return 'bg-blue-100 text-blue-800';
      case 'exercise': return 'bg-green-100 text-green-800';
      case 'self-care': return 'bg-purple-100 text-purple-800';
      case 'appointment': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const calculateProgress = () => {
    if (!currentRoutine?.routine_data?.tasks) return 0;
    const totalTasks = currentRoutine.routine_data.tasks.length;
    const completedCount = currentRoutine.completed_tasks.length;
    return totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  };

  const sortedTasks = currentRoutine?.routine_data?.tasks?.sort((a, b) => {
    // Sort by time first, then by priority
    if (a.time !== b.time) {
      return a.time.localeCompare(b.time);
    }
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  }) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-ojas-bg-light p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-ojas-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-ojas-text-secondary">Loading your routines...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ojas-bg-light">
      {/* Header */}
      <div className="bg-white border-b border-ojas-border p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-ojas-text-primary">Daily Routines</h1>
              <p className="text-sm text-ojas-text-secondary">Organize your daily health activities</p>
            </div>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-ojas-primary hover:bg-ojas-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogDescription>
                  Add a task to your daily routine
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Enter task title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Optional description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newTask.time}
                      onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <select
                      id="priority"
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                      className="w-full p-2 border border-ojas-border rounded-md"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value as any })}
                    className="w-full p-2 border border-ojas-border rounded-md"
                  >
                    <option value="medication">Medication</option>
                    <option value="exercise">Exercise</option>
                    <option value="self-care">Self Care</option>
                    <option value="appointment">Appointment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={addTask}>
                    Add Task
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Date Selector */}
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-ojas-text-secondary" />
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
          {currentRoutine && (
            <div className="flex items-center space-x-2">
              <Progress value={calculateProgress()} className="w-24" />
              <span className="text-sm text-ojas-text-secondary">{calculateProgress()}% complete</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {currentRoutine ? (
          <div className="space-y-4">
            {/* Daily Summary */}
            <Card className="border-ojas-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-ojas-primary" />
                  <span>Daily Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-ojas-primary">{currentRoutine.completed_tasks.length}</div>
                    <div className="text-sm text-ojas-text-secondary">Completed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-ojas-primary">{sortedTasks.length}</div>
                    <div className="text-sm text-ojas-text-secondary">Total Tasks</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-ojas-primary">{calculateProgress()}%</div>
                    <div className="text-sm text-ojas-text-secondary">Progress</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tasks */}
            <div className="space-y-3">
              {sortedTasks.map((task) => {
                const isCompleted = currentRoutine.completed_tasks.includes(task.id);
                return (
                  <Card key={task.id} className={`border-ojas-border border-l-4 ${getPriorityColor(task.priority)} ${isCompleted ? 'opacity-60' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleTask(task.id)}
                            className="p-1 mt-1"
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <Circle className="w-5 h-5 text-ojas-text-secondary" />
                            )}
                          </Button>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className={`font-medium ${isCompleted ? 'line-through text-ojas-text-secondary' : 'text-ojas-text-primary'}`}>
                                {task.title}
                              </h3>
                              <span className="text-lg">{getCategoryIcon(task.category)}</span>
                              <Badge className={getCategoryColor(task.category)}>
                                {task.category}
                              </Badge>
                            </div>
                            {task.description && (
                              <p className="text-sm text-ojas-text-secondary mb-2">{task.description}</p>
                            )}
                            <div className="flex items-center space-x-4 text-sm text-ojas-text-secondary">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{task.time}</span>
                              </div>
                              <Badge variant="outline" className={`text-xs ${
                                task.priority === 'high' ? 'border-red-300 text-red-600' :
                                task.priority === 'medium' ? 'border-yellow-300 text-yellow-600' :
                                'border-green-300 text-green-600'
                              }`}>
                                {task.priority} priority
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {sortedTasks.length === 0 && (
              <div className="text-center py-12">
                <Target className="w-12 h-12 text-ojas-text-secondary mx-auto mb-4" />
                <h3 className="text-lg font-medium text-ojas-text-primary mb-2">No tasks for today</h3>
                <p className="text-ojas-text-secondary mb-4">Add your first task to get started</p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-ojas-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-ojas-text-primary mb-2">No routine for this date</h3>
            <p className="text-ojas-text-secondary mb-4">Create your daily routine to get started</p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Task
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyRoutinesPage;