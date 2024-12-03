import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import store from "./redux/store";
import TaskDashboard from "./components/TaskDashboard";
import { Navigate } from 'react-router-dom';
import TaskDetails from "./components/TaskDetails";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/tasks" />} />
          <Route path="/tasks" element={<TaskDashboard />} />
          <Route path="/tasks/:id" element={<TaskDetails />} />
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>
);
// reportWebVitals();
