module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define("OrderItem", {
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        total_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        discounted_total_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        discounted : {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        points: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
    });

    // Define associations for OrderItem
    OrderItem.associate = (models) => {
        OrderItem.belongsTo(models.Order, {
            foreignKey: "order_id",
        });
        OrderItem.belongsTo(models.Product, {
            foreignKey: "product_id",
        });
    };

    return OrderItem;
}
