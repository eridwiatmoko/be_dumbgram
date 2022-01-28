"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class feed extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      feed.belongsTo(models.user, {
        as: "user",
        foreignKey: {
          name: "idUser",
        },
      });

      feed.hasOne(models.follow, {
        foreignKey: {
          name: "idUser",
        },
      });

      feed.hasMany(models.like, {
        foreignKey: {
          name: "idFeed",
        },
      });
    }
  }
  feed.init(
    {
      idUser: DataTypes.INTEGER,
      caption: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "feed",
    }
  );
  return feed;
};
