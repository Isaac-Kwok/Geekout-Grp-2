module.exports = (sequelize, DataTypes) => {

    const Message = sequelize.define("Message", {
        message: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        ticket_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    Message.associate = (models) => {
        Message.belongsTo(models.User, {
            foreignKey: "user_id",
            onDelete: "CASCADE",
        });
        Message.belongsTo(models.Ticket, {
            foreignKey: "ticket_id",
            onDelete: "CASCADE",
        });
    };

    return Message;
}