import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import SoalExam from "./SoalExamModel.js";

const { DataTypes } = Sequelize;

const OptionExam = db.define(
  "option_exam",
  {
    soalId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    tittle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    correct: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

SoalExam.hasMany(OptionExam);
OptionExam.belongsTo(SoalExam, { foreignKey: "soalId" });

export default OptionExam;
