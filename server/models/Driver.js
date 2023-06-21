const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {

    const Driver = sequelize.define("Driver", {
        driver_email: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        driver_nric_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        driver_profile_picture: {
            type: DataTypes.STRING,
            allowNull: true
        },
        driver_profile_picture_type: {
            type: DataTypes.STRING,
            allowNull: true
        },
        driver_phone_number: {
            type: DataTypes.STRING,
            allowNull: true
        },
        driver_is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        driver_face_image: {
            type: DataTypes.STRING
        }
    });

    Driver.associate = (models) => {
        Driver.belongsTo(models.User, {
            foreignKey: "user_id",
            onDelete: "CASCADE"
        });
    }
    return Driver;
}