import { createSlice } from '@reduxjs/toolkit';

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    filter: 'all',
    searchTerm: '',
  },
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    markAsCompleted: (state, action) => {
      const task = state.tasks.find((task) => task.id === action.payload);
      if (task) task.completed = true;
    },
    editTask: (state, action) => {
      const taskIndex = state.tasks.findIndex(
        (task) => task.id === action.payload.id
      );
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = action.payload;
      }
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
});

export const {
  addTask,
  deleteTask,
  markAsCompleted,
  editTask,
  setFilter,
  setSearchTerm,
} = tasksSlice.actions;

export default tasksSlice.reducer;
