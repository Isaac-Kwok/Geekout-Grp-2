import { useEffect, useState } from 'react'
import { Card, CardContent, Grid } from '@mui/material'
import CardTitle from '../../components/CardTitle'
import HistoryIcon from '@mui/icons-material/History';
import { useParams } from 'react-router-dom';
import http from '../../http'
import InfoBox from '../../components/InfoBox';

function ViewTransactionHistoryDetails() {

    const [transaction, setTransaction] = useState({})
    const { id } = useParams()
    const date = new Date()

    const getTransaction = async () => {
        const response = await http.get('/payment/history/' + id)
        setTransaction(response.data)
    }

    useEffect(() => {
        document.title = "EnviroGo - Transaction History"
        getTransaction()
    }, [])

    return (
        <>
            <Card>
                <CardContent>
                    <CardTitle icon={<HistoryIcon />} title="Transaction Details" back="/profile/history" />
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