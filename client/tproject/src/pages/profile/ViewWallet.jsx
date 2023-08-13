import { useEffect, useContext, useState } from 'react'
import { Container, Box, Card, CardContent, CardActions, Typography, Button, Stack, Grid, Divider, TextField, InputAdornment, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import InfoBox from '../../components/InfoBox'
import CardTitle from '../../components/CardTitle'
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import PaymentsIcon from '@mui/icons-material/Payments';
import TopUpDialog from '../../components/TopUpDialog'
import useUser from '../../context/useUser'
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { Close, Send } from '@mui/icons-material';
import http from '../../http';


function ViewWallet() {

    const { user, refreshUser } = useUser()
    const [topupOpen, setTopupOpen] = useState(false)
    const [withdrawOpen, setWithdrawOpen] = useState(false)
    const [withdrawLoading, setWithdrawLoading] = useState(false)
    const { enqueueSnackbar } = useSnackbar()

    const handleTopupOpen = () => {
        setTopupOpen(true)
    }

    const handleTopupClose = () => {
        setTopupOpen(false)
    }

    const handleWithdrawOpen = () => {
        setWithdrawOpen(true)
    }

    const handleWithdrawClose = () => {
        refreshUser()
        setWithdrawOpen(false)
    }

    const withdrawFormik = useFormik(
        {
            initialValues: {
                amount: "",
            },
            validationSchema: yup.object({
                amount: yup.number().required("Amount is required").min(1, "Amount must be greater than 0").max(1000, "Cannot withdraw more than S$1000 at once").typeError("Amount must be a number"),
            }),
            onSubmit: (data) => {
                setWithdrawLoading(true);
                data.amount = data.amount.trim();
                data.amount = parseFloat(data.amount).toFixed(2)
                http.post("/payment/withdraw", data).then((res) => {
                    if (res.status === 200) {
                        enqueueSnackbar("Withdrawal successful!", { variant: "success" });
                        refreshUser()
                        setWithdrawLoading(false);
                        setWithdrawOpen(false);
                    }
                }).catch((err) => {
                    enqueueSnackbar("Withdrawal failed! " + err.response.data.message, { variant: "error" });
                    setWithdrawLoading(false);
                })
            }
        }
    )


    useEffect(() => {
        document.title = "EnviroGo - Wallet"
    }, [])

    return (
        <>
            <Stack direction="column" spacing={2}>
                <Card>
                    <CardContent>
                        <CardTitle icon={<PaymentsIcon />} title="Cash Wallet" />
                        <Grid container marginTop={"1rem"} alignItems={"center"}>
                            <Grid item xs={12} sm marginBottom={["1rem", 0]}>
                                <Box display="flex" alignItems={"center"}>
                                    <InfoBox flexGrow={1} title="Cash Balance" value={<Typography variant='h5' fontWeight={700}>${user?.cash}</Typography>} />
                                    <Button variant="text" color="primary"onClick={handleTopupOpen}>Top-up</Button>
                                </Box>
                            </Grid>
                            <Divider orientation="vertical" sx={{ marginX: "1rem" }} flexItem />
                            <Grid item xs={12} sm>
                                <Box display="flex" alignItems={"center"}>
                                    <Box flexGrow={1}>
                                        <Typography variant="body" fontWeight={700}>Withdraw Balance</Typography>
                                        <br />
                                        <Typography variant="body" marginTop={"0.25rem"}>Withdraw your balance here.</Typography>
                                    </Box>
                                    <Button variant="text" color="primary" onClick={handleWithdrawOpen}>Withdraw</Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <CardTitle icon={<EnergySavingsLeafIcon />} title="GreenMiles Points" />
                        <Grid container marginTop={"1rem"} alignItems={"center"}>
                            <Grid item xs={12} sm marginBottom={["1rem", 0]}>
                                <Box display="flex" alignItems={"center"}>
                                    <InfoBox flexGrow={1} title="GreenMiles Points" value={<Typography variant='h5' fontWeight={700}>{user?.points} GM</Typography>} />
                                </Box>
                            </Grid>
                            <Divider orientation="vertical" sx={{ marginX: "1rem" }} flexItem />
                            <Grid item xs={12} sm>
                                <Box component="form" display="flex" alignItems={"center"}>
                                    <Box marginRight={"1rem"}>
                                        <Typography variant="body" fontWeight={700}>About GreenMiles</Typography>
                                        <br />
                                        <Typography variant="body" marginTop={"0.25rem"}>GreenMiles is a reward currency given when using our services. Points can be redeemed on the shop.</Typography>
                                    </Box>
                                    <Button variant="text" color="primary" LinkComponent={Link} to="/products">Redeem</Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Stack>
            <TopUpDialog open={topupOpen} onClose={handleTopupClose} />
            <Dialog maxWidth={"sm"} fullWidth open={withdrawOpen} onClose={handleWithdrawClose}>
                <DialogTitle>Withdraw Balance</DialogTitle>
                    <Box component="form" onSubmit={withdrawFormik.handleSubmit}>
                        <DialogContent sx={{ paddingTop: 0 }}>
                            <DialogContentText>
                                Enter the amount you want to withdraw from your wallet.
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="amount"
                                label="Amount to withdraw"
                                type="amount"
                                name="amount"
                                fullWidth
                                variant="standard"
                                value={withdrawFormik.values.amount}
                                onChange={withdrawFormik.handleChange}
                                error={withdrawFormik.touched.amount && Boolean(withdrawFormik.errors.amount)}
                                helperText={withdrawFormik.touched.amount && withdrawFormik.errors.amount}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">S$</InputAdornment>,
                                }}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleWithdrawClose} startIcon={<Close />}>Cancel</Button>
                            <LoadingButton type="submit" loadingPosition="start" loading={withdrawLoading} variant="text" color="primary" startIcon={<Send />}>Withdraw</LoadingButton>
                        </DialogActions>
                    </Box>
            </Dialog>
        </>
    )
}

export default ViewWallet