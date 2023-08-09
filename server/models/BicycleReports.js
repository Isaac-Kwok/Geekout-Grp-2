module.exports = (sequelize, DataTypes) => {

    const BicycleReports = sequelize.define("BicycleReports", {
        bike_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        reportedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        reportType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        report: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    return BicycleReports;
}