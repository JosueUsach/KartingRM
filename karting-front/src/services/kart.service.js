import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE,
});

const getAll = () => {
    return axios.get('/api/kart/');
}

export default getAll;