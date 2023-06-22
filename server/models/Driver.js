module.exports = (sequelize, DataTypes) => {

    const Driver = sequelize.define("Driver", {
        driver_nric_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        driver_nric_number: {
            type: DataTypes.STRING,
            allowNull: false
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
            type: DataTypes.STRING,
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
    });

    Driver.associate = (models) => {
        Driver.belongsTo(models.User, {
            foreignKey: "user_id",
            onDelete: "CASCADE"
        });
    }
    return Driver;
}