import React, { useState } from 'react';
import logo from './logo.png';
import EmployeeList from './EmployeeList';  // Import the new component

function Home() {
  const [activeTab, setActiveTab] = useState('Home');
  const name = localStorage.getItem('username').replace(/"/g, ''); 
  const renderContent = () => {
    switch (activeTab) {
      case 'DashBord':
        return <div>Welcome Admin Panel</div>;
      case 'Employee List':
        return <EmployeeList />;  // Return the component here
      
      case 'Logout':
        return <div>Logout Content</div>;
      default:
        return <div>Welcome Admin Panel</div>;
    }
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#d3d3ff', padding: '10px' }}>
        <img src={logo} alt="Logo" style={{ height: '40px' }} />
        <nav>
          <span onClick={() => setActiveTab('Home')} style={{ cursor: 'pointer', margin: '0 10px' }}>Home</span>
          <span onClick={() => setActiveTab('Employee List')} style={{ cursor: 'pointer', margin: '0 10px' }}>Employee List</span>
          <span onClick={() => setActiveTab('Logout')} style={{ cursor: 'pointer', margin: '0 10px' }}>{name}-Logout</span>
        </nav>
      </header>
      <div style={{ backgroundColor: '#ffff00', padding: '10px', fontWeight: 'bold' }}>
        {activeTab}
      </div>
      <main style={{ padding: '20px', textAlign: 'center' }}>
        {renderContent()}
      </main>
    </div>
  );
}

export default Home;
