import { Container, Card, CardContent, CardActions, Stack, Typography, TextField } from "@mui/material"
import LoadingButton from '@mui/lab/LoadingButton';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { Navigate } from "react-router-dom";
import { register } from "../functions/user";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [toHome, setToHome] = useState(false);

    useEffect(() => {
        document.title = "Register an account";
    }, []);

    if (toHome === true) {
        return <Navigate to="/" />
    }

    function registerUser() {
        setLoading(true);
        register(email, password, name).then((res) => {
            if (res.status === 200) {
                enqueueSnackbar("Registration successful!", { variant: "success" });
                setToHome(true);
            } else {
                enqueueSnackbar("Registration failed! " + res.data.message, { variant: "error" });
            }
            setLoading(false);
        });
    }

    return (
        <Container maxWidth="xl">
            <Card variant="outlined" sx={{ maxWidth: 500, margin: "auto" }}>
                <CardContent>
                    <Stack direction="row" alignItems={"center"} spacing={2}>
                        <PersonAddIcon color="text.secondary" />
                        <Typography sx={{ fontSize: 18, fontWeight: 700 }} color="text.secondary" gutterBottom>
                            Register
                        </Typography>
                    </Stack>
                    <Stack spacing={2} sx={{ marginTop: 2 }}>
                        <TextField type="email" onChange={(e) => {setEmail(e.target.value)}} fullWidth label="E-mail" variant="outlined" />
                        <TextField type="text" onChange={(e) => {setName(e.target.value)}} fullWidth label="Name" variant="outlined" />
                        <TextField type="password" onChange={(e) => {setPassword(e.target.value)}} fullWidth label="Password" variant="outlined" />
                    </Stack>
                </CardContent>
                <CardActions>
                    <LoadingButton loadingPosition="start" loading={loading} size="small" variant="text" color="primary" onClick={registerUser} startIcon={<AddIcon/>}>Register</LoadingButton>
                </CardActions>
            </Card>

        </Container>
    )
}

export default Register