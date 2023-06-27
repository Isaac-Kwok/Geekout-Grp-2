module.exports = (sequelize, DataTypes) => {

    const DriverApplication = sequelize.define("DriverApplication", {
        driver_nric_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        driver_nric_number: {
            type: DataTypes.STRING,
            allowNull: false
        },
        driver_phone_number: {
            type: DataTypes.STRING,
            allowNull: true
        },
        driver_email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        driver_postalcode: {
            type: DataTypes.STRING,
            allowNull: false
        },
        driver_age: {
            type: DataTypes.STRING,
            allowNull: false
        },
        driver_question: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        driver_car_model: {
            type: DataTypes.STRING,
            allowNull: false
        },
        driver_car_license_plate: {
            type: DataTypes.STRING,
            allowNull: false
        },
        driver_face_image: {
            type: DataTypes.STRING,
            allowNull: false
        },
        driver_car_image: {
            type: DataTypes.STRING,
            allowNull: false
        },
        driver_license: {
            type: DataTypes.STRING,
            allowNull: false
        },
        driver_ic: {
            type: DataTypes.STRING,
            allowNull: false
        },
        driver_is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        // 0 - Pending
        // 1 - Rejected
        // 2 - Approved
        driver_status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "Pending"
        },
    });

    DriverApplication.associate = (models) => {
        DriverApplication.belongsTo(models.User, {
            foreignKey: "user_id",
            onDelete: "CASCADE"
        });
    }
    return DriverApplication;
}