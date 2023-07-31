module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define("Order", {
        order_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        total_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        status: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1,
            validate: {
                isIn: [[1, 2, 3, 4, 5, 6]],
            },
        },
    });

    // Define associations for Order
    Order.associate = (models) => {
        // An Order belongs to one Customer
        Order.belongsTo(models.User, {
            foreignKey: "user_id",
            onDelete: "CASCADE"
        });
        // An Order has many OrderItems
        Order.hasMany(models.OrderItem, {
            onDelete: "CASCADE",
        });
    };

    return Order;
};
