import { Button, Container, Card, CardContent, CardActions, Stack, Typography, TextField } from "@mui/material"
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { Link } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';

function NotFound() {
    return (
        <Container maxWidth="xl" sx={{marginTop: "1rem"}}>
            <Card variant="outlined" sx={{ maxWidth: 500, margin: "auto" }}>
                <CardContent>
                    <Stack direction="row" alignItems={"center"} spacing={2}>
                        <QuestionMarkIcon color="text.secondary" />
                        <Typography sx={{ fontSize: 18, fontWeight: 700 }} color="text.secondary" gutterBottom>
                            Page Not Found
                        </Typography>
                    </Stack>
                    <p>The page you are trying to look for is missing or has been moved.</p>
                </CardContent>
                <CardActions>
                    <Button LinkComponent={Link} size="small" variant="text" color="primary" to="/" startIcon={<HomeIcon/>}> Return Home</Button>
                </CardActions>
            </Card>

        </Container>
    )
}

export default NotFound