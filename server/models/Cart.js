module.exports = (sequelize, DataTypes) => {

    const Cart = sequelize.define("Cart", {
        quantity : {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0
        },
    });

    Cart.associate = (models) => {
        Cart.belongsTo(models.User, {
            foreignKey: "user_id",
            onDelete: "CASCADE"
        });
        Cart.belongsTo(models.Product, {
            foreignKey: "product_id",
            onDelete: "CASCADE"
        });
    }
    
    return Cart;
}