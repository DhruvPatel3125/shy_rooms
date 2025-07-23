import './App.css';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import Homescreen from './screen/Homescreen';
import Room from './components/Room';

function App() {
  return (
    <>
      <Navbar />
      <Room/>
      <Routes>
        <Route path="/home" element={<Homescreen />} />
      
      </Routes>
    </>
  );
}

export default App;