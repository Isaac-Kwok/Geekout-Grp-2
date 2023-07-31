module.exports = (sequelize, DataTypes) => {

    const Secret = sequelize.define("Secret", {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        secret: {
            type: DataTypes.STRING,
            allowNull: false
        },
        backup: {
            type: DataTypes.STRING,
            allowNull: false
        },
    });

    Secret.associate = (models) => {
        Secret.belongsTo(models.User, {
            foreignKey: "user_id",
            onDelete: "CASCADE"
        });
    }
    
    return Secret;
}