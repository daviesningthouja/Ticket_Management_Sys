import axios from 'axios';
import api from './apiConfig';


export const loginUser = async (data) => {
    const res = await api.post(`auth/login`, data);
    return res.data;
};

export const registerUser = async (data) => {
    const res = await axios.post(`/auth/register`, data)
    return res.data;
}

