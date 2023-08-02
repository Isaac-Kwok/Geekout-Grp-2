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
        unlocked: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        unlockedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    });

    Bicycle.associate = (models) => {
        Bicycle.belongsTo(models.User, {
            foreignKey: "user_id",
            onDelete: "CASCADE"
        });
        Bicycle.hasMany(models.BicycleReports, {
            foreignKey: "id",
            onDelete: "CASCADE",
        });
        Bicycle.hasMany(models.BicycleUsages, {
            foreignKey: "id",
            onDelete: "CASCADE",
        });
    }

    return Bicycle;
}