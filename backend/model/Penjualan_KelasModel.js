import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Kelas from "./KelasModel.js";
import Users from "./UsersModel.js";

const { DataTypes } = Sequelize;

const PenjualanKelas = db.define(
  "penjualan_kelas",
  {
    kelasId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
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

Kelas.hasMany(PenjualanKelas);
PenjualanKelas.belongsTo(Kelas, { foreignKey: "kelasId" });

export default PenjualanKelas;
