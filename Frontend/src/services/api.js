import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';




const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper for unified response handling
const handleResp = async (fn) => {
    try {
        const response = await fn();
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.detail || 'API request failed'
        };
    }
};

// Calculations (Stateless)
export const calculateBMI = (data) => handleResp(() => api.post('/bmi', data));
export const calculateBMR = (data) => handleResp(() => api.post('/bmr', data));
export const calculateMacros = (data) => handleResp(() => api.post('/macros', data));
export const getAdvice = (category) => handleResp(() => api.get('/advice', { params: { category } }));

// Patients (DB)
export const getPatients = () => handleResp(() => api.get('/api/v1/patients'));
export const getPatient = (id) => handleResp(() => api.get(`/api/v1/patients/${id}`));
export const createPatient = (data) => handleResp(() => api.post('/api/v1/patients', data));
export const updatePatient = (id, data) => handleResp(() => api.put(`/api/v1/patients/${id}`, data));
export const deletePatient = (id) => handleResp(() => api.delete(`/api/v1/patients/${id}`));

// Plans (DB)
export const getPlan = (patientId) => handleResp(() => api.get(`/api/v1/plans/${patientId}`));
export const savePlan = (patientId, data) => handleResp(() => api.post(`/api/v1/plans/${patientId}`, data));

// Clinical Logs (DB)
export const getLogs = (patientId) => handleResp(() => api.get(`/api/v1/logs/${patientId}`));
export const createLog = (data) => handleResp(() => api.post('/api/v1/logs', data));
export const updateLog = (id, data) => handleResp(() => api.put(`/api/v1/logs/${id}`, data));

// Reminders (DB)
export const getReminders = () => handleResp(() => api.get('/api/v1/reminders'));
export const dismissReminder = (id) => handleResp(() => api.delete(`/api/v1/reminders/${id}`));

// Food Exchange (DB)
export const getExchangeList = (category = null) => {
    const url = category ? `/api/v1/exchange-list/category/${category}` : '/api/v1/exchange-list';
    return handleResp(() => api.get(url));
};

export default api;
