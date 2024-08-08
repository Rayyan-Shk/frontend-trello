import React, { useState, useEffect } from 'react';

const Board = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const columns = ['To Do', 'In Progress', 'Done'];
  const [draggedTask, setDraggedTask] = useState(null);

  const columnColors = {
    'To Do': 'bg-pink-200',
    'In Progress': 'bg-yellow-200',
    'Done': 'bg-green-200'
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://backend-trello-1.onrender.com/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setErrorMessage('Failed to fetch tasks. Please refresh the page.');
    }
  };

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) {
      setErrorMessage('Task title cannot be empty');
      return;
    }
    setErrorMessage('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://backend-trello-1.onrender.com/api/tasks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTaskTitle.trim(), column: 'To Do' }),
      });
      if (!response.ok) throw new Error('Failed to create task');
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
    } catch (error) {
      console.error('Error creating task:', error);
      setErrorMessage('Failed to create task. Please try again.');
    }
  };

  const handleUpdateTask = async (taskId, newTitle) => {
    if (!newTitle.trim()) {
      setErrorMessage('Task title cannot be empty');
      return;
    }
    setErrorMessage('');
    try {
      const token = localStorage.getItem('token');
      const taskToUpdate = tasks.find(task => task.id === taskId);
      const response = await fetch(`https://backend-trello-1.onrender.com/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...taskToUpdate, title: newTitle.trim() }),
      });
      if (!response.ok) throw new Error('Failed to update task');
      const updatedTask = await response.json();
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
      setErrorMessage('Failed to update task. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://backend-trello-1.onrender.com/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete task');
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      setErrorMessage('Failed to delete task. Please try again.');
    }
  };

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (column) => {
    if (!draggedTask) return;

    const updatedTasks = tasks.map(task => 
      task.id === draggedTask.id ? { ...task, column } : task
    );

    setTasks(updatedTasks);
    setDraggedTask(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://backend-trello-1.onrender.com/api/tasks/${draggedTask.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...draggedTask, column }),
      });
      if (!response.ok) throw new Error('Failed to update task');
    } catch (error) {
      console.error('Error updating task:', error);
      setErrorMessage('Failed to update task position. Please try again.');
      fetchTasks();
    }
  };

  return (
    <div className="p-6 bg-gray-800 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Board</h1>
      <div className="mb-6 flex justify-center">
        <div className="flex items-center space-x-2 w-full max-w-md">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => {
              setNewTaskTitle(e.target.value);
              setErrorMessage('');
            }}
            placeholder="Enter new task"
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
          />
          <button 
            onClick={handleCreateTask}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Add Task
          </button>
        </div>
      </div>
      {errorMessage && (
        <div className="mb-4 max-w-md mx-auto p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          <p>{errorMessage}</p>
        </div>
      )}
      <div className="flex flex-wrap gap-4 justify-center">
        {columns.map(column => (
          <div 
            key={column}
            className={`flex-1 min-w-[300px] max-w-md ${columnColors[column]} rounded-lg shadow-md overflow-hidden`}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column)}
          >
            <h2 className="bg-opacity-50 bg-white font-bold text-lg p-4">{column}</h2>
            <div className="p-4">
              {tasks
                .filter(task => task.column === column)
                .map(task => (
                  <div
                    key={task.id}
                    draggable={editingTask !== task.id}
                    onDragStart={() => handleDragStart(task)}
                    className="p-3 mb-2 bg-white bg-opacity-80 rounded-lg shadow-sm cursor-move hover:shadow-md transition-shadow duration-200 ease-in-out"
                  >
                    {editingTask === task.id ? (
                      <input
                        type="text"
                        value={task.title}
                        onChange={(e) => setTasks(tasks.map(t => t.id === task.id ? {...t, title: e.target.value} : t))}
                        onBlur={() => handleUpdateTask(task.id, task.title)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleUpdateTask(task.id, task.title);
                          }
                        }}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                        autoFocus
                      />
                    ) : (
                      <p className="font-medium text-gray-800 mb-2">{task.title}</p>
                    )}
                    <div className="flex justify-end space-x-2">
                      {editingTask !== task.id && (
                        <button
                          onClick={() => setEditingTask(task.id)}
                          className="px-2 py-1 text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="px-2 py-1 text-sm text-red-600 hover:text-red-800 focus:outline-none"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
