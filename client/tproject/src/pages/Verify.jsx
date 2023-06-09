import {useEffect} from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import http from '../http'
import { useSnackbar } from 'notistack'

function Verify() {
    const [searchParams] = useSearchParams()
    const token = searchParams.get("token")
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        http.post("/auth/verify", { token: token }).then((res) => {
            if (res.status === 200) {
                enqueueSnackbar("E-mail Verification successful!", { variant: "success" })
            } else {
                enqueueSnackbar("E-mail Verification failed!", { variant: "error" })
            }
        })
    }, [])
    
    return (
        <Navigate to={`/login`} />
    )
}

export default Verify