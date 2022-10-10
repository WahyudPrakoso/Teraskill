import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Kelas from "./KelasModel.js";

const { DataTypes } = Sequelize;

const SoalProjek = db.define(
  "soal_projek",
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
    soal: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

Kelas.hasMany(SoalProjek);
SoalProjek.belongsTo(Kelas, { foreignKey: "kelasId" });

export default SoalProjek;
