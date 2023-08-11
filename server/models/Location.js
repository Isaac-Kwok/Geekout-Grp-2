module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define("Location", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // status: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    status: {
      type: DataTypes.ENUM("Pending", "Active", "Inactive"),
      allowNull: false,
      defaultValue: "Active",
    },
    premium: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    imageFile: {
      type: DataTypes.STRING,
    },
    arrivals: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    departures: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  });
  return Location;
};
