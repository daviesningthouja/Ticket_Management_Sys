//import axios from 'axios';
import api from './apiConfig';
//import { getUser } from '../utils/authUtils';

export const getUserProfile = async () => {
    try{
        const res = await api.get('/user/profile');
        return res.data;
    }catch(err){
        console.error('error while getting profile', err)
        throw err;
    }
}

export const searchUser = async(data) => {
    try{
        const res = await api.get("/user/search",{
            params: {userName : data}
        })
        const searchitem = res.data;
        console.log(searchitem);
        return searchitem;
    }catch(err){
    console.error("Error while searching event OR event not found", err);
    throw err; 
    }
}

export const editUserProfile = async (data) => {
    try{
        const res = await api.put('/user/profile/edit', data);
        return res.data;
    }catch(err){
        console.error("error while updating profile", err);
        throw err;
    }
}

export const changePassword = async ({CurrentPassword, NewPassword,ConfirmPassword }) => {
     try{
        const res = await api.put('/auth/change-password', {CurrentPassword, NewPassword,ConfirmPassword });
        console.log(res.data)
        return res.data;
        
    }catch(err){
        console.error("error while updating profile", err);
        throw err;
    }
}

//admin or organizer
export const deleteUser = async (id) => {
    try{
        const res = await api.delete(`/user/acc/delete/${id}`)
        return res.data;
    }catch(err){
        console.error("error while deleting profile", err);
        throw err;
    }
}

export const getUserList = async () =>{
    try{
        const res = await api.get(`/users/list`)
        return res.data;
    }catch(err){
        console.error("error while listing user", err);
        throw err;
    } 
} 

export const getUserByID = async (id) =>{
    try{
        const res = await api.get(`/user/${id}`)
        return res.data;
    }catch(err){
        console.error("error while fetching user by ID", err);
        throw err;
    } 
} 