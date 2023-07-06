module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define("Booking", {
    bookingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    dateTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    locationId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    slots: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    slotsLimit: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    //   riderList: DataTypes.STRING,
  });

  // Booking.associate = (models) => {
  //   Booking.belongsTo(models.User, {
  //     foreignKey: "riderId",
  //     onDelete: "CASCADE",
  //   });
  // };

  return Booking;
};
