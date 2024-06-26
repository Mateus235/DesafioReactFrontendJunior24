import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import "./App.css";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [editIndex, setEditIndex] = useState(-1);
  const location = useLocation();

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      const newTask = {
        title: inputValue.trim(),
        completed: false,
      };
      setTasks([newTask, ...tasks]);
      setInputValue("");
    }
  };

  const toggleTaskCompletion = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const handleTaskRemoval = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  const handleDoubleClick = (index) => {
    setEditIndex(index);
  };

  const handleEditChange = (e, index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].title = e.target.value;
    setTasks(updatedTasks);
  };

  const handleEditBlur = (index) => {
    setEditIndex(-1);
  };

  const handleMarkAllCompleted = () => {
    const updatedTasks = tasks.map((task) => ({
      ...task,
      completed: true,
    }));
    setTasks(updatedTasks);
  };

  const handleClearCompleted = () => {
    const updatedTasks = tasks.filter((task) => !task.completed);
    setTasks(updatedTasks);
  };

  const filterTasks = () => {
    if (location.pathname === "/active") {
      return tasks.filter((task) => !task.completed);
    } else if (location.pathname === "/completed") {
      return tasks.filter((task) => task.completed);
    }
    return tasks;
  };

  const remainingTasksCount = tasks.filter((task) => !task.completed).length;

  return (
    <div className="task-list">
      <h2>Lista de Tarefas</h2>
      <div className="task-input">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Digite uma nova tarefa"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddTask(e);
            }
          }}
        />
        <button onClick={handleAddTask}>Adicionar</button>
        <button onClick={handleMarkAllCompleted}>
          Marcar todas como concluídas
        </button>
      </div>
      <ul>
        {filterTasks().map((task, index) => (
          <li key={index} className={task.completed ? "completed" : ""}>
            {editIndex === index ? (
              <input
                type="text"
                value={task.title}
                onChange={(e) => handleEditChange(e, index)}
                onBlur={() => handleEditBlur(index)}
                autoFocus
              />
            ) : (
              <div
                className="task-item"
                onDoubleClick={() => handleDoubleClick(index)}
              >
                <span onClick={() => toggleTaskCompletion(index)}>
                  {task.title}
                </span>
                <button
                  className="remove-btn"
                  onClick={() => handleTaskRemoval(index)}
                >
                  Remover
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="task-footer">
        <span className="remaining-tasks">{remainingTasksCount} itens restantes</span>
        <button className="clear-completed" onClick={handleClearCompleted}>
          Limpar concluídos ({tasks.filter((task) => task.completed).length})
        </button>
      </div>
      <div className="filters">
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>Todos</Link>
        <Link to="/active" className={location.pathname === "/active" ? "active" : ""}>Ativos</Link>
        <Link to="/completed" className={location.pathname === "/completed" ? "active" : ""}>Concluídos</Link>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TaskList />} />
        <Route path="/active" element={<TaskList />} />
        <Route path="/completed" element={<TaskList />} />
      </Routes>
    </Router>
  );
};

export default App;
