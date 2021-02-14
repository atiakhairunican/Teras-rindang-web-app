/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const db = require("../Configs/db")
const loggers = require("../Configs/wins")
const Sequelize = require("sequelize")

class Categories {
    constructor() {
        this.Categories = db.sequelize.define("Categories", {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            name_category: {
                type: Sequelize.STRING(50),
                allowNull: false
            }
        })
    }

    commit() {
        return new Promise((resolve, reject) => {
            this.Categories.sync()
            .then(() => {
                resolve("Table Categories created")
            })
            .catch((err) => {
                reject(err)
            })
        })
    }

    drop() {
        return new Promise((resolve, reject) => {
            this.Categories.drop()
            .then(() => {
                resolve("Table Categories deleted")
            })
            .catch((err) => {
                reject(err)
            })
        })
    }

    addCategories(data) {
        return new Promise((resolve, reject) => {
            this.Categories.findAll({
                attributes: ['id', 'name_category'],
                where: {name_category: data.name}
            })
                .then((res) => {
                    if (res.length == 0) {
                        this.Categories.create({
                            name_category: data.name,
                        })
                            .then((res) => {
                                resolve(data)
                            }).catch((err) => {
                                loggers.warn("Failed add Categories", err)
                                reject(err)
                            });
                    }
                    else {
                        resolve(`Data with name = ${data.name} does exist`)
                    }
                }).catch((err) => {
                    loggers.warn("Something wrong when add Categories", err)
                    reject(err)
                });
            
        })
    }

    getCategories() {
        return new Promise((resolve, reject) => {
            this.Categories.findAll({
                attributes: ['id', 'name_category'],
                order: [
                    ['id', 'DESC']
                ]
            })
                .then((res) => {
                    if (res.length == 0) {
                        resolve("Data is empty");
                    }
                    else {
                        resolve(res);
                    }
                }).catch((err) => {
                    loggers.warn("Failed get all Categories", err)
                    reject(err);
                });
        })
    }

    updateCategories(data) {
        return new Promise((resolve, reject) => {
            this.Categories.findAll({
                attributes: ['id', 'name_category'],
                where: {id: data.id}
            })
                .then((res) => {
                    if (res.length == 0) {
                        resolve(`Data with ID = ${data.id} doesn't exist`)
                    }
                    else {
                        this.Categories.update({
                            name_category: data.name
                        },
                        {
                            where: {id: data.id}
                        })
                            .then((res) => {
                                resolve(data)
                            }).catch((err) => {
                                loggers.warn("Failed update Categories", err)
                                reject(err);
                            });
                    }
                }).catch((err) => {
                    loggers.warn("Something wrong when update Categories", err)
                    reject(err);
                });
            
        })
    }

    delCategories(id) {
        return new Promise((resolve, reject) => {
            this.Categories.findAll({
                attributes: ['id', 'name_category'],
                where: {id: id}
            })
                .then((res) => {
                    if (res.length == 0) {
                        resolve(`Data with ID = ${id} doesn't exist`)
                    }
                    else {
                        this.Categories.destroy({where: {id: id}})
                            .then((res) => {
                                resolve(`Data with ID = ${id} was deleted`)
                            }).catch((err) => {
                                loggers.warn("Failed delete Categories", err)
                                reject(err);
                            });
                    }
                }).catch((err) => {
                    loggers.warn("Something wrong when delete Categories", err)
                    reject(err);
                });
        })
    }
}

module.exports = new Categories()