"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasOne(models.profile, {
        as: "profile",
        foreignKey: {
          name: "idUser",
        },
      });

      user.hasMany(models.follow, {
        as: "follower",
        foreignKey: {
          name: "idUser",
        },
      });

      user.hasMany(models.follow, {
        as: "following",
        foreignKey: {
          name: "idFollowing",
        },
      });

      user.hasMany(models.feed, {
        as: "feed",
        foreignKey: {
          name: "idUser",
        },
      });
    }
  }
  user.init(
    {
      email: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      fullName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};
