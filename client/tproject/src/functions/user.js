// User authentication
import jwt_decode from 'jwt-decode';

export function validateAdmin() {
    try {
        const token = localStorage.getItem('token');
        const decoded = jwt_decode(token);
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
        return true;
    } catch {
        return false;
    }
}