module.exports = (sequelize, DataTypes) => {

    const Route = sequelize.define("Route", {
        names: {
            type: DataTypes.STRING,
            allowNull: false
        },
        pickUp: {
            type: DataTypes.STRING,
            allowNull: false
        },
        wayPoints: {
            type: DataTypes.STRING,
            allowNull: false
        },
        destination: {
            type: DataTypes.STRING,
            allowNull: false
        },
        duration: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        distance: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        distance_value: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        total_cost: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        driver_profit: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        company_profit: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },

    });

    Route.associate = (models) => {
        Route.belongsTo(models.User, {
            foreignKey: "user_id",
            onDelete: "CASCADE"
        });
    }
    return Route;
}