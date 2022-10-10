import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Kelas from "./KelasModel.js";

const { DataTypes } = Sequelize;

const SoalExam = db.define(
  "soal_exam",
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
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    freezeTableName: true,
  }
);

Kelas.hasMany(SoalExam);
SoalExam.belongsTo(Kelas, { foreignKey: "kelasId" });

export default SoalExam;
