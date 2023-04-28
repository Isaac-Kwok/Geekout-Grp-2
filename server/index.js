const express = require("express");
const cors = require("cors")
const db = require("./models")
require("dotenv").config()

const app = express();
app.use(cors())
app.use(express.json())

// Main Route
app.get("/", (request, response) => {
    response.send("Welcome to the learning space")
})

// Routes
//const tutorialRoutes = require("./routes/tutorial")
//app.use("/tutorial", tutorialRoutes)


db.sequelize.sync({alter: true}).then(() => {
    let port = process.env.APP_PORT
    app.listen(port, () => {
        console.log(`The server has been started on port ${port}`)
    })
})

module.exports = app;