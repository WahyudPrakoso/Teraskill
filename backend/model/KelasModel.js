import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import LearningPath from "./LearningPathModel.js";
import Users from "./UsersModel.js";

const { DataTypes } = Sequelize;

const Kelas = db.define(
  "kelas",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    learningPathId: {
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
    },
    about: {
      type: DataTypes.TEXT,
    },
    tools: {
      type: DataTypes.TEXT,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_bg: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_viewed: {
      type: DataTypes.BOOLEAN,
    },
    jml_Materi_text: {
      type: DataTypes.INTEGER,
    },
    jml__materi_video: {
      type: DataTypes.INTEGER,
    },
  },
  {
    freezeTableName: true,
  }
);

LearningPath.hasMany(Kelas);
Kelas.belongsTo(LearningPath, { foreignKey: "learningPathId" });

Users.hasMany(Kelas);
Kelas.belongsTo(Users, { foreignKey: "userId" });

export default Kelas;
