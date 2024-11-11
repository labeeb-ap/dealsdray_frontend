
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage.js';

function App() {
  return (
<div>
      <BrowserRouter>
        <Routes>
          
          <Route path="/" Component={LoginPage} />
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
