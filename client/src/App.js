import './App.css';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import Homescreen from './screen/Homescreen';
import Room from './components/Room';
import Bookingscreen from './screen/Bookingscreen';

function App() {
  return (
    <>
      <Navbar />
      <Room/>
      <Routes>
        <Route path="/home" element={<Homescreen />} />
        <Route path="/book/:roomid" element={<Bookingscreen/>}/>
      </Routes>
    </>
  );
}

export default App;