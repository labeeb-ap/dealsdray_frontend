
import './App.css';
import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage.js';
import Home from './Home.js';
import CreateEmployee from './CreateEmployee.js';

function App() {
  return (
<div>
      <BrowserRouter>
        <Routes>
          
          <Route path="/" Component={LoginPage} />
          <Route path="/Home" Component={Home} />
          <Route path="/CreateEmployee" Component={CreateEmployee} />
          
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
