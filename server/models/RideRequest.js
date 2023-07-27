// models/RideRequest.js

module.exports = (sequelize, DataTypes) => {
  const RideRequest = sequelize.define("RideRequest", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
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
    startLocation: {
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
  });

  return RideRequest;
};
