import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Users from "../model/UserModel.js";

const {DataTypes} = Sequelize;

const Product = db.define('product',{
    user_id:{
        type : DataTypes.INTEGER,
        allowNull : false,
        validate : {
            notEmpty : true
        }
    },
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
    price:{
        type : DataTypes.INTEGER,
        allowNull : false,
        validate : {
            notEmpty : true
        }
    }
}, {
    freezeTableName: true
});

// Users.hasMany(Product);
Product.belongsTo(Users, {foreignKey : 'user_id'});

export default Product;