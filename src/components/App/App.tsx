import React from 'react';
import ClockBoard from '../ClockBoard';
import './App.css';
import SideBar from '../SideBar';
import CurrentTime from '../CurrentTime';
import AdsController from '../AdsController/AdsController';

function App() {
  return (
    <div className="App">
      <CurrentTime />
      <ClockBoard />
      {/* <SideBar open={false} /> */}
      <AdsController />
    </div>
  );
}

export default App;
