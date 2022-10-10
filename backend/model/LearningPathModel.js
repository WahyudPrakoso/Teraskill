import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const LearningPath = db.define(
  "learning_path",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    desc:{
      type: DataTypes.TEXT
    },
    image: {
      type: DataTypes.STRING
    },
  },
  {
    freezeTableName: true,
  }
);

export default LearningPath;
