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
        subtotal_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        gst_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        no_of_items: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        /*
        Order Status:
        1 - Preparing
        2 - Wait for delivery
        3 - Delivered
        4 - Received
        5 - Cancelled
        6 - Refund Processing
        7 - Refund Approved
        8 - Refund Denied */
        order_status: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1,
            validate: {
                isIn: [[0, 1, 2, 3, 4, 5, 6, 7, 8]],
            },
        },

        delivery_address: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    })


    // Define associations for Order
    Order.associate = (models) => {
        // An Order belongs to one Customer
        Order.belongsTo(models.User, {
            foreignKey: "user_id",
            onDelete: "CASCADE"
        });
        // An Order has many OrderItems
        Order.hasMany(models.OrderItem, {
            foreignKey: "order_id",
            onDelete: "CASCADE",
        });
        // An Order has one Refund
        Order.hasOne(models.Refund, {
            foreignKey: "order_id",
            onDelete: "CASCADE",
        });
    };

    return Order;
};
