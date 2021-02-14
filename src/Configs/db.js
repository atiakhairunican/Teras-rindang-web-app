/* eslint-disable no-undef */
const { Sequelize } = require("sequelize")

class Connect {
    constructor() {
        this.sequelize = new Sequelize(
            process.env.DBNAME,
            process.env.DBUSER,
            process.env.DBPASSWORD,
            {
                dialect: "postgres",
                host: process.env.DBHOST,
                port: process.env.DBPORT
            }
        )
    }

    ConnectTest() {
        this.sequelize.authenticate()
        .then(() => {
            console.log("Connect with sequelize");
        })
        .catch((err) => {
            console.log(err);
        })
    }
}

module.exports = new Connect()