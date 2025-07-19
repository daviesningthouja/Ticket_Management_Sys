import api from "./apiConfig";


//user
export const bookTicket = async (FormData) => {
    try{
        const res = await api.post('/ticket/book', FormData);
        //console.log(res,res.data);
        return res.data;
    }catch(err){
        console.error("error while booking ticket", err);
        throw err;
    }
}

export const getUserTicket = async () => {
    try{
        const res = await api.get('/ticket/MyTicket');
        //console.log(res)
        return res.data;
    }catch(err){
        console.error("error while getting user ticket",err);
        throw err;
    }
} 

//organizer
export const getTicketByUserID = async (userId) => {
    try{
        const res = await api.get(`/ticket/user/${userId}`);
        return res.data;
    }catch(err){
        console.error('error while fetching ticket by userid', err);
        throw err;
    }
} 

export const getTicketByEventId = async (eventId) => {
    try{
        const res = await api.get(`/ticket/event/${eventId}`);
        return res.data;
    }catch(err){
         console.error('error while fetching ticket by eventid', err);
        throw err;
    }
}

//Admin 
export const getTicketList = async () => {
    try{
        const res = await api.get(`/ticket/list`);
        return res.data;
    }catch(err){
        console.error('error while fetching ticket list', err);
        throw err;
    }
}

export const getTicketByID = async (id) => {
    try{
        const res = await api.get(`/ticket/${id}`);
        return res.data;
    }catch(err){
        console.error('error while fetching ticket by id', err);
        throw err;
    }
}
