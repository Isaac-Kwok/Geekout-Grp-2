module.exports = (sequelize, DataTypes) => {

    const Wishlist = sequelize.define("Wishlist", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
    }, {
        indexes: [
            {
                unique: true,
                fields: ['user_id', 'product_id']
            }
        ]
    });

    Wishlist.associate = (models) => {
        Wishlist.belongsTo(models.User, {
            foreignKey: "user_id",
            onDelete: "CASCADE"
        });
        Wishlist.belongsTo(models.Product, {
            foreignKey: "product_id",
            onDelete: "CASCADE"
        });
    }
    
    return Wishlist;
}
