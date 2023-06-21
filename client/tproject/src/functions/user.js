// User authentication
import jwt_decode from 'jwt-decode';

export function validateAdmin() {
    try {
        const token = localStorage.getItem('token');
        const decoded = jwt_decode(token);
        console.log(decoded.account_type);
        if (decoded.user.account_type == 0) {
            return true;
        }
        return false;
    } catch {
        return false;
    }
}

export function validateUser() {
    try {
        const token = localStorage.getItem('token');
        const decoded = jwt_decode(token);
        console.log(decoded.account_type);
        return true;
    } catch {
        return false;
    }
}