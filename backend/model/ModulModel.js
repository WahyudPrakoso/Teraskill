import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Kelas from "./KelasModel.js";

const { DataTypes } = Sequelize;

const Modul = db.define(
  "modul",
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    desc: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    urutan: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

// Kelas.hasMany(Modul);
Modul.belongsTo(Kelas, { foreignKey: "kelasId" });

export default Modul;
