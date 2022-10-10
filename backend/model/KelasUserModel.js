import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Users from "./UsersModel.js";
import Kelas from "./KelasModel.js";

const { DataTypes } = Sequelize;

const Kelas_User = db.define(
  "kelas_user",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    kelasId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    no_ref: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total_progres: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_paid: {
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
    star: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    riview: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_posted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

Kelas.hasOne(Kelas_User);
Kelas_User.belongsTo(Kelas, { foreignKey: "kelasId" });

Users.hasMany(Kelas_User);
Kelas_User.belongsTo(Users, { foreignKey: "userId" });

export default Kelas_User;
