module.exports = (sequelize, DataTypes) => {
    const Refund = sequelize.define("Refund", {
        request_refund_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        refund_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        refund_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        refund_reason: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        refund_status: {   
            type: DataTypes.ENUM,
            values: ["Pending", "Approved", "Rejected"],
            allowNull: false,
            defaultValue: "Pending",
        },
    });

    // Define associations for Refund
    Refund.associate = (models) => {
        // A Refund belongs to an Order
        Refund.belongsTo(models.Order, {
            foreignKey: "order_id",
            onDelete: "CASCADE",
        });
        // A Refund belongs to a User
        Refund.belongsTo(models.User, {
            foreignKey: "user_id",
            onDelete: "CASCADE",
        });
    };

    return Refund;
};
