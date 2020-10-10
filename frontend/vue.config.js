module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
    ? '/packComp/'
    : '/',
    "transpileDependencies": [
        "vuetify"
    ]
}