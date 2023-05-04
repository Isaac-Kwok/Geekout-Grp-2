// User authentication
import axios from 'axios';

// Function to login the user and store the token in the local storage
export async function login(email, password) {
    // Send a POST request to the server
    var response = null

    await axios.post('/auth', {
        email: email,
        password: password
    }).then((res) => {
        response = res;
    }).catch((err) => {
        response = err.response;
    });

    if (response.status != 200) {
        console.log(response.status);
        return response.status;
    }

    // Store the token in the local storage
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('username', response.data.email);
    return true;
}

export default login;