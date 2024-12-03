// src/components/TaskDetails.js
import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, CardContent } from '@mui/material';

const TaskDetails = () => {
  const { id } = useParams();
  const task = useSelector(state => state.tasks.tasks.find(task => task.id === id));

  if (!task) return <div>Task not found</div>;

  return (
    <Card>
      <CardContent>
        <h1>{task.title}</h1>
        <p>{task.description}</p>
        <p>Due Date: {task.dueDate}</p>
        <p>Status: {task.completed ? 'Completed' : 'Pending'}</p>
      </CardContent>
    </Card>
  );
};

export default TaskDetails;
