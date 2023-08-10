module.exports = (sequelize, DataTypes) => {

    const Article = sequelize.define("Article", {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT('long'),
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isPublished: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    Article.associate = (models) => {
        Article.belongsTo(models.User, {
            foreignKey: "user_id",
            onDelete: "CASCADE",
        });
    };

    return Article;
}