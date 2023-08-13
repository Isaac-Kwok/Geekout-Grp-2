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
        endPosition: {
            type: DataTypes.STRING,
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