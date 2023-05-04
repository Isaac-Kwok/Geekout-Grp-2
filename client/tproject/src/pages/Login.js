import { Button, Container, Card, CardContent, CardActions, Stack, Typography, TextField } from "@mui/material"
import LoadingButton from '@mui/lab/LoadingButton';
import LoginIcon from '@mui/icons-material/Login';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { Navigate } from "react-router-dom";
import login from "../functions/user";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [toHome, setToHome] = useState(false);

    useEffect(() => {
        document.title = "Login";
    }, []);

    if (toHome === true) {
        return <Navigate to="/" />
    }

    function loginUser() {
        setLoading(true);
        login(email, password).then((res) => {
            if (res === true) {
                enqueueSnackbar("Login successful!", { variant: "success" });
                setToHome(true);
            } else {
                enqueueSnackbar("Login failed! Check your username and password.", { variant: "error" });
            }
            setLoading(false);
        });
    }

    return (
        <Container maxWidth="xl">
            <Card variant="outlined" sx={{ maxWidth: 500, margin: "auto" }}>
                <CardContent>
                    <Stack direction="row" alignItems={"center"} spacing={2}>
                        <LoginIcon color="text.secondary" />
                        <Typography sx={{ fontSize: 18, fontWeight: 700 }} color="text.secondary" gutterBottom>
                            Login
                        </Typography>
                    </Stack>
                    <Stack spacing={2} sx={{ marginTop: 2 }}>
                        <TextField type="email" onChange={(e) => {setEmail(e.target.value)}} fullWidth label="E-mail" variant="outlined" />
                        <TextField type="password" onChange={(e) => {setPassword(e.target.value)}} fullWidth label="Password" variant="outlined" />
                    </Stack>
                </CardContent>
                <CardActions>
                    <LoadingButton loadingPosition="start" loading={loading} size="small" variant="text" color="primary" onClick={loginUser} startIcon={<LoginIcon/>}>Login</LoadingButton>
                    <Button size="small" variant="text" color="primary" href="/" startIcon={<AddIcon/>}>Register</Button>
                </CardActions>
            </Card>

        </Container>
    )
}

export default Login