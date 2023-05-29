import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
        "Allow-Control-Allow-Origin": "*"
    },
});

export default instance;