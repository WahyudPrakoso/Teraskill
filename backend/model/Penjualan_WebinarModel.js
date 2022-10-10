import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const PenjulanWebinar = db.define(
  "penjualan_webinar",
  {
    tanggal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bulan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tahun: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

export default PenjulanWebinar;
