/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const db = require("../Configs/db")
const loggers = require("../Configs/wins")
const Sequelize = require("sequelize")
const Op = Sequelize.Op
const tb_categories = require("./categories")
const { where } = require("sequelize")

class Products {
    constructor() {
        this.Products = db.sequelize.define("Products", {
            id_product: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            name_product: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            price_product: {
                type: Sequelize.BIGINT,
                allowNull: false
            },
            id_category: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "Categories",
                    key: "id"
                }
            },
            image_product: {
                type: Sequelize.STRING,
                allowNull: false
            }
        })
        this.Products.belongsTo(tb_categories.Categories, {
            foreignKey: "id_category",
            as: "Categories"
        })
    }

    commit() {
        return new Promise((resolve, reject) => {
            this.Products.sync()
            .then(() => {
                resolve("Table Products created")
            })
            .catch((err) => {
                reject(err)
            })
        })
    }

    drop() {
        return new Promise((resolve, reject) => {
            this.Products.drop()
            .then(() => {
                resolve("Table Products deleted")
            })
            .catch((err) => {
                reject(err)
            })
        })
    }

    addProducts = (data) => {
        return new Promise((resolve, reject) => {
            if (data.name != undefined &&
                data.price != undefined &&
                data.idCategory != undefined &&
                data.image != undefined) {

                this.Products.findAll({
                    include: [
                        {
                            model: tb_categories.Categories,
                            as: "Categories",
                            attributes: ['name_category']
                        }
                    ],
                    attributes: [
                        'id_product',
                        'name_product',
                        'price_product',
                        'image_product',
                    ],
                    where: {name_product: data.name}
                })
                    .then((res) => {
                        if (res.length == 0) {
                            this.Products.create({
                                name_product: data.name,
                                price_product: data.price,
                                id_category: data.idCategory,
                                image_product: data.image
                            })
                                .then((res) => {
                                    resolve(data)
                                }).catch((err) => {
                                    loggers.warn("Failed add product", err)
                                    reject(err)
                                });
                        }
                        else {
                            resolve("Data already exists")
                        }
                    }).catch((err) => {
                        loggers.warn("Failed get product for add", err)
                        reject(err)
                    });
            }
            else {
                resolve("Make sure all data is filled.")
            }
        })
    }

    getProducts = () => {
        return new Promise((resolve, reject) => {
            this.Products.findAll({
                include: [
                    {
                        model: tb_categories.Categories,
                        as: "Categories",
                        attributes: ['name_category']
                    }
                ],
                attributes: [
                    'id_product',
                    'name_product',
                    'price_product',
                    'image_product',
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
                    loggers.warn("Failed get product", err)
                    reject(err);
                });
        })
    }

    searchProducts = (name) => {
        return new Promise((resolve, reject) => {
            this.Products.findAll({
                include: [
                    {
                        model: tb_categories.Categories,
                        as: "Categories",
                        attributes: ['name_category']
                    }
                ],
                attributes: [
                    'id_product',
                    'name_product',
                    'price_product',
                    'image_product',
                ],
                where: {name_product: name}
            })
                .then((res) => {
                    if (res.length == 0) {
                        resolve("Data not found")
                    }
                    else {
                        resolve(res)
                    }
                }).catch((err) => {
                    reject(err)
                });
        })
    }

    orderedAllProducts = (name = '', price = 0, category = 1, orderBy = 'name_product', order = 'DESC') => {
        return new Promise((resolve, reject) => {
            if (price == 0) {
                this.Products.findAll({
                    include: [
                        {
                            model: tb_categories.Categories,
                            as: "Categories",
                            attributes: ['name_category']
                        }
                    ],
                    attributes: [
                        'id_product',
                        'name_product',
                        'price_product',
                        'id_category',
                        'image_product',
                    ],
                    where: {
                        [Op.and]: [
                            {
                                name_product: {[Op.like]: `%${name}%`}
                            },
                            {
                                price_product: {[Op.gt]: Number(price)}
                            },
                            {
                                id_category: {[Op.gte]: category}
                            }
                        ]
                    },
                    order: [
                        [orderBy, order],
                    ]
                })
                    .then((res) => {
                        if (res.length == 0) {
                            resolve("Data not found")
                        }
                        else {
                            resolve(res)
                        }
                    }).catch((err) => {
                        loggers.warn("Failed search product", err)
                        reject(err)
                    });
            }
            else if (price != 0) {
                this.Products.findAll({
                    include: [
                        {
                            model: tb_categories.Categories,
                            as: "Categories",
                            attributes: ['name_category']
                        }
                    ],
                    attributes: [
                        'id_product',
                        'name_product',
                        'price_product',
                        'image_product',
                    ],
                    where: {
                        [Op.and]: [
                            {
                                name_product: {[Op.like]: `%${name}%`}
                            },
                            {
                                price_product: {[Op.lte]: Number(price)}
                            },
                            {
                                id_category: {[Op.gte]: category}
                            }
                        ]
                    },
                    order: [
                        [orderBy, order]
                    ]
                })
                    .then((res) => {
                        if (res.length == 0) {
                            resolve("Data not found")
                        }
                        else {
                            resolve(res)
                        }
                    }).catch((err) => {
                        loggers.warn("Failed search product", err)
                        reject(err)
                    });
            }
            else {
                resolve("Check your data input")
            }
        })
    }

    orderedProducts = (orderBy = 'name_product', order = 'ASC') => {
        return new Promise((resolve, reject) => {
            this.Products.findAll({
                include: [
                    {
                        model: tb_categories.Categories,
                        as: "Categories",
                        attributes: ['name_category']
                    }
                ],
                attributes: [
                    'id_product',
                    'name_product',
                    'price_product',
                    'id_category',
                    'image_product',
                ],
                order: [
                    [orderBy, order]
                ]
            })
                .then((res) => {
                    resolve(res)
                }).catch((err) => {
                    loggers.warn("Failed order product", err)
                    reject(err)
                });
        })
    }

    updateProducts(data) {
        return new Promise((resolve, reject) => {
            if (data.oldName == undefined) {
                resolve(`Old name must be filled`)
            }
            else {
                this.Products.findAll({
                    include: [
                        {
                            model: tb_categories.Categories,
                            as: "Categories",
                            attributes: ['name_category']
                        }
                    ],
                    attributes: [
                        'id_product',
                        'name_product',
                        'price_product',
                        'image_product',
                    ],
                    where: {
                        id_product: data.id
                    }
                })
                    .then((res) => {
                        if (res.length == 0) {
                            resolve(`Data with ID = ${data.id} doesn't exist`)
                        }
                        else {
                            if (data.name != undefined && data.price != undefined && data.idCategory != undefined && data.image != undefined) {
                                this.Products.update({
                                    name_product: data.name,
                                    price_product: data.price,
                                    id_category: data.idCategory,
                                    image_product: data.image,
                                },
                                {
                                    where: {id_product: data.id}
                                })
                                    .then((res) => {
                                        resolve(data)
                                    }).catch((err) => {
                                        reject(err);
                                    });
                            }
                            else {
                                resolve("Make sure all data is filled.")
                            }
                        }
                    }).catch((err) => {
                        reject(err);
                    });
            }
        })
    }

    delProducts(name) {
        return new Promise((resolve, reject) => {
            if (name != undefined) {
                this.Products.findAll({
                    include: [
                        {
                            model: tb_categories.Categories,
                            as: "Categories",
                            attributes: ['name_category']
                        }
                    ],
                    attributes: [
                        'id_product',
                        'name_product',
                        'price_product',
                        'image_product',
                    ],
                    where: {
                        name_product: name
                    }
                })
                    .then((res) => {
                        if (res.length != 0) {
                            this.Products.destroy({where: {name_product: name}})
                                .then((res) => {
                                    resolve(`Data with name = ${name} was deleted`)
                                }).catch((err) => {
                                    reject(err);
                                });
                        }
                        else {
                            resolve(`Data with name = ${name} doesn't exist`)
                        }
                    }).catch((err) => {
                        reject(err)
                    });
            }
            else {
                resolve(`Name must be filled`)
            }
        })
    }
}

module.exports = new Products()