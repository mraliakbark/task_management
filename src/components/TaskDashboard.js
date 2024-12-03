import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addTask,
  deleteTask,
  markAsCompleted,
  setFilter,
  setSearchTerm,
} from '../redux/tasksSlice';
import {
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

const TaskDashboard = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const filter = useSelector((state) => state.tasks.filter);
  const searchTerm = useSelector((state) => state.tasks.searchTerm);

  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });
  const [filterValue, setFilterValue] = useState(filter);
  const [openDialog, setOpenDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const handleAddTask = () => {
    if (newTask.title && newTask.dueDate) {
      dispatch(addTask({ ...newTask, id: uuidv4(), completed: false }));
      setNewTask({ title: '', description: '', dueDate: '' });
    }
  };

  const handleDeleteTask = () => {
    if (taskToDelete) {
      dispatch(deleteTask(taskToDelete));
      setTaskToDelete(null);
    }
    setOpenDialog(false);
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filterValue === 'completed') return task.completed;
      if (filterValue === 'pending') return !task.completed;
      if (filterValue === 'overdue') return new Date(task.dueDate) < new Date();
      return true;
    })
    .filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div>
      <h1>Task Dashboard</h1>

      {/* Search Bar */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <input
          type="search"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          style={{
            padding: '10px',
            width: '300px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        />
      </div>

      {/* Add Task */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <TextField style={{ margin: '10px' }}
          label="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />&nbsp;
        <TextField style={{ margin: '10px' }}
          label="Task Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />&nbsp;
        <TextField style={{ margin: '10px' }}
          type="date"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
        /><br /><br />
        <Button variant="contained" onClick={handleAddTask}>
          Add Task
        </Button>
      </div>

      {/* Filter Tasks */}
      <div className="filter-container">
        <FormControl>
          <InputLabel>Filter Tasks</InputLabel>
          <Select
            value={filterValue}
            onChange={(e) => {
              setFilterValue(e.target.value);
              dispatch(setFilter(e.target.value));
            }}
          >
            <MenuItem value="all">All Tasks</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="overdue">Overdue</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Task List */}
      <div className="task-list">
        {filteredTasks.map((task) => (
          <Card key={task.id}>
            <CardContent>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Due Date: <em>{task.dueDate}</em></p>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#50C878',
                  color: 'white',

                }}
                onClick={() => dispatch(markAsCompleted(task.id))}
                disabled={task.completed}
              >
                {task.completed ? "Completed" : "Mark as Completed"}
              </Button>
              <br />

              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#f44336',
                  color: 'white',
                  '&:hover': { backgroundColor: '#d32f2f' },
                }}
                onClick={() => {
                  setTaskToDelete(task.id);
                  setOpenDialog(true);
                }}
              >
                Delete
              </Button>


            </CardContent>
          </Card>
        ))}
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        className="custom-dialog"
      >
        <DialogTitle className="dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent className="dialog-content">
          <p>Are you sure you want to delete this task?</p>
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={() => setOpenDialog(false)} className="cancel-btn">
            Cancel
          </Button>
          <Button onClick={handleDeleteTask} className="confirm-btn">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TaskDashboard;
