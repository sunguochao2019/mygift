if (process.env.NODE_ENV == "production") {
    module.exports = {
        mongoURL: 'mongodb://127.0.0.1/node-app'
    }
} else {
    module.exports = {
        mongoURL: 'mongodb://127.0.0.1/node-app'
    }

}