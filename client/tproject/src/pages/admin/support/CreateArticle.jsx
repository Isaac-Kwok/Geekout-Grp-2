import React, { useState, useEffect } from 'react'
import { Container, Card, CardContent, Box, Checkbox, TextField, Grid, IconButton, FormControlLabel, Typography } from '@mui/material'
import ImageUploader from '../../../components/ImageUploader';
import MDEditor from '@uiw/react-md-editor';
import LoadingButton from '@mui/lab/LoadingButton';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import AddIcon from '@mui/icons-material/Add';
import CardTitle from "../../../components/CardTitle";
import AdminPageTitle from '../../../components/AdminPageTitle';
import http from '../../../http'
import { useSnackbar } from 'notistack'
import { Form, useNavigate } from 'react-router-dom'
import * as Yup from "yup";
import { useFormik } from 'formik';

function CreateArticle() {

    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [file, setFile] = useState(null)

    const formik = useFormik({
        initialValues: {
            title: "",
            content: "",
            isPublished: false,
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

            if (!file) {
                enqueueSnackbar("Please upload an image!", { variant: "error" });
                setLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append("file", file);
            http.post("/admin/support/article/upload", formData, { headers: { "Content-Type": "multipart/form-data" } }).then((res) => {
                if (res.status === 200) {
                    data.image = res.data.filename;
                    http.post("/admin/support/article", data).then((res) => {
                        if (res.status === 201) {
                            enqueueSnackbar("Help Article created successfully.", { variant: "success" });
                            navigate("/admin/support/article")
                        } else {
                            enqueueSnackbar("Error creating help article.", { variant: "error" });
                            setLoading(false);
                        }
                    }).catch((err) => {
                        enqueueSnackbar("Error creating help article. " + err.response.data.message, { variant: "error" });
                        setLoading(false);
                    })
                } else {
                    enqueueSnackbar("Error uploading image!", { variant: "error" });
                    setLoading(false);
                    handleChangePictureDialogClose();
                }
            }).catch((err) => {
                enqueueSnackbar("Error uploading image! " + err.response.data.message, { variant: "error" });
                setLoading(false);
                handleChangePictureDialogClose();
            })
        }
    })

    const handleImageDrop = (acceptedFiles) => {
        setFile(acceptedFiles[0]);
        console.log(acceptedFiles[0]);
    }

    useEffect(() => {
        document.title = "EnviroGo - Create Help Article"
    }, [])

    return (
        <>
            <Container maxWidth="xl" sx={{ marginY: "1rem" }}>
                <AdminPageTitle title="Create Help Article" backbutton />
                <LoadingButton
                    variant="contained"
                    color="primary"
                    type="submit"
                    loading={loading}
                    loadingPosition="start"
                    startIcon={<AddIcon />}
                    onClick={formik.handleSubmit}
                    sx={{ marginBottom: "1rem" }}
                >
                    Create Article
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
                                maxSize={1024*1024*5}
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

export default CreateArticle