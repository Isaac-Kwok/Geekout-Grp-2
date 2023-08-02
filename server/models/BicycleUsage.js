module.exports = (sequelize, DataTypes) => {

    const BicycleUsages = sequelize.define("BicycleUsages", {
        bike_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        unlockedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        startPosition: {
            type: DataTypes.STRING,
            allowNull: false
        },
        EndPosition: {
            type: DataTypes.STRING,
            allowNull: false
        }

    });

    return BicycleUsages;
}