import axios from "axios";

const decisionMatrix = axios.create({
    baseURL: "https://maps.googleapis.com/maps/api/distancematrix/",
    headers: {
        "Content-Type": "application/json",
        "Allow-Control-Allow-Origin": "http://localhost:3000/",
        "Access-Control-Allow-Methods": "POST,GET,OPTIONS,PUT,DELETE",
        "Access-Control-Allow-Headers": "Content-Type, X-Auth-Token, Origin, Authorization"
    },
});


export default decisionMatrix;