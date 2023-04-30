module.exports = (sequelize, DataTypes) => {
    const Test = sequelize.define("Test", {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });
    return Test;
}