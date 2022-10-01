import { Sequelize } from "sequelize";
import db from "../config/database.js";

const {DataTypes} = Sequelize;

const User = db.sequelize.define('user',{
    uuid:{
        type : DataTypes.STRING,
        defaultValue : DataTypes.UUIDV4,
        allowNull : false,
        validate : {
            notEmpty : true
        }
    },
    name:{
        type : DataTypes.STRING,
        allowNull : false,
        validate : {
            notEmpty : true,
            len : [3, 100]
        }
    },
    email:{
        type : DataTypes.STRING,
        allowNull : false,
        validate : {
            notEmpty : true,
            isEmail : true
        }
    },
    no_hp:{
        type : DataTypes.STRING,
    },
    password:{
        type : DataTypes.STRING,
        allowNull : false,
        validate : {
            notEmpty : true,
        }
    },
    role:{
        type : DataTypes.STRING,
        allowNull : false,
        validate : {
            notEmpty : true
        }
    },
    avatar: {
      type: DataTypes.STRING
    },
    is_verified:{
        type : DataTypes.BOOLEAN
    },
    verify_email: {
      type: DataTypes.TEXT
    },
    refresh_token: {
      type: DataTypes.TEXT
    },
    reset_password_link: {
      type: DataTypes.STRING
    },
}, {
    freezeTableName: true
});

export default User;