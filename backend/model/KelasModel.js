import { Sequelize } from "sequelize";
import db from "../config/database.js";
import LearningPath from "./LearningPathModel.js";
import Users from "./UserModel.js";

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
      type: DataTypes.STRING
    },
    image_bg: {
      type: DataTypes.STRING
    },
    is_published: {
      type: DataTypes.BOOLEAN,
    },
    jml_Materi_text: {
      type: DataTypes.INTEGER,
    },
    jml__materi_video: {
      type: DataTypes.INTEGER,
    },
    link_grub : {
      type : DataTypes.STRING
    }
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
