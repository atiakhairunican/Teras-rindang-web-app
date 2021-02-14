/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const db = require("../Configs/db")
const loggers = require("../Configs/wins")
const Sequelize = require("sequelize")

class Histories {
    constructor() {
        this.Histories = db.sequelize.define("Histories", {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            cashier: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            date: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            orders: {
                type: Sequelize.STRING,
                allowNull: false
            },
            amount: {
                type: Sequelize.BIGINT,
                allowNull: false
            }
        })
    }

    commit() {
        return new Promise((resolve, reject) => {
            this.Histories.sync()
            .then(() => {
                resolve("Table Histories created")
            })
            .catch((err) => {
                reject(err)
            })
        })
    }

    drop() {
        return new Promise((resolve, reject) => {
            this.Histories.drop()
            .then(() => {
                resolve("Table Histories deleted")
            })
            .catch((err) => {
                reject(err)
            })
        })
    }

    addHistories(data) {
        return new Promise((resolve, reject) => {
            if (data.cashier != undefined &&
                data.date != undefined &&
                data.orders != undefined &&
                data.amount != undefined) {
                    this.Histories.create({
                        cashier: data.cashier,
                        date: data.date,
                        orders: data.orders,
                        amount: data.amount
                    })
                        .then((res) => {
                            resolve(data)
                        }).catch((err) => {
                            loggers.warn("Failed add Histories", err)
                            reject(err)
                        });
                }
            else {
                resolve("Make sure all data is filled.")
            }
        })
    }

    getHistories() {
        return new Promise((resolve, reject) => {
            this.Histories.findAll()
                .then((res) => {
                    if (res.length == 0) {
                        resolve("Data is empty");
                    }
                    else {
                        resolve(res);
                    }
                }).catch((err) => {
                    loggers.warn("Failed get all Histories", err)
                    reject(err);
                });
        })
    }

    updateHistories(data) {
        return new Promise((resolve, reject) => {
            this.Histories.findAll({
                attributes: ['id', 'cashier', 'date', 'orders', 'amount'],
                where: {id: data.id}
            })
                .then((res) => {
                    if (res.length == 0) {
                        resolve(`Data with ID = ${data.id} doesn't exist`)
                    }
                    else {
                        this.Histories.update({
                            cashier: data.cashier,
                            date: data.date,
                            orders: data.orders,
                            amount: data.amount
                        },
                        {
                            where: {id: data.id}
                        })
                            .then((res) => {
                                resolve(data)
                            }).catch((err) => {
                                loggers.warn("Failed update Histories", err)
                                reject(err);
                            });
                    }
                }).catch((err) => {
                    loggers.warn("Something wrong when update Histories", err)
                    reject(err);
                });
            
        })
    }

    delHistories(id) {
        return new Promise((resolve, reject) => {
            this.Histories.findAll({
                where: {id: id}
            })
                .then((res) => {
                    if (res.length == 0) {
                        resolve(`Data with ID = ${id} doesn't exist`)
                    }
                    else {
                        this.Histories.destroy({
                            where: {id: id}
                        })
                            .then((res) => {
                                resolve(`Data with ID = ${id} was deleted`)
                            }).catch((err) => {
                                loggers.warn("Failed delete Histories", err)
                                reject(err);
                            });
                    }
                }).catch((err) => {
                    loggers.warn("Something wrong when delete Histories", err)
                    reject(err);
                });
        })
    }
}

module.exports = new Histories()