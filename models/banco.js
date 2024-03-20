const Sequelize = require('sequelize');
const sequelize = new Sequelize("bd_cliente", "root", "", {
    host: "localhost",
    dialect: "mysql"
})

module.exports =
{
    Sequelize: Sequelize,
    sequelize: sequelize
}