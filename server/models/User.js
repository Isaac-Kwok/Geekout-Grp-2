const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
    // Account Types:
    // 0 - Admin
    // 1 - General User
    // 2 - Driver User

    const User = sequelize.define("User", {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        profile_picture: {
            type: DataTypes.STRING,
            allowNull: true
        },
        profile_picture_type: {
            type: DataTypes.STRING,
            allowNull: true
        },
        account_type: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cash: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00
        },
        points: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        is_2fa_enabled: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        is_email_verified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    }, {
        hooks: {
            beforeCreate: (user) => {
                // Hash the password before saving it to the database
                user.password = bcrypt.hashSync(user.password, 10);
            }
        }
    });
    return User;
}