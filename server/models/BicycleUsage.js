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
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        endPosition: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        transaction: {
            type: DataTypes.FLOAT,
            allowNull: false
        }

    });

    return BicycleUsages;
}