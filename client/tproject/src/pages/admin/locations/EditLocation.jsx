import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardContent,
  Box,
  TextField,
  Grid,
  FormControlLabel,
  IconButton,
  MenuItem,
  Button,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import CardTitle from "../../../components/CardTitle";
import AdminPageTitle from "../../../components/AdminPageTitle";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import http from "../../../http";
import PlaceIcon from "@mui/icons-material/Place";
import { ToastContainer, toast } from "react-toastify";

function EditLocation() {
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id } = useParams();
  const [imageFile, setImageFile] = useState(null);

  const [location, setLocation] = useState({
    name: "",
    notes: "",
    status: false,
    premium: 0,
    imageFile: "",
    // arrivals: 0,
    // departures: 0,
  });

  // const handleChange = (event) => {
  //   const { name, value } = event.target;
  //   formik.setFieldValue(name, value === "Active" ? true : false);
  // };

  const handleChange = (event) => {
    const { name, value } = event.target;
    formik.setFieldValue(name, value); // Set the value directly
  };

  const onFileChange = (e) => {
    let file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error("Maximum file size is 1MB");
        return;
      }
      let formData = new FormData();
      formData.append("file", file);
      http
        .post("/file/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          // Note: Receives the response which is the file name. (file.js)
          console.log(res.data);
          setImageFile(res.data.filename);
        })
        .catch(function (error) {
          console.log(error.response);
        });
    }
  };

  useEffect(() => {
    setLocation((prevLocation) => ({
      ...prevLocation,
      imageFile: imageFile,
    }));
  }, [imageFile]);

  useEffect(() => {
    // Fetch location data on component mount
    http
      .get(`/admin/locations/${id}`)
      .then((res) => {
        console.log("Location data:", res.data);
        setLocation(res.data);
        setImageFile(res.data.imageFile);
        // const locationData = res.data;
        // // Set the form values with the fetched data
        // formik.setValues({
        //   name: locationData.name,
        //   notes: locationData.notes,
        //   status: locationData.status ? "Active" : "Inactive",
        //   premium: locationData.premium.toString(),
        //   imageurl: locationData.imageurl,
        //   arrivals: locationData.arrivals.toString(),
        //   departures: locationData.departures.toString(),
        // });
      })
      .catch((err) => {
        console.error("Error:", err);
        enqueueSnackbar("Failed to fetch location data!", { variant: "error" });
      });
  }, [id, enqueueSnackbar]);

  const formik = useFormik({
    // initialValues: {
    //   name: "",
    //   notes: "",
    //   status: false,
    //   premium: "",
    //   imageurl: "",
    //   arrivals: "",
    //   departures: "",
    // },
    initialValues: location,
    enableReinitialize: true,

    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      notes: Yup.string().optional(),
      premium: Yup.number(),
      imageFile: Yup.string().trim().required("Image is required"),
      status: Yup.string().required("Location Status is required"),
      // arrivals: Yup.number().optional(),
      // departures: Yup.number().optional(),
    }),
    onSubmit: (data) => {
      setLoading(true);
      console.log("Before conversion:", data.premium);
      data.name = data.name.trim();
      data.notes = data.notes.trim();
      data.premium = Number(parseFloat(data.premium).toFixed(2));
      // data.arrivals = Number(data.arrivals);
      // data.departures = Number(data.departures);
      console.log("After conversion:", typeof data.premium);

      if (data.premium == "") {
        data.premium = 0;
      }

      if (data.status == "Pending") {
        enqueueSnackbar("Location approval failed! Status is required.", {
          variant: "error",
        });
        setLoading(false); // Stop loading
        return; // Return early to prevent further execution
      }

      // Check if the imageFile is still the placeholder value
      if (data.imageFile === "placeholderImageFileString") {
        enqueueSnackbar("Location approval failed! Image is required.", {
          variant: "error",
        });
        setLoading(false); // Stop loading
        return; // Return early to prevent further execution
      }
      data.imageFile = data.imageFile.trim();
      data.status = data.status.trim();

      // data.status = data.status === "Active" ? true : false;
      // if (data.arrivals === "") {
      //   data.arrivals = 0;
      // }
      // if (data.departures === "") {
      //   data.departures = 0;
      // }

      console.log("Data to be submitted:", data); // Log the data to be submitted

      if (imageFile) {
        http
          .put(`/admin/locations/edit/${id}`, data)
          .then((res) => {
            console.log("Response:", res); // Log the response
            if (res.status === 200) {
              enqueueSnackbar("Location updated successfully!", {
                variant: "success",
              });
              navigate("/admin/locations/view");
            } else {
              enqueueSnackbar("Location update failed!", { variant: "error" });
            }
          })
          .catch((err) => {
            console.error("Error:", err); // Log the error
            enqueueSnackbar(
              "Location update failed! " + err.response.data.message,
              { variant: "error" }
            );
          })
          .finally(() => {
            setLoading(false); // Set loading state to false after API request is complete
          });
      } else if (!imageFile) {
        console.log("Error - Image required"); // Log the error
        enqueueSnackbar("Location update failed! Image is required.", {
          variant: "error",
        });
        setLoading(false);
      }
    },
  });

  return (
    <>
      <Container maxWidth="xl" sx={{ marginTop: "1rem" }}>
        <AdminPageTitle
          title="Edit Location"
          subtitle={location.name}
          backbutton
        />
        <Box component="form" onSubmit={formik.handleSubmit}>
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
            Save changes
          </LoadingButton>
          <Card sx={{ margin: "auto" }}>
            <CardContent>
              <CardTitle
                title="Location Information"
                icon={<PlaceIcon color="text.secondary" />}
              />
              <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
                <Grid xs={12} lg={12} spacing={1} item container>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      fullWidth
                      id="name"
                      name="name"
                      label="Name"
                      variant="outlined"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}
                      sx={{ marginY: "1rem" }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12}>
                    <TextField
                      fullWidth
                      id="notes"
                      name="notes"
                      label="Notes"
                      variant="outlined"
                      value={formik.values.notes}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.notes && Boolean(formik.errors.notes)
                      }
                      helperText={formik.touched.notes && formik.errors.notes}
                      sx={{ marginY: "1rem" }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="premium"
                      name="premium"
                      label="Premium ($)"
                      variant="outlined"
                      value={formik.values.premium}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.premium && Boolean(formik.errors.premium)
                      }
                      helperText={
                        formik.touched.premium && formik.errors.premium
                      }
                      sx={{ marginY: "1rem" }}
                    />
                  </Grid>

                  {/* <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="status"
                      name="status"
                      label="Status"
                      select
                      variant="outlined"
                      value={formik.values.status ? "Active" : "Inactive"}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.status && Boolean(formik.errors.status)
                      }
                      helperText={formik.touched.status && formik.errors.status}
                      sx={{ marginY: "1rem" }}
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Inactive">Inactive</MenuItem>
                    </TextField>
                  </Grid> */}

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="status"
                      name="status"
                      label="Status"
                      select
                      variant="outlined"
                      value={formik.values.status}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.status && Boolean(formik.errors.status)
                      }
                      helperText={formik.touched.status && formik.errors.status}
                      sx={{ marginY: "1rem" }}
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Inactive">Inactive</MenuItem>
                    </TextField>
                  </Grid>

                  {/* <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="arrivals"
                      name="arrivals"
                      label="Arrivals"
                      variant="outlined"
                      value={formik.values.arrivals}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.arrivals &&
                        Boolean(formik.errors.arrivals)
                      }
                      helperText={
                        formik.touched.arrivals && formik.errors.arrivals
                      }
                      sx={{ marginY: "1rem" }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="departures"
                      name="departures"
                      label="Departures"
                      variant="outlined"
                      value={formik.values.departures}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.departures &&
                        Boolean(formik.errors.departures)
                      }
                      helperText={
                        formik.touched.departures && formik.errors.departures
                      }
                      sx={{ marginY: "1rem" }}
                    />
                  </Grid> */}

                  <Grid item xs={6} sm={6}>
                    {/* Image upload */}
                    <Box sx={{ textAlign: "center", mt: 2 }}>
                      <Button variant="contained" component="label">
                        Upload new Image
                        <input
                          hidden
                          accept="image/*"
                          multiple
                          type="file"
                          onChange={onFileChange}
                        />
                      </Button>

                      {/* {imageFile && (
                        <AspectRatio sx={{ mt: 2 }}>
                          <Box
                            component="img"
                            alt="location"
                            src={`${
                              import.meta.env.VITE_FILE_BASE_URL
                            }${imageFile}`}
                          ></Box>
                        </AspectRatio>
                      )} */}

                      {/* If imageFile is uploaded, display it with the following
                aspect ratio settings. */}

                      <ToastContainer />
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    <img
                      src={
                        import.meta.env.VITE_API_URL +
                        "/admin/locations/images/" +
                        imageFile
                      }
                      alt="locImg"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "200px",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
}

export default EditLocation;
