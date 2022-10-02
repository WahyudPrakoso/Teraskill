import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Modul from "./ModulModel.js";

const { DataTypes } = Sequelize;

const Materi_Video = db.define(
  "materi_video",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    modulId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

Modul.hasOne(Materi_Video);
Materi_Video.belongsTo(Modul, { foreignKey: "modulId" });

export default Materi_Video;
