import axios from 'axios';

const API_URL = 'https://appointment-booking-backend-h0lv.onrender.com/';

// Create an Axios instance with token
const api = (token) =>
  axios.create({
    baseURL: API_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    withCredentials: true, // Ensures cookies are sent
  });

// Doctors APIs (Requires token)
export const getDoctors = async (token,userDetails) => {
  const response = await api(token).get('/doctors',{
    data: { user: userDetails }, // Send user details in request body
  });
  return response;
};

export const getDoctorSlots = async (doctorId, date, token) => {
  const response = await api(token).get(`/doctors/${doctorId}/slots`, { params: { date } });
  return response;
};

export const getDoctor = async (doctorId, token) => {
  const response = await api(token).get(`/doctors/${doctorId}`);
  return response;
};
// Appointments APIs (Requires token)
export const createAppointment = async (appointmentData, token) => {
  console.log('appointmentData in api',appointmentData);
  const response = await api(token).post('/appointments/createAppointment', appointmentData);
  return response;
};

export const getAppointments = async (token) => {
  const response = await api(token).get('/appointments');
  return response;
};

export const updateAppointment = async (appointmentId, appointmentData, token) => {
  const response = await api(token).put(`/appointments/updateAppointment/${appointmentId}`, appointmentData);
  return response;
};

export const deleteAppointment = async (appointmentId, token) => {
  console.log('appointmentId in delete api',appointmentId);
  const response = await api(token).delete(`/appointments/deleteAppointment/${appointmentId}`);
  return response;
};

// User Authentication APIs (No token required)
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/users/register`, userData, { withCredentials: true });
  return response;
};

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/users/login`, credentials, { withCredentials: true });
  return response;
};

// Admin APIs for Doctors (Requires token)
export const addDoctor = async (doctorData, userDetails, token) => {
  const response = await api(token).post('/admin/doctors/create', {
    ...doctorData,
    user: userDetails, // Include user details
  });
  return response;
};

export const updateDoctor = async (doctorId, doctorData, userDetails, token) => {
  const response = await api(token).put(`/admin/doctors/update/${doctorId}`, {
    ...doctorData,
    user: userDetails, // Include user details
  });
  return response;
};

export const deleteDoctor = async (doctorId, userDetails, token) => {
  const response = await api(token).delete(`/admin/doctors/delete/${doctorId}`, {
    data: { user: userDetails }, // Send user details in request body
  });
  return response;
};


export const getAllDoctors = async (userDetails,token) => {
  const response = await api(token).get('/doctors',{
    data: { user: userDetails }, // Send user details in request body
  });
  return response;
};





