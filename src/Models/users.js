/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const db = require("../Configs/db")
const loggers = require("../Configs/wins")
const Sequelize = require("sequelize")

class Users {
    constructor() {
        this.Users = db.sequelize.define("Users", {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            email: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            role: {
                type: Sequelize.STRING(20),
                allowNull: false
            }
        })
    }

    commit() {
        return new Promise((resolve, reject) => {
            this.Users.sync()
            .then(() => {
                resolve("Table Users created")
            })
            .catch((err) => {
                reject(err)
            })
        })
    }

    drop() {
        return new Promise((resolve, reject) => {
            this.Users.drop()
            .then(() => {
                resolve("Table Users deleted")
            })
            .catch((err) => {
                reject(err)
            })
        })
    }

    add(data) {
        return new Promise((resolve, reject) => {
            this.Users.create({
                name: data.name,
                email: data.email,
                password: data.password,
                role: data.role
            })
                .then((res) => {
                    resolve(data)
                }).catch((err) => {
                    loggers.warn("Failed add users", err)
                    reject(err)
                });
        })
    }

    getAll() {
        return new Promise((resolve, reject) => {
            this.Users.findAll({
                attributes: ['id', 'name', 'email', 'password', 'role'],
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
                    loggers.warn("Failed get all users", err)
                    reject(err);
                });
        })
    }

    getByEmail(email) {
        return new Promise((resolve, reject) => {
            this.Users.findAll({
                attributes: ['id', 'name', 'email', 'password', 'role'],
                where: {email: email}
            })
                .then((res) => {
                    resolve(res)
                }).catch((err) => {
                    loggers.warn("Failed get email users", err)
                    reject(err);
                });
        })
    }

    update(data) {
        return new Promise((resolve, reject) => {
            this.Users.findAll({
                attributes: ['id', 'name', 'email', 'password', 'role'],
                where: {id: data.id}
            })
                .then((res) => {
                    if (res.length == 0) {
                        resolve(`Data with ID = ${data.id} doesn't exist`)
                    }
                    else {
                        this.Users.update({
                            name: data.name,
                            email: data.email,
                            password: data.password,
                            role: data.role
                        },
                        {
                            where: {id: data.id}
                        })
                            .then((res) => {
                                resolve(data)
                            }).catch((err) => {
                                loggers.warn("Failed update users", err)
                                reject(err);
                            });
                    }
                }).catch((err) => {
                    loggers.warn("Failed get data users", err)
                    reject(err);
                });
            
        })
    }

    del(id) {
        return new Promise((resolve, reject) => {
            this.Users.findAll({where: {id: id}})
                .then((res) => {
                    if (res.length == 0) {
                        resolve(`Data with ID = ${id} doesn't exist`)
                    }
                    else {
                        this.Users.destroy({where: {id: id}})
                            .then((res) => {
                                resolve(`Data with ID = ${id} was deleted`)
                            }).catch((err) => {
                                loggers.warn("Failed delete users", err)
                                reject(err);
                            });
                    }
                }).catch((err) => {
                    loggers.warn("Failed get id users", err)
                    reject(err);
                });
        })
    }
}

module.exports = new Users()