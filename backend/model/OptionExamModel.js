import { Sequelize } from "sequelize";
import db from "../config/database.js";
import SoalExam from "./SoalExamModel.js";

const { DataTypes } = Sequelize;

const OptionExam = db.define(
  "option_exam",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    soalExamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    correct_answer: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

SoalExam.hasMany(OptionExam);
OptionExam.belongsTo(SoalExam, { foreignKey: "soalExamId" });

export default OptionExam;
