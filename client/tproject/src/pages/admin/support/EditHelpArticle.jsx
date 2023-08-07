import React, { useState, useEffect } from 'react'
import { Container, Card, CardContent, Box, Checkbox, TextField, Grid, IconButton, FormControlLabel, Typography } from '@mui/material'
import ImageUploader from '../../../components/ImageUploader';
import MDEditor, { image } from '@uiw/react-md-editor';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import AddIcon from '@mui/icons-material/Add';
import CardTitle from "../../../components/CardTitle";
import AdminPageTitle from '../../../components/AdminPageTitle';
import http from '../../../http'
import { useSnackbar } from 'notistack'
import { Form, useNavigate, useParams } from 'react-router-dom'
import * as Yup from "yup";
import { useFormik } from 'formik';

function EditHelpArticle() {

    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [file, setFile] = useState(null)
    const [article, setArticle] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const imagePath = `${import.meta.env.VITE_API_URL}/support/article/images/`

    const updateArticle = (data) => {
        http.put(`/admin/support/article/${id}`, data).then((res) => {
            if (res.status === 200) {
                enqueueSnackbar("Article updated successfully.", { variant: "success" });
                navigate("/admin/support/article")
            } else {
                enqueueSnackbar("Error updating article.", { variant: "error" });
                setLoading(false);
            }
        }).catch((err) => {
            enqueueSnackbar("Error updating article. " + err.response.data.message, { variant: "error" });
            setLoading(false);
        })
    }

    const formik = useFormik({
        initialValues: {
            title: article?.title || "",
            content: article?.content || "",
            isPublished: article?.isPublished || false,
        },
        validationSchema: Yup.object({
            title: Yup.string().required("Title is required"),
            content: Yup.string().required("Content is required"),
            isPublished: Yup.boolean().required("Publishing status is required"),
        }),
        onSubmit: (data) => {
            setLoading(true);
            data.title = data.title.trim();
            data.content = data.content.trim();
            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                http.post("/admin/support/article/upload", formData, { headers: { "Content-Type": "multipart/form-data" } }).then((res) => {
                    if (res.status === 200) {
                        data.image = res.data.filename;
                        updateArticle(data);
                    } else {
                        enqueueSnackbar("Error uploading image!", { variant: "error" });
                        setLoading(false);
                    }
                }).catch((err) => {
                    enqueueSnackbar("Error uploading image! " + err.response.data.message, { variant: "error" });
                    setLoading(false);
                })
            } else {
                updateArticle(data);
            }
        },
        enableReinitialize: true
    })



    const handleImageDrop = (acceptedFiles) => {
        setFile(acceptedFiles[0]);
        console.log(acceptedFiles[0]);
    }

    const getArticle = () => {
        http.get(`/admin/support/article/${id}`).then((res) => {
            if (res.status === 200) {
                setArticle(res.data);
                setCurrentImage(imagePath + res.data.image)
                console.log(res.data);
            } else {
                enqueueSnackbar("Error getting article.", { variant: "error" });
                navigate("/admin/support/article")
            }
        }).catch((err) => {
            enqueueSnackbar("Error getting article. " + err.response.data.message, { variant: "error" });
            navigate("/admin/support/article")
        })
    }


    useEffect(() => {
        document.title = "EnviroGo - Edit Help Article"
        getArticle();
    }, [])

    return (
        <>
            <Container maxWidth="xl" sx={{ marginY: "1rem" }}>
                <AdminPageTitle title="Edit Article" subtitle={article?.title} backbutton />
                <LoadingButton
                    variant="contained"
                    color="primary"
                    type="submit"
                    loading={loading}
                    loadingPosition="start"
                    startIcon={<SaveIcon />}
                    onClick={formik.handleSubmit}
                    sx={{ marginBottom: "1rem" }}
                >
                    Save
                </LoadingButton>
                <Card sx={{ margin: "auto" }}>
                    <Box component="form">
                        <CardContent>
                            <CardTitle title="Help Article Information" icon={<NoteAddIcon />} />
                            <TextField
                                fullWidth
                                id="title"
                                name="title"
                                label="Article Title"
                                variant="outlined"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                error={formik.touched.title && Boolean(formik.errors.title)}
                                helperText={formik.touched.title && formik.errors.title}
                                sx={{ marginY: "1rem" }}
                            />
                            <MDEditor
                                data-color-mode="light"
                                preview="edit"
                                id="content"
                                name="content"
                                labelId="content_label"
                                label="Help Article Content"
                                variant="outlined"
                                onChange={(value) => formik.setFieldValue("content", value)}
                                value={formik.values.content}
                                error={formik.touched.content && Boolean(formik.errors.content)}
                                helperText={formik.touched.content && formik.errors.content}
                            />
                            <ImageUploader
                                onDrop={handleImageDrop}
                                label="Article Header Image"
                                maxSize={1024 * 1024 * 5}
                                existingFile={currentImage || ""}
                            />
                            <FormControlLabel label="Published?" control={
                                <Checkbox
                                    id="isPublished"
                                    name="isPublished"
                                    checked={formik.values.isPublished}
                                    onChange={formik.handleChange}
                                    error={formik.touched.isPublished && Boolean(formik.errors.isPublished)}
                                    helperText={formik.touched.isPublished && formik.errors.isPublished}
                                />
                            } />

                        </CardContent>
                    </Box>
                </Card>
            </Container>
        </>
    )
}

export default EditHelpArticle