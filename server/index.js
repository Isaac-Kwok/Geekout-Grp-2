const express = require("express");
const cors = require("cors")
const db = require("./models")
require("dotenv").config()

const app = express();
app.use(cors({
    origin: "*"
}))
app.use(express.json())

// Main Route (Status check)
app.get("/", (request, response) => {
    response.json({ message: "Welcome to EnviroGo API. API Server is operational. Now with automatic deployments" })
})

// Routes
const userRoutes = require("./routes/user")
const adminUsersRoutes = require("./routes/admin/users")
const authRoutes = require("./routes/auth")
app.use("/user", userRoutes)
app.use("/admin/users", adminUsersRoutes)
app.use("/auth", authRoutes)


db.sequelize.sync({alter: true}).then(() => {
    let port = process.env.APP_PORT
    app.listen(port, () => {
        console.log(`The server has been started on port ${port}`)
    })
})

module.exports = app;