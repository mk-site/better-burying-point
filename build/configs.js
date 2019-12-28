const path = require('path')
const replace = require('@rollup/plugin-replace');
const buble = require('@rollup/plugin-buble');
const nodeResolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const version = process.argv[2] || require('../package.json').version;
const banner =
    `/*!
  * better-burying-point v${version}
  * (c) ${new Date().getFullYear()} huxing
  * @license MIT
  */`;
const resolve = function(str){
    return path.resolve(__dirname, '../', str);
};
let configs = [{
    file: resolve('lib/better-burying-point.js'),
    format: 'umd',
    env: 'development'
}, {
    file: resolve('lib/better-burying-point.min.js'),
    format: 'umd',
    env: 'production'
}, {
    file: resolve('lib/better-burying-point.common.js'),
    format: 'cjs'
}, {
    file: resolve('lib/better-burying-point.esm.js'),
    format: 'es'
}];

module.exports = configs.map(option => {
    let config = {
        input: {
            input: resolve('src/index.js'),
            plugins: [
                buble(),
                nodeResolve(),
                commonjs(),
                replace({
                    __VERSION__: version
                })
            ]
        },
        output: {
            file: option.file,
            format: option.format,
            banner,
            name: 'BetterBuryingPoint'
        }
    }
    return config;
});