import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Modul from "./ModulModel.js";

const { DataTypes } = Sequelize;

const Materi_Text = db.define(
  "materi_text",
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
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

Modul.hasOne(Materi_Text);
Materi_Text.belongsTo(Modul, { foreignKey: "modulId" });

export default Materi_Text;
