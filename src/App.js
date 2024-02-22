import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = 'http://localhost:3000'; // Update with your API server URL

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);
  

  const fetchTasks = async () => {
    try {
      console.log();
      const response = await axios.get(`${API_BASE_URL}/tasks`);
      setTasks(response.data);
      console.log('response.data', response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
    }
  };

  const addTask = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/tasks`, newTask);
      setTasks([...tasks, response.data]);
      setNewTask({ title: '', description: '' });
      toast('Task added successfully');

    } catch (error) {
      console.error('Error adding task:', error);
      toast('Error adding task');
    }
  };

  const toggleTaskStatus = async (taskId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}`);
      console.log(taskId);

      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === taskId ? response.data : task))
      );
      toast('Task status updated successfully');

    fetchTasks();

    } catch (error) {
      console.error('Error updating task status:', error);
      toast('Error updating task status');
    }
  };

  const deleteTask = async (taskId) => {
    if (!taskId) {
      console.error('Invalid taskId:', taskId);
      return;
    }
  
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      toast('Task deleted successfully');
      fetchTasks();
    } catch (error) {
      console.error('Invalid taskId:', taskId);
      console.error('Error deleting task:', error);
      toast('Error deleting task');
    }
  };
  

  return (
    <div className="container mx-auto my-8">
      
      <h1 className="text-3xl font-bold mb-4">Task Manager</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={(e) => { e.preventDefault(); addTask(); }} className="mb-4">
        <input
          type="text"
          placeholder="Task title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="p-2 border border-gray-300 mr-2"
        />
        <input
          type="text"
          placeholder="Task description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          className="p-2 border border-gray-300 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">Add Task</button>
      </form>
      <table className="border-collapse w-full mb-4">
  <thead>
    <tr className="bg-gray-200">
      <th className="border p-2">Title</th>
      <th className="border p-2">Description</th>
      <th className="border p-2">Status</th>
      <th className="border p-2">Actions</th>
    </tr>
  </thead>
  <tbody>
    {tasks.map((task) => (
      <tr key={task._id} className="border">
        <td className="border p-2 font-bold">{task.title}</td>
        <td className="border p-2 text-gray-600">{task.description}</td>
        <td className={`border p-2 ${task.completed ? 'text-green-500' : 'text-red-500'}`}>
  {task.completed ? <div className="custom-chip background-green">Complete</div> : <div className="custom-chip background-red">Pending</div>}
</td>

        <td className="border p-2">
          <button
            onClick={() => toggleTaskStatus(task._id)}
            className={`bg-${task.completed ? 'red' : 'green'}-500 text-white p-2 mr-2`}
          >
            {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
          </button>
          <button
            onClick={() => deleteTask(task._id)}
            className="bg-red-500 text-white p-2 delete-task-btn"
          >
            Delete
          </button>
          
        </td>
      </tr>
    ))}
  </tbody>
</table>
<ToastContainer />
    </div>
  );
}

export default App;


