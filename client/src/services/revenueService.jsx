import api from './apiConfig.jsx';

export const getRevenueSummary = async () => {

    try{
        const response = await api.get('revenue-summary')
        return response.data;
    } catch(err){
        console.error("Error fetching Revenue summary:", err)
        throw err;
    }
}

export const getAllRevenueSummary = async (range = '30d') => {
  const res = await api.get(`ticket/revenue/summary?range=${range}`);
  return res.data;
};