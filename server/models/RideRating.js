const { Sequelize } = require(".");
const { User } = require("./User");
const { RideRequest } = require("./RideRequest");
const { Location } = require("./Location");

module.exports = (sequelize, DataTypes) => {
  const RideRating = sequelize.define("RideRating", {
    ratingId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    requestId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: "CASCADE", // If a ride request is deleted, their ride requests will also be deleted
      onUpdate: "CASCADE", // If a ride request is updated, the corresponding ride requests will also be updated
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: "CASCADE", // If a user is deleted, their ride requests will also be deleted
      onUpdate: "CASCADE", // If a user's ID is updated, the corresponding ride requests will also be updated
    },
    driverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    routeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reviewer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dateTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  RideRating.associate = (models) => {
    // Assiciation between RideRating and RideRequest
    RideRating.belongsTo(models.RideRequest, {
      foreignKey: "requestId",
      as: "request",
    });

    // Assiciation between RideRating and user
    RideRating.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };

  return RideRating;
};