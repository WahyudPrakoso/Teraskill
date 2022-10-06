import { Sequelize } from "sequelize";
import db from "../config/database.js";
import User from "./UserModel.js";
import SoalProjek from "./SoalProjekModel.js";

const { DataTypes } = Sequelize;

const UserAnswerProjek = db.define(
  "user_aswer_projek",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
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
    soalProjekId:{
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    projek: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

User.hasMany(UserAnswerProjek);
SoalProjek.hasOne(UserAnswerProjek);
UserAnswerProjek.belongsTo(SoalProjek, { foreignKey: "soalProjekId" });
UserAnswerProjek.belongsTo(User, { foreignKey: "userId" });

export default UserAnswerProjek;
