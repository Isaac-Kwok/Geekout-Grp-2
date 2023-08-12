import React, { useEffect, useState} from 'react';
import '../bicycle.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from "formik";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import http from '../http';

function ReportBicycle() {
    const { id } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [reports, setReports] = useState(0);

    const getDateTime = () =>  {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-based, so we add 1 and pad with '0'
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const getReports = (bikeId) => {
        http.get(`/bicycle/${bikeId}`).then((res) => {
            if (res.status === 200) {
                const bikeData = res.data;
                const bikeReports = bikeData.reports || 0; // Default to 0 if reports is not available
                setReports(bikeReports);
            } else {
                console.log('Failed to fetch bike reports');
            }
        }).catch((err) => {
            console.error('Error fetching bike reports:', err);
        });
    }

    const formik = useFormik({
        initialValues: {
            report: "",
            reportType: ""
        },
        validationSchema: yup.object({
            report: yup.string().required(),
            reportType: yup.string().required(),
            bike_id: yup.number().optional(),
            reportedAt: yup.date().optional()
        }),
        onSubmit: (data) => {
            data.bike_id = id
            data.reportedAt = getDateTime()
            http.post("/bicycle/reports", data).then((res) => {
                if (res.status === 200) {
                    enqueueSnackbar("Bicycle reported succesfully!", { variant: "success" });
                    navigate("/bicycle")

                    http.put("/bicycle/"+id, {reports: reports + 1}).then((res) => {
                        if (res.status === 200) {
                            console.log("Report incremented succesfully")
                        } else {
                            console.log("Failed to increment report")
                        }
                    }).catch((err) => {
                        console.log("Error while incrementing report:", err);
                    })
                } else {
                    enqueueSnackbar("Failed to report bicycle test", { variant: "error" });
                    setLoading(false);
                }
            }).catch((err) => {
                enqueueSnackbar("Failed to report bicycle" + err.response.data.message, { variant: "error" });
                setLoading(false);
            })
        }
    })

    useEffect(() => {
        getReports(id)
    })

    return (
        <div className="report-fault-page">
            <header>
                {id ? <h1>Report a Fault for Bike {id}</h1> : <h1>Report a Fault</h1>}
            </header>
            <main>
                <div className="selection-box">
                    <h2>Select Fault Type:</h2>
                    <div className="selection-item">
                        <input
                            type="radio"
                            id="missing-bike"
                            name="reportType"
                            value="missing"
                            onChange={formik.handleChange}
                            checked={formik.values.reportType === "missing"}
                        />
                        <label htmlFor="missing-bike">Missing Bike</label>
                    </div>
                    <div className="selection-item">
                        <input
                            type="radio"
                            id="damaged-bike"
                            name="reportType"
                            value="damaged"
                            onChange={formik.handleChange}
                            checked={formik.values.reportType === "damaged"}
                        />
                        <label htmlFor="damaged-bike">Damaged Bike</label>
                    </div>
                    <div className="selection-item">
                        <input
                            type="radio"
                            id="others"
                            name="reportType"
                            value="others"
                            onChange={formik.handleChange}
                            checked={formik.values.reportType === "others"}
                        />
                        <label htmlFor="others">Others</label>
                    </div>
                </div>
                <div className="notes-box">
                    <h2>Details/Notes:</h2>
                    <textarea
                        rows="4"
                        cols="50"
                        id="report"
                        name="report"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.report}
                    />
                    {formik.touched.report && formik.errors.report ? (
                        <div className="error">{formik.errors.report}</div>
                    ) : null}
                </div>
            </main>
            <footer>
                <button className="submit-button" onClick={formik.handleSubmit}>
                    Submit
                </button>
            </footer>
        </div>
    );
}

export default ReportBicycle;
