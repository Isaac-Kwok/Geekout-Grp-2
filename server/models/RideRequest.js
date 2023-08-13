const { Sequelize } = require(".");
const { User } = require("./User");
const { Location } = require("./Location");

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
    dateTime: {
      type: DataTypes.DATE,
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
    },
    status: {
      type: DataTypes.ENUM("Pending", "Accepted", "Completed", "Rated"),
      allowNull: false,
      defaultValue: "Pending",
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    routeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  // // Define the association with User
  // RideRequest.belongsTo(sequelize.models.User, {
  //   foreignKey: "userId",
  //   onDelete: "CASCADE", // If a user is deleted, their ride requests will also be deleted
  //   onUpdate: "CASCADE", // If a user's ID is updated, the corresponding ride requests will also be updated
  // });

  RideRequest.associate = (models) => {
    // Assiciation between RideRequest and User
    RideRequest.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });

    RideRequest.hasMany(models.RideRating, {
      foreignKey: "requestId",
      onDelete: "CASCADE",
  });
  };

  return RideRequest;
};
