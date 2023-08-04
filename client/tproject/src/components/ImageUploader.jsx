import React, { useState, useEffect } from 'react'
import { Container, Card, CardContent, Box, Checkbox, TextField, Grid, IconButton, FormControlLabel, Typography } from '@mui/material'
import Dropzone from "react-dropzone";
import { useSnackbar } from 'notistack';

function ImageUploader(props) {
    const [file, setFile] = useState(null)
    const [existingFile, setExistingFile] = useState(null)
    const [dropzoneActive, setDropzoneActive] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const handleImageDrop = (acceptedFiles) => {
        setDropzoneActive(false);
        setFile(acceptedFiles[0]);
        props.onDrop(acceptedFiles);
    }

    const handleDropEnter = () => {
        setDropzoneActive(true);
    }

    const handleDropLeave = () => {
        setDropzoneActive(false);
    }

    const handleDropRejected = () => {
        enqueueSnackbar("File must be a PNG or JPG", { variant: "error" });
    }

    useEffect(() => {
        if (props.existingFile) {
            setExistingFile(props.existingFile);
        }
    }, [props.existingFile])

    return (
        <Dropzone
            onDragEnter={handleDropEnter}
            onDragLeave={handleDropLeave}
            onDrop={handleImageDrop}
            onDropRejected={handleDropRejected}
            maxFiles={props.maxFiles || 1}
            accept={{
                'image/png': ['.png'],
                'image/jpg': ['.jpg'],
                'image/jpeg': ['.jpeg'],
            }}
            multiple={props.maxFiles > 1 ? true : false || false}
            maxSize={props.maxSize || 1000000}
        >
            {({ getRootProps, getInputProps }) => (
                <Card variant='outlined' sx={{ backgroundColor: dropzoneActive ? "primary.main" : "initial", marginTop: "1rem", transition: "background-color 0.25s", cursor: "pointer" }}>
                    <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }} {...getRootProps()}>
                        <input {...getInputProps()} />
                        <Typography variant="h6" fontWeight={700} color={dropzoneActive ? "white" : "initial"}>{props.label}</Typography>
                        {dropzoneActive ?
                            <>
                                <Typography variant="body" color={"white"}>Release file to upload</Typography>
                            </>
                            :
                            <>
                                <Typography variant="body">Click or drag file here...</Typography>
                            </>
                        }
                        {file && <img src={URL.createObjectURL(file)} alt="article header" style={{ width: "100%", height: "500px", marginTop: "1rem", objectFit: "contain" }} />}
                        {(existingFile && !file) && <img src={existingFile} alt="article header" style={{ width: "100%", height: "500px", marginTop: "1rem", objectFit: "contain" }} />}
                    </CardContent>
                </Card>
            )}
        </Dropzone>
    )
}

export default ImageUploader