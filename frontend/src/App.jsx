import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Account from './components/Account';
import axios from 'axios';
import Layout from './Layount';
import Index from './components/Index';
import { UserContextProvider } from './userContext';

axios.defaults.baseURL = `${import.meta.env.VITE_API_DOMAIN}:${import.meta.env.VITE_PORT}/api`;
axios.defaults.withCredentials = true;                  // to include cookies with the request

function App() {
  return (
    <div className='flex flex-col'>
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="account/:subPage?/:action?" element={<Account />} />
          </Route>
        </Routes>
      </UserContextProvider>
    </div>
  );
}

export default App;