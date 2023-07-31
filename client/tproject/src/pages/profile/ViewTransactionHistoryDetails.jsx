import { useEffect, useState } from 'react'
import { Box, Card, CardContent, Grid, Button } from '@mui/material'
import CardTitle from '../../components/CardTitle'
import HistoryIcon from '@mui/icons-material/History';
import { useParams, useNavigate } from 'react-router-dom';
import http from '../../http'
import InfoBox from '../../components/InfoBox';
import BackIcon from '@mui/icons-material/ArrowBack';

function ViewTransactionHistoryDetails() {

    const [transaction, setTransaction] = useState({})
    const [loading, setLoading] = useState(true)
    const { id } = useParams()
    const date = new Date()
    const navigate = useNavigate()

    const getTransaction = async () => {
        setLoading(true)
        const response = await http.get('/payment/history/' + id)
        setTransaction(response.data)
        setLoading(false)
    }

    useEffect(() => {
        document.title = "EnviroGo - Transaction History"
        getTransaction()
    }, [])

    return (
        <>
            <Button variant="outlined" color="primary" onClick={() => { navigate(-1) }} startIcon={<BackIcon/>}>Back</Button>
            <Card sx={{marginTop: "1rem"}}>
                <CardContent>
                    <CardTitle icon={<HistoryIcon />} title="Transaction Details" />
                    <Grid container spacing={2} marginTop={"1rem"}>
                        <Grid item xs={12} md={6}>
                            <InfoBox title="Transaction ID" value={transaction.id} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <InfoBox title="Transaction Status" value={transaction.status} boolean={transaction.status == "Succeeded" ? true : false} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <InfoBox title="Transaction Date" value={date.toDateString(transaction.createAt)} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <InfoBox title="Transaction Type" value={transaction.type} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <InfoBox title="Last Updated" value={date.toTimeString(transaction.updatedAt)} />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    )
}

export default ViewTransactionHistoryDetails