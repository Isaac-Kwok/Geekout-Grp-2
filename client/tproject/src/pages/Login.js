import { Button, Container, Card, CardContent, CardActions, Stack, Typography, TextField } from "@mui/material"
import LoginIcon from '@mui/icons-material/Login';
import { useEffect } from "react";

function Login() {
    useEffect(() => {
        document.title = "Login";
    }, []);

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
                        <TextField fullWidth label="Email" variant="outlined" />
                        <TextField fullWidth label="Password" variant="outlined" />
                    </Stack>
                </CardContent>
                <CardActions>
                    <Button size="small" variant="text" color="primary" href="/">Login</Button>
                    <Button size="small" variant="text" color="primary" href="/">Register</Button>
                </CardActions>
            </Card>

        </Container>
    )
}

export default Login