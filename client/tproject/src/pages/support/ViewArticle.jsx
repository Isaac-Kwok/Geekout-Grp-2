import React, { useState, useEffect } from 'react'
import { Container, Card, CardContent, Box, Typography, CardMedia } from '@mui/material'
import HelpIcon from '@mui/icons-material/Help';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CardTitle from "../../components/CardTitle";
import PageTitle from '../../components/PageTitle';
import http from '../../http'
import { useSnackbar } from 'notistack'
import { useNavigate, useParams } from 'react-router-dom'
import MDEditor from '@uiw/react-md-editor';

function ViewArticle() {
    const { id } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const imagePath = `${import.meta.env.VITE_API_URL}/support/article/images/`

    const getArticle = () => {
        http.get(`/support/article/${id}`).then((res) => {
            if (res.status === 200) {
                setArticle(res.data);
            } else {
                enqueueSnackbar("Error getting article.", { variant: "error" });
                navigate("/support")
            }
        }).catch((err) => {
            enqueueSnackbar("Error getting article. " + err.response.data.message, { variant: "error" });
            navigate("/support")
        })
    }

    useEffect(() => {
        getArticle();
    }, [])

    return (
        <>
            <PageTitle title="Support" subtitle="Help Article" />
            <Container maxWidth="xl" sx={{ marginBottom: "1rem" }}>
                <Card>
                    <CardMedia
                        component="img"
                        height="350"
                        image={article?.image ? imagePath + article?.image : "/static/images/placeholder.png"}
                        alt={article?.title}
                    />
                    <CardContent>
                        <CardTitle title={article?.title} icon={<HelpIcon/>} back="/support/articles" />
                        <Box mt={"1rem"} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Box>
                                <Typography variant="small" color="text.secondary" component="p">
                                    <strong>Written By:</strong> {article?.User.name}
                                </Typography>
                            </Box>
                            <Box display={"flex"} alignItems={"center"}>
                                <AccessTimeIcon sx={{ marginRight: "0.5rem" }} />
                                <Typography variant="body2" color="text.secondary" component="p">
                                    {article?.readTime} min read
                                </Typography>
                            </Box>
                        </Box>
                        <Box mt={"1rem"}>
                            <MDEditor.Markdown source={article?.content} style={{  fontFamily: "Poppins" }} />
                        </Box>
                        
                    </CardContent>
                </Card>
            </Container>
        </>
    )
}

export default ViewArticle