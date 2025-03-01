import React  ,{ lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route,Navigate  } from 'react-router-dom';
const  MainPage =lazy(()=> import('./pages/MainPage'));
const Home = lazy(()=> import('./pages/HomePage'));
const  Admin = lazy(()=> import('./pages/Adminpage'));
const  DocterList = lazy(()=> import('./components/DoctorList/index'));
const  DocterPage = lazy(()=> import('./pages/DoctorPage'));
const  AppointmentPage = lazy(()=> import('./pages/AppointmentPage'));
const  ProtectedRoute =lazy(()=> import('./components/protectRoutes'));
const Loading = lazy(()=>import('./components/Loading'));
const NotFound = lazy(()=> import('./components/NotFounded'));
const  Login = lazy(()=>import('./components/login'));

const App = () => {
  return (
    <Router>
      <Suspense fallback={<Loading/>}>
      <Routes>
      <Route path="/" element={<MainPage />}>
      <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<Home />} />
        
          <Route path="admin" element={<ProtectedRoute><Admin /> </ProtectedRoute>} />
          <Route path="doctors" element={<ProtectedRoute><DocterList /> </ProtectedRoute>} />
          <Route path="doctors/:id" element={<ProtectedRoute><DocterPage /> </ProtectedRoute>} />
          <Route path="appointments" element={<ProtectedRoute><AppointmentPage /> </ProtectedRoute>} />
         
        </Route>
        <Route path="/Login" element={<Login />} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
