import React,{ useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login'
import Main from './pages/Main'

function App() {
  const [location, setLocation] = useState('/')
  const handleLocation = (value) => {
    if (location !== value)
      setLocation(value);
  }
  useEffect(()=>{
    console.log('current location:', location);
  },[location]);

  return (
    <Routes>
      <Route exact path="/" element={<Login HandleLocation={handleLocation}/>} />
      <Route path="/main" element={<Main HandleLocation={handleLocation}/>} />
    </Routes>
  );
}

export default App;
