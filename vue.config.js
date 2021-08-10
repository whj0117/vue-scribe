module.exports = {
    publicPath:'./',
    outputDir:'dist',
    lintOnSave: process.env.NODE_ENV === 'development',
    chainWebpack: config => {
        config.when(process.env.NODE_ENV === 'production', config => {
            config.entry('app').clear().add('./src/components/index.js')
        })
    }
}
