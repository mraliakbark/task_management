import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addTask,
  deleteTask,
  markAsCompleted,
  setFilter,
  setSearchTerm,
  editTask,
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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TaskDashboard = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const filter = useSelector((state) => state.tasks.filter);
  const searchTerm = useSelector((state) => state.tasks.searchTerm);

  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });
  const [filterValue, setFilterValue] = useState(filter);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [editedTask, setEditedTask] = useState({});

  const handleAddTask = () => {
    if (newTask.title && newTask.dueDate) {
      dispatch(addTask({ ...newTask, id: uuidv4(), completed: false }));
      setNewTask({ title: '', description: '', dueDate: '' });
    }
  };

  const handleEditTask = () => {
    if (editedTask.title && editedTask.dueDate) {
      dispatch(editTask(editedTask));
      setOpenEditDialog(false);
      setTaskToEdit(null);
    }
  };

  const handleDeleteTask = () => {
    if (taskToDelete) {
      dispatch(deleteTask(taskToDelete));
      setTaskToDelete(null);
    }
    setOpenDeleteDialog(false);
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
        <TextField
          style={{ margin: '10px' }}
          label="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        &nbsp;
        <TextField
          style={{ margin: '10px' }}
          label="Task Description"
          multiline
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        &nbsp;
        <TextField
          style={{ margin: '10px' }}
          type="date"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
        />
        <br />
        <br />
        <Button variant="contained" onClick={handleAddTask}>
          Add Task
        </Button>
      </div>

      {/* Filter Tasks */}
      <div className="filter-container">
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Filter Task</InputLabel>
          <Select
            label="Filter Task"
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
          <Card
            key={task.id}
            variant="outlined"
            sx={{
              marginBottom: '20px',
              padding: '16px',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <CardContent>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {/* Task Info */}
                <div style={{ flex: '1', marginRight: '16px' }}>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <p>
                    Due Date: <em>{task.dueDate}</em>
                  </p>
                </div>

                {/* Buttons Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#50C878',
                      color: 'white',
                      '&:hover': { backgroundColor: '#45b467' },
                    }}
                    onClick={() => dispatch(markAsCompleted(task.id))}
                    disabled={task.completed}
                  >
                    {task.completed ? 'Completed' : 'Mark as Completed'}
                  </Button>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#ff9800',
                        color: 'white',
                        '&:hover': { backgroundColor: '#fb8c00' },
                      }}
                      onClick={() => {
                        setTaskToEdit(task);
                        setEditedTask(task);
                        setOpenEditDialog(true);
                      }}
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#f44336',
                        color: 'white',
                        '&:hover': { backgroundColor: '#d32f2f' },
                      }}
                      onClick={() => {
                        setTaskToDelete(task.id);
                        setOpenDeleteDialog(true);
                      }}
                    >
                      <DeleteIcon/>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>


      {/* Confirmation Dialogs */}
      {/* Delete Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this task?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteTask}>Confirm</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            style={{ margin: '10px' }}
            label="Task Title"
            value={editedTask.title}
            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
          />
          <TextField
            style={{ margin: '10px' }}
            label="Task Description"
            multiline
            value={editedTask.description}
            onChange={(e) =>
              setEditedTask({ ...editedTask, description: e.target.value })
            }
          />
          <TextField
            style={{ margin: '10px' }}
            type="date"
            value={editedTask.dueDate}
            onChange={(e) =>
              setEditedTask({ ...editedTask, dueDate: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEditTask}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TaskDashboard;
