import React, {useState, useEffect, useRef} from 'react'
import { Card, CardContent, Box, Stack, Typography, Divider, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab';
import CardTitle from './CardTitle'
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import SendIcon from '@mui/icons-material/Send';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
import * as Yup from "yup";
import http from '../http'
import MessageBox from './MessageBox';
import useUser from '../context/useUser';

function SupportChatBox({ socket, ticket, isAdmin, closed }) {

    const [connected, setConnected] = useState(false)
    const [sendLoading, setSendLoading] = useState(false)
    const { enqueueSnackbar } = useSnackbar()
    const [messages, setMessages] = useState([])
    const { user } = useUser()

    const getMessages = () => {
        http.get(isAdmin ? `/admin/support/ticket/${ticket}/message` : `/support/ticket/${ticket}/message`).then(res => {
            setMessages(res.data)
        }).catch(err => {
            console.log(err)
            enqueueSnackbar("Error getting messages", { variant: "error" })
        })
    }

    useEffect(() => {
        getMessages()

        socket.on("connect", () => {
            setConnected(true)
        })
    
        socket.on("disconnect", () => {
            setConnected(false)
        })
    
        socket.on("ticket_message", (newMessage) => {
            console.log(newMessage)
            setMessages(prev => [...prev, newMessage])
        })
    }, [])
    
    const sendFormik = useFormik({
        initialValues: {
            message: ""
        },
        validationSchema: Yup.object({
            message: Yup.string().required("Required")
        }),
        onSubmit: (values, { setSubmitting, resetForm }) => {
            setSendLoading(true)
            http.post(isAdmin ? `/admin/support/ticket/${ticket}/message` : `/support/ticket/${ticket}/message`, { message: values.message }).then(res => {
                setSendLoading(false)
            }).catch(err => {
                console.log(err)
                enqueueSnackbar("Error sending message. " + err.response.data.message, { variant: "error" });
                setSendLoading(false)
            })
            resetForm()
        }
    })

    return (
        <Card variant='outlined' sx={{ backgroundColor: "yellow.main" }}>
            <CardContent>
                <CardTitle title="Live Chat" icon={<QuestionAnswerIcon />} />
                <Box height="20rem" sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }} marginTop={"1rem"}>
                    <Stack spacing={2} overflow={"auto"} >
                        {messages.map((message, index) => {
                            if (isAdmin) {
                                return (
                                    <MessageBox key={index} message={message} sender={message.User.account_type == 0} />
                                )
                            } else {
                                return (
                                    <MessageBox key={index} message={message} sender={message.User.id == user.id} />
                                )
                            }
                        })}
                        
                    </Stack>
                    {messages.length == 0 && <Typography variant="body1" textAlign="center" color={"secondary"}>No messages. Start talking here.</Typography>}
                </Box>
                <Divider sx={{ marginY: "1rem" }} />
                <Box component="form" onSubmit={sendFormik.handleSubmit} sx={{ display: "flex" }}>
                    <TextField
                        fullWidth
                        label="Message"
                        name='message'
                        size="small"
                        variant="outlined"
                        sx={{ flexGrow: 1 }}
                        value={sendFormik.values.message}
                        onChange={sendFormik.handleChange}
                        error={sendFormik.touched.message && Boolean(sendFormik.errors.message)}
                        helperText={sendFormik.touched.message && sendFormik.errors.message}
                        disabled={closed}
                    />
                    <LoadingButton disabled={closed} type='submit' loading={sendLoading} startIcon={<SendIcon />} variant="contained" sx={{ marginLeft: "1rem" }}>Send</LoadingButton>
                </Box>
                {connected ? <>
                    <Box display={"flex"} alignItems={"center"} marginTop={"1rem"} color={"green"}>
                        <LinkIcon sx={{ marginRight: "0.5rem" }} />
                        <Typography variant="body2">Connected</Typography>
                    </Box>
                </> : <>
                    <Box display={"flex"} alignItems={"center"} marginTop={"1rem"} color={"error"}>
                        <LinkOffIcon sx={{ marginRight: "0.5rem" }} />
                        <Typography variant="body2">Disconnected</Typography>
                    </Box>
                </>}
            </CardContent>
        </Card>
    )
}

export default SupportChatBox