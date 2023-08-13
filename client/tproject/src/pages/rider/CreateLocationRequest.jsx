import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardContent,
  Box,
  TextField,
  Grid,
  MenuItem,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import AddIcon from "@mui/icons-material/Add";
import CardTitle from "../../components/CardTitle";
import AdminPageTitle from "../../components/AdminPageTitle";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import http from "../../http";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

function CreateNewPickupRequest({ userId }) {
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);

  const formik = useFormik({
    initialValues: {
      name: "",
      notes: "",
      status: "Pending",
      premium: 0,
      imageFile: "placeholderImageFileString",
    },

    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      notes: Yup.string().optional(),
    }),

    onSubmit: (data) => {
      console.log("test submit");
      setLoading(true);
      data.name = data.name.trim();
      data.notes = data.notes.trim();
      data.premium = Number(parseFloat(data.premium).toFixed(2));
      // data.arrivals = Number(data.arrivals);
      // data.departures = Number(data.departures);
      if (data.premium === "") {
        data.premium = 0;
      }

      // data.status = data.status === "Active" ? true : false;
      // if (data.arrivals === "") {
      //   data.arrivals = 0;
      // }
      // if (data.departures === "") {
      //   data.departures = 0;
      // }

      console.log("Data to be submitted:", data); // Log the data to be submitted

      http
        .post("/admin/locations/create", data)
        .then((res) => {
          console.log("Response:", res); // Log the response
          if (res.status === 200) {
            enqueueSnackbar("Location created successfully!", {
              variant: "success",
            });
            navigate("/riderequests/myrequests");
          } else {
            enqueueSnackbar("Location creation failed!", {
              variant: "error",
            });
          }
        })
        .catch((err) => {
          console.error("Error:", err); // Log the error
          enqueueSnackbar(
            "Location creation failed! " + err.response.data.message,
            { variant: "error" }
          );
        })
        .finally(() => {
          setLoading(false); // Set loading state to false after API request is complete
        });
    },
  });

  return (
    <Container maxWidth="xl" sx={{ marginTop: "1rem" }}>
      <AdminPageTitle title="Create Pickup Request" backbutton />

      <Card sx={{ margin: "auto" }}>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <CardContent>
            <CardTitle
              title="Pickup Request - Enter your desired location"
              icon={<DirectionsCarIcon color="text.secondary" />}
            />
            <Grid container spacing={2} sx={{ marginY: "1rem" }}>
              <Grid xs={12} lg={12} spacing={1} item container>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    id="name"
                    name="name"
                    label="Location Name"
                    variant="outlined"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    sx={{ marginY: "1rem" }}
                  ></TextField>
                </Grid>

                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    id="notes"
                    name="notes"
                    label="Request reason (Optional)"
                    variant="outlined"
                    value={formik.values.notes}
                    onChange={formik.handleChange}
                    error={formik.touched.notes && Boolean(formik.errors.notes)}
                    helperText={formik.touched.notes && formik.errors.notes}
                    sx={{ marginY: "1rem" }}
                  ></TextField>
                </Grid>
              </Grid>
            </Grid>
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
              Submit Request
            </LoadingButton>
          </CardContent>
        </Box>
      </Card>
    </Container>
  );
}

export default CreateNewPickupRequest;
