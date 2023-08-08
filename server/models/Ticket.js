module.exports = (sequelize, DataTypes) => {

    const Ticket = sequelize.define("Ticket", {
        title: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "General"
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "Open"
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        booking_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    });

    Ticket.associate = (models) => {
        Ticket.belongsTo(models.User, {
            foreignKey: "user_id",
            onDelete: "CASCADE",
        });
        Ticket.belongsTo(models.Booking, {
            foreignKey: "booking_id",
            onDelete: "CASCADE",
        });
        Ticket.hasMany(models.Message, {
            foreignKey: "ticket_id",
            onDelete: "CASCADE",
        });
    };

    return Ticket;
}