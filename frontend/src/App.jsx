import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import axios from 'axios';
import Layout from './Layount';
import Index from './components/Index';
import { UserContextProvider } from './userContext';
import Accommodation from './components/Accomodation';
import AddPlace from './components/formComponents/AddPlace';
import AccountNav from './components/AccouuntNav';
import PlacePage from './components/PlacePage';
import UserBooking from './components/UserBooking';
import BookingPage from './components/BookingPage';
import Favourites from './components/Favourites';

axios.defaults.baseURL = `${import.meta.env.VITE_API_DOMAIN}/api`;
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
            <Route path="update" element={<Register />} />
            <Route path="profile/" element={<AccountNav />} >
              <Route index element={<Profile />} />
              <Route path="accommodations" element={<Accommodation />} />
              <Route path="accommodations/new" element={<AddPlace />} />
              <Route path="accommodations/:id" element={<AddPlace />} />
              <Route path="bookings" element={<UserBooking />} />
              <Route path="bookings/:id" element={<BookingPage />} />
              <Route path="favourites" element={<Favourites />} />
            </Route>
            <Route path='place/:id' element={<PlacePage />} />
          </Route>
        </Routes>
      </UserContextProvider>
    </div >
  );
}

export default App;