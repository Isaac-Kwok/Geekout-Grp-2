module.exports = (sequelize, DataTypes) => {
    // Operator Types: +, -
    // Payment Methods: Stripe, Points, Cash Wallet
    // Transaction Types: Bookings, Topup, Withdrawal, Shop

    const Transaction = sequelize.define("Transaction", {
        user_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "Pending"
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00
        },
        operator: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "+"
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "Topup"
        },
        payment_method: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "Stripe"
        },
        paymentIntent_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        paymentIntent_client_secret: {
            type: DataTypes.STRING,
            allowNull: true
        },
    });

    Transaction.associate = (models) => {
        Transaction.belongsTo(models.User, {
            foreignKey: "user_id",
            onDelete: "CASCADE"
        });
    }

    return Transaction;
}