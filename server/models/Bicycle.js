module.exports = (sequelize, DataTypes) => {

    const Bicycle = sequelize.define("Bicycle", {
        bicycle_lat: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        bicycle_lng: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        disabled: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        reports: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        passkey: {
            type: DataTypes.INTEGER,
            alowNull: true
        },
        registered: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
    });

    return Bicycle;
}