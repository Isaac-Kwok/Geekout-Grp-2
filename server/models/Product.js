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
        product_stock:{
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue:0
        },
        product_picture: {
            type: DataTypes.STRING,
            allowNull: true
        },
        product_picture_type: {
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
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0
        },
        product_sale: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        product_price_greenmiles: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1
        },
        product_discounted_price_greenmiles: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1
        },
        
        //Duration of pass
        duration_of_pass: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1
        },
        // Product status
        product_status: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
    });

    return Product;
}