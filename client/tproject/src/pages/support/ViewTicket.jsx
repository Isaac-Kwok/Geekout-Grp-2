import React, { useState, useEffect } from 'react'
import { Grid, Card, Container, CardContent, Typography, Box, Select, MenuItem, TextField, Stack, Button, InputLabel, FormControl, Divider, CardActions } from '@mui/material'
import { LoadingButton } from '@mui/lab';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import useUser from '../../context/useUser'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import SendIcon from '@mui/icons-material/Send';
import PageTitle from '../../components/PageTitle'
import CardTitle from '../../components/CardTitle'
import InfoBox from '../../components/InfoBox';
import http from '../../http'
import io from 'socket.io-client'
import SupportChatBox from '../../components/SupportChatBox';

function ViewTicket() {
    const navigate = useNavigate()
    const { id } = useParams()
    const { user } = useUser()
    const [ticket, setTicket] = useState(null)
    const [message, setMessage] = useState([])
    const [closed, setClosed] = useState(false)
    const [socket, setSocket] = useState(null)
    const { enqueueSnackbar } = useSnackbar()
    const categories = {
        "general": "General Enquiry",
        "account": "Account Issues",
        "payment": "Payment Issues",
        "other": "Other Enquiry"
    }

    const getTicket = () => {
        http.get(`/support/ticket/${id}`).then(res => {
            setTicket(res.data)

            if (res.data.status === "Closed") {
                setClosed(true)
            }
        }).catch(err => {
            console.log(err)
            enqueueSnackbar("Error getting ticket", { variant: "error" })
        })
    }


    useEffect(() => {
        getTicket()
        const newSocket = io.connect(import.meta.env.VITE_API_URL, { 
            query: {
                token: localStorage.getItem("token"),
                room: `support_${id}`
            }
        })
        setSocket(newSocket)
        return () => newSocket.close()
    }, [])


    return (
        <>
            <PageTitle title="View Ticket" subtitle="View Support Ticket" />
            <Container maxWidth="xl" sx={{ marginBottom: "1rem" }}>
                <Card>
                    <CardContent>
                        <CardTitle title={"Ticket - " + ticket?.title} icon={<ConfirmationNumberIcon/>} back="/support" />
                        <Grid container spacing={2} mt={"1rem"}>
                            <Grid item xs={12} md>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <InfoBox title="Ticket ID" value={ticket?.id} />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <InfoBox title="Created On" value={new Date(ticket?.createdAt).toLocaleString()} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <InfoBox title="Problem Description" value={ticket?.description} />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <InfoBox title="Ticket Status" boolean={ticket?.status == "Closed"} value={ticket?.status} />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <InfoBox title="Ticket Category" value={categories[ticket?.category]} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Divider orientation="vertical" sx={{ marginX: "1rem" }} flexItem />
                            <Grid item xs={12} md>
                                {socket && <SupportChatBox socket={socket} ticket={id} closed={closed} />}
                            </Grid>
                        </Grid>

                    </CardContent>
                </Card>
            </Container>
        </>
    )
}

export default ViewTicket