import './App.css';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import Homescreen from './screen/Homescreen';
import Room from './components/Room';
import Bookingscreen from './screen/Bookingscreen';
import LoginScreen from './screen/LoginScreen';
import RegisterScreen from './screen/RegisterScreen';

function App() {
  return (
    <>
      <Navbar />
      <Room/>
      <Routes>
        <Route path="/home" element={<Homescreen />} />
        <Route path="/book/:roomid" element={<Bookingscreen/>}/>
        <Route path="/login" element={<LoginScreen/>}/>
        <Route path="/register" element={<RegisterScreen/>}/>
        
      </Routes>
    </>
  );
}

export default App;