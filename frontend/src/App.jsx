import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import axios from 'axios';
import Layout from './Layount';
import Index from './components/Index';
import { UserContextProvider } from './userContext';

axios.defaults.baseURL = 'http://localhost:5001/api';
axios.defaults.withCredentials = true;                  // to include cookies with the request

function App() {
  return (
    <div className='flex flex-col'>
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Routes>
      </UserContextProvider>
    </div>
  );
}

export default App;