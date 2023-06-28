import { useEffect, useState } from 'react'
import { Box, Card, CardContent, CardActions, Typography, Button, Stack, Grid, Divider, TextField } from '@mui/material'
import InfoBox from '../../components/InfoBox'
import CardTitle from '../../components/CardTitle'
import LockIcon from '@mui/icons-material/Lock';
import KeyIcon from '@mui/icons-material/Key';
import SecurityIcon from '@mui/icons-material/Security';

function ViewLogins() {
    useEffect(() => {
        document.title = "EnviroGo - Social Logins & 2FA"
    }, [])

    return (
        <>
            <Stack direction="column" spacing={2}>
                <Card>
                    <CardContent>
                        <CardTitle icon={<SecurityIcon />} title="2-Factor Authentication" />
                        <Box marginY={"1rem"}>
                            <Typography variant="body">
                                2-Factor Authentication (2FA) is a security feature that adds an extra layer of security to your account. When you log in, you will be required to enter a 6-digit code sent to your email address.
                            </Typography>
                        </Box>
                    </CardContent>
                    <CardActions>
                        <Button variant="text" color="primary" startIcon={<LockIcon />}>Enable 2FA</Button>
                    </CardActions>
                </Card>
                <Card>
                    <CardContent>
                        <CardTitle icon={<KeyIcon />} title="Link Social Logins" />
                        <Grid container marginTop={"1rem"} alignItems={"center"}>
                            <Grid item xs={12} sm marginBottom={["1rem", 0]}>
                                <Box component="form" display="flex" alignItems={"center"}>
                                    <InfoBox flexGrow={1} title="Google Account" value={"Not Linked"} boolean={false} />
                                    <Button variant="text" color="primary">Link</Button>
                                </Box>
                            </Grid>
                            <Divider orientation="vertical" sx={{ marginX: "1rem" }} flexItem />
                            <Grid item xs={12} sm>
                                <Box component="form" display="flex" alignItems={"center"}>
                                    <InfoBox flexGrow={1} title="Facebook Account" value={"Not Linked"} boolean={false} />
                                    <Button variant="text" color="primary">Link</Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Stack>
        </>
    )
}

export default ViewLogins