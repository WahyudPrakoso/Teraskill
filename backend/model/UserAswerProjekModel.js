import { Sequelize } from "sequelize";
import db from "../config/database.js";
import User from "./UserModel.js";
import SoalProjek from "./SoalProjekModel.js";

const { DataTypes } = Sequelize;

const UserAnswerProjek = db.define(
  "user_aswer_projek",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    soalId:{
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    jawaban: {
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
UserAnswerProjek.belongsTo(SoalProjek, { foreignKey: "kelasId" });
UserAnswerProjek.belongsTo(User, { foreignKey: "userId" });

export default UserAnswerProjek;
