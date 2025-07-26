import api from "./apiConfig";

export const getAdminDash = async () =>{
    try{
        const res = await api.get('/admin/dashboard')
        return res.data;
    }catch(err){
        console.error('error fetching admin dash:',err)
        throw err;
    }
}