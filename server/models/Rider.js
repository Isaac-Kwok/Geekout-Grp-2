// module.exports = (sequelize, DataTypes) => {
//   const User = require("./BookingRider")(sequelize, DataTypes);
//   const BookingRider = require("./User")(sequelize, DataTypes);
//   // Booking model
//   const Booking = sequelize.define("Booking", {
//     locationId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
//     dateTime: {
//       type: DataTypes.DATE,
//       allowNull: false,
//     },
//     price: {
//         type: DataTypes.FLOAT,
//         allowNull: false,
//     },
//     slots: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//     }
//   });

//   // Establish many-to-many relationship between Booking and User (Rider)
//   Booking.belongsToMany(User, {
//     through: BookingRider,
//     foreignKey: "bookingId",
//     otherKey: "riderId",
//   });
//   User.belongsToMany(Booking, {
//     through: BookingRider,
//     foreignKey: "riderId",
//     otherKey: "bookingId",
//   });

//   return Booking;
// };
module.exports = (sequelize, DataTypes) => {
    const Rider = sequelize.define("Rider", {
      name: DataTypes.STRING,
      age: DataTypes.INTEGER,
    });
  
    return Rider;
  };
  