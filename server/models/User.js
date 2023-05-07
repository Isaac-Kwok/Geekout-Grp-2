const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
    // Account Types:
    // 0 - Admin
    // 1 - General User
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
        account_type: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1
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