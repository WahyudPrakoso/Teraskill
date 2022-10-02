import Sequelize from 'Sequelize';
// const db = {}
const db = new Sequelize('node_teraskill', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

export default db;