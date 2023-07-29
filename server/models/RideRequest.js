const { Sequelize } = require(".");
const { User } = require("./User");

module.exports = (sequelize, DataTypes) => {
  const RideRequest = sequelize.define("RideRequest", {
    requestId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: "CASCADE", // If a user is deleted, their ride requests will also be deleted
      onUpdate: "CASCADE", // If a user's ID is updated, the corresponding ride requests will also be updated
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    pickUp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numberOfPassengers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  });

  // // Define the association with User
  // RideRequest.belongsTo(sequelize.models.User, {
  //   foreignKey: "userId",
  //   onDelete: "CASCADE", // If a user is deleted, their ride requests will also be deleted
  //   onUpdate: "CASCADE", // If a user's ID is updated, the corresponding ride requests will also be updated
  // });

  RideRequest.associate = (models) => {
    RideRequest.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };

  return RideRequest;
};
