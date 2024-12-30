import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5001/api';
axios.defaults.withCredentials = true;                  // to store cookies in browser

function App() {
  return (
    <div className='flex flex-col'>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;