import Sequelize from 'Sequelize';
const db = {}
const sequelize = new Sequelize('node_teraskill', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;