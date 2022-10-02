import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Kelas from "./KelasModel.js";

const { DataTypes } = Sequelize;

const SoalExam = db.define(
  "soal_exam",
  {
    kelasId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    questions: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

Kelas.hasMany(SoalExam);
SoalExam.belongsTo(Kelas, { foreignKey: "kelasId" });

export default SoalExam;
