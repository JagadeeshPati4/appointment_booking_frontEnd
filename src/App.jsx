import React from 'react';
import { BrowserRouter as Router, Routes, Route,Navigate  } from 'react-router-dom';
import MainPage from './pages/MainPage';
import Home from './pages/HomePage';
import Admin from './pages/Adminpage';
import DocterList from './components/DoctorList/index'
import DocterPage from './pages/DoctorPage'
import AppointmentPage from './pages/AppointmentPage'

import Login from './components/login'

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<MainPage />}>
      <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<Home />} />
          <Route path="admin" element={<Admin />} />
          <Route path="doctors" element={<DocterList />} />
          <Route path="doctors/:id" element={<DocterPage />} />
          <Route path="appointments" element={<AppointmentPage />} />
        </Route>
        <Route path="/Login" element={<Login />} />
       
      </Routes>
    </Router>
  );
};

export default App;
