import api from "./apiConfig";


//user
export const bookTicket = async (FormData) => {
    try{
        const res = api.post('/ticket/book', FormData);
        return res.data;
    }catch(err){
        console.error("error while booking ticket", err);
        throw err;
    }
}

export const getUserTicket = async () => {
    try{
        const res = api.get('/ticket/MyTicket');
        return res.data;
    }catch(err){
        console.error("error while getting user ticket",err);
        throw err;
    }
} 

//organizer
export const getTicketByUserID = async (userId) => {
    try{
        const res = api.get(`/ticket/user/${userId}`);
        return res.data;
    }catch(err){
        console.error('error while fetching ticket by userid', err);
        throw err;
    }
} 

export const getTicketByEventId = async (eventId) => {
    try{
        const res = api.get(`/ticket/event/${eventId}`);
        return res.data;
    }catch(err){
         console.error('error while fetching ticket by eventid', err);
        throw err;
    }
}

//Admin 
export const getTicketList = async () => {
    try{
        const res = api.get(`/ticket/list`);
        return res.data;
    }catch(err){
        console.error('error while fetching ticket list', err);
        throw err;
    }
}

export const getTicketByID = async (id) => {
    try{
        const res = api.get(`/ticket/${id}`);
        return res.data;
    }catch(err){
        console.error('error while fetching ticket by id', err);
        throw err;
    }
}
