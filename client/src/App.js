import './App.css';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import Homescreen from './screen/Homescreen';
import Bookingscreen from './screen/Bookingscreen';
import LoginScreen from './screen/LoginScreen';
import RegisterScreen from './screen/RegisterScreen';
import ProfileScreen from './screen/ProfileScreen';
import Adminscreen from './screen/Adminscreen';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homescreen />} />
        <Route path="/home" element={<Homescreen />} />
        <Route path="/book/:roomid/:fromdate/:todate" element={<Bookingscreen/>}/>
        <Route path="/login" element={<LoginScreen/>}/>
        <Route path="/register" element={<RegisterScreen/>}/>
        <Route path="/profile" element={<ProfileScreen/>}/>
        <Route path="/admin" element={<Adminscreen/>}/>

      </Routes>
    </>
  );
}

export default App;