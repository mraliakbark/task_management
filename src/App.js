// src/App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import TaskDashboard from './components/TaskDashboard';
import TaskDetails from './components/TaskDetails';
import { Container } from '@mui/material';

const App = () => {
  return (
    <Container maxWidth="lg">
      <Routes>
        <Route path="/tasks" element={<TaskDashboard />} />
        <Route path="/tasks/:id" element={<TaskDetails />} />
      </Routes>
    </Container>
  );
};

export default App;
