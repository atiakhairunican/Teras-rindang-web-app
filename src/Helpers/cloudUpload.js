const { uploader } = require("cloudinary").v2
const loggers = require("../Configs/wins")

async function uploads(filePath) {
    try {
        let result = await uploader.upload(filePath, {
            folder: "products",
            use_filename: true
        })
        loggers.info("Image was uploaded", result.url)
        return result.url
    } catch (error) {
        loggers.warn("Upload image failed", error);
        throw error
    }
}

module.exports = uploads