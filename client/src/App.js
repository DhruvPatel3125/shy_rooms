import './App.css';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import Homescreen from './screen/Homescreen';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/home" element={<Homescreen />} />
      
      </Routes>
    </>
  );
}

export default App;