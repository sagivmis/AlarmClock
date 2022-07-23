import React from 'react';
import ClockBoard from '../ClockBoard';
import './App.css';
import SideBar from '../SideBar';
import CurrentTime from '../CurrentTime';

function App() {
  return (
    <div className="App">
      <CurrentTime />
      <ClockBoard />
      {/* <SideBar open={false} /> */}
    </div>
  );
}

export default App;
