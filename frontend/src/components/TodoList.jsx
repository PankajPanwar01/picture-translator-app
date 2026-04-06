
import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Trash2, Plus, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/todos');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      toast.error('Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    
    setAdding(true);
    try {
      const response = await fetch('http://localhost:5000/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTodo })
      });
      const todo = await response.json();
      setTodos([todo, ...todos]);
      setNewTodo('');
      toast.success('Task added!');
    } catch (error) {
      toast.error('Failed to add task');
    } finally {
      setAdding(false);
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      const response = await fetch(`http://localhost:5000/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed })
      });
      const updated = await response.json();
      setTodos(todos.map(todo => todo._id === id ? updated : todo));
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/todos/${id}`, {
        method: 'DELETE'
      });
      setTodos(todos.filter(todo => todo._id !== id));
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  if (loading) {
    return (
      <div className="glass-card p-6 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-white/50 mx-auto" />
      </div>
    );
  }

  const activeTodos = todos.filter(t => !t.completed);
  const completedTodos = todos.filter(t => t.completed);

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5" />
        To-Do List ({activeTodos.length} pending)
      </h2>
      
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new task..."
          className="glass-input flex-1"
        />
        <button
          onClick={addTodo}
          disabled={adding}
          className="px-4 py-2 bg-purple-500 rounded-xl hover:bg-purple-600 transition disabled:opacity-50"
        >
          {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
        </button>
      </div>
      
      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {activeTodos.map(todo => (
          <TodoItem key={todo._id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />
        ))}
        
        {completedTodos.length > 0 && (
          <>
            <div className="border-t border-white/20 my-4 pt-3">
              <span className="text-white/40 text-sm">Completed</span>
            </div>
            {completedTodos.map(todo => (
              <TodoItem key={todo._id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />
            ))}
          </>
        )}
        
        {todos.length === 0 && (
          <p className="text-white/40 text-center py-8">No tasks yet. Add one above!</p>
        )}
      </div>
    </div>
  );
}

function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-xl transition-all ${
      todo.completed ? 'bg-white/5' : 'bg-white/10'
    }`}>
      <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => onToggle(todo._id, todo.completed)}>
        {todo.completed ? (
          <CheckCircle2 className="w-5 h-5 text-green-400" />
        ) : (
          <Circle className="w-5 h-5 text-white/50 hover:text-purple-400" />
        )}
        <span className={`text-white ${todo.completed ? 'line-through text-white/40' : ''}`}>
          {todo.text}
        </span>
      </div>
      <button onClick={() => onDelete(todo._id)} className="text-white/30 hover:text-red-400 transition">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export default TodoList;