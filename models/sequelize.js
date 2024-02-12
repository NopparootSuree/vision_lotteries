const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../configs/db.config')

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.lottery = require('./lotteries_model')(sequelize, DataTypes)
db.authen = require('./authen_model')(sequelize, DataTypes)

db.sequelize.sync({ force: false })
    .then(() => {
        console.log("Sync is Completed");
    })
    .catch((err) => {
        console.log("Failed is Sync", err);
    })

module.exports = db