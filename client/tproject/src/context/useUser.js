import { useContext } from "react";
import { UserContext } from "..";
import http from "../http"


function useUser() {
    const {setUser,user} = useContext(UserContext);
    const getUser = async () => {
        console.log(user);
    }

    const refreshUser = async () => {
        const res = await http.get("/auth/refresh");
        if (res.status === 200) {
            setUser(res.data.user);
            localStorage.setItem("token", res.data.token)
            console.log("local token refreshed");
        }
    }

    return { user,getUser, refreshUser };
}

export default useUser;