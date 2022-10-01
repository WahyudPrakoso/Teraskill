import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UsersModel.js";
import Webinar from "./WebinarModel.js";

const { DataTypes } = Sequelize;

const Webinar_User = db.define(
  "webinar_user",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    webinarId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    no_ref: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nominal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    metode_pembayaran: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bukti_pembayaran: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

Users.hasMany(Webinar_User);
Webinar_User.belongsTo(Users, { foreignKey: "userId" });

Webinar.hasOne(Webinar_User);
Webinar_User.belongsTo(Webinar, { foreignKey: "webinarId" });

export default Webinar_User;
