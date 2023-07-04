const express = require("express");
const cors = require("cors")
const db = require("./models")
require("dotenv").config()

const app = express();
app.use(cors({
    origin: "*"
}))
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send("Something broke! Check console for details");
})

// Main Route (Status check)
app.get("/", (request, response) => {
    response.json({ message: "Welcome to EnviroGo API. API Server is operational. Now with automatic deployments" })
})

// Routes
const userRoutes = require("./routes/user")
const adminUsersRoutes = require("./routes/admin/users")
const authRoutes = require("./routes/auth")
const uploadRoutes = require("./routes/upload")
const paymentRoutes = require("./routes/payment")
const driverRoutes = require('./routes/driver')
const adminProductsRoutes = require("./routes/admin/products")
const bicycleRoutes = require('./routes/bicycle')
const adminDriverRoutes = require('./routes/admin/driver')
const adminLocationRoutes = require('./routes/admin/locations')

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use('/images', express.static('images'));

app.use("/user", userRoutes)
app.use("/admin/users", adminUsersRoutes)
app.use("/auth", authRoutes)
app.use("/uploads", uploadRoutes)
app.use("/payment", paymentRoutes)
app.use('/driver', driverRoutes)
app.use('/admin/driver', adminDriverRoutes)
app.use('/admin/products', adminProductsRoutes)
app.use('/bicycle', bicycleRoutes)
app.use("/admin/driver", adminDriverRoutes)
app.use("/admin/locations", adminLocationRoutes)


db.sequelize.sync({alter: true}).then(() => {
    let port = process.env.APP_PORT
    app.listen(port, () => {
        console.clear()
        console.log(`The server has been started on port ${port}`)
    })
})

module.exports = app;