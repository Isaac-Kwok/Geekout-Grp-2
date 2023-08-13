module.exports = (sequelize, DataTypes) => {

    const Product = sequelize.define("Product", {
        product_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        product_category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        product_sub_category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        pass_category_status: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        product_stock:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue:0
        },
        product_picture: {
            type: DataTypes.STRING,
            allowNull: true
        },
        product_description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        product_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00
        },
        product_discounted_percent: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        product_sale: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        product_price_greenmiles: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        product_discounted_price_greenmiles: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        
        //Duration of pass
        duration_of_pass: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 7
        },
        // Product status
        product_status: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
    });

    Product.associate = (models) => {
        Product.hasMany(models.OrderItem, { foreignKey: "product_id", onDelete: "CASCADE" });
    };

    return Product;
}