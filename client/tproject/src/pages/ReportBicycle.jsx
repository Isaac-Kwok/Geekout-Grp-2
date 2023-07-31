import React from 'react';
import '../bicycle.css';

function ReportBicycle() {
    return (
        <div className="report-fault-page">
            <header>
                <h1>Report a Fault</h1>
            </header>
            <main>
                <div className="selection-box">
                    <h2>Select Fault Type:</h2>
                    <div className="selection-item">
                        <input type="radio" id="missing-bike" name="faultType" value="missing" />
                        <label htmlFor="missing-bike">Missing Bike</label>
                    </div>
                    <div className="selection-item">
                        <input type="radio" id="damaged-bike" name="faultType" value="damaged" />
                        <label htmlFor="damaged-bike">Damaged Bike</label>
                    </div>
                    <div className="selection-item">
                        <input type="radio" id="others" name="faultType" value="others" />
                        <label htmlFor="others">Others</label>
                    </div>
                </div>
                <div className="notes-box">
                    <h2>Details/Notes:</h2>
                    <textarea rows="4" cols="50" />
                </div>
            </main>
            <footer>
                <button className="submit-button">Submit</button>
            </footer>
        </div>
    );
};

export default ReportBicycle;
