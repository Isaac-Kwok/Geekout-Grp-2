import axios from "axios";
import { useNavigate } from "react-router-dom";

const test = axios.create({
    baseURL: "https://maps.googleapis.com/maps/api/geocode",
    headers: {
        "Content-Type": "application/json",
    },
});


export default test;