import axios from "axios";

const geocoder = axios.create({
    baseURL: "https://maps.googleapis.com/maps/api/geocode",
    headers: {
        "Content-Type": "application/json",
    },
});


export default geocoder;