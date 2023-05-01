const express = require("express");
const cors = require("cors")
const db = require("./models")
require("dotenv").config()

const app = express();
app.use(cors())
app.use(express.json())

// Main Route (Status check)
app.get("/", (request, response) => {
    response.json({ message: "Welcome to TProject. API Server is operational." })
})

// Routes
const userRoutes = require("./routes/user")
const authRoutes = require("./routes/auth")
app.use("/user", userRoutes)
app.use("/auth", authRoutes)


db.sequelize.sync({alter: true}).then(() => {
    let port = process.env.APP_PORT
    app.listen(port, () => {
        console.log(`The server has been started on port ${port}`)
    })
})

module.exports = app;