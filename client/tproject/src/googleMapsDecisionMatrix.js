import axios from "axios";

const decisionMatrix = axios.create({
    baseURL: "https://maps.googleapis.com/maps/api/distancematrix/",
    headers: {
        "Content-Type": "application/json",
        "Allow-Control-Allow-Origin": "http://localhost:3000/",
        "Access-Control-Allow-Headers": "X-Requested-With"
    },
});


export default decisionMatrix;