import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Kelas_User from "./KelasUserModel.js";

const { DataTypes } = Sequelize;

const Exam = db.define(
  "exam",
  {
    kelasUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    soal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

Kelas_User.hasOne(Exam);
Exam.belongsTo(Kelas_User, { foreignKey: "kelasUserId" });

export default Exam;
