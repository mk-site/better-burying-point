const fs = require('fs');
const rollup = require('rollup');
const zlib = require('zlib');
const terser = require('terser');
const configs = require('./configs');
if (!fs.existsSync('lib')) {
    fs.mkdirSync('lib')
}
function build (configs) {
  let count = 0
  const total = configs.length
  const next = () => {
    buildSingle(configs[count])
      .then(() => {
        count++
        if (count < total) {
          next()
        }
      })
      .catch(function(e) {
        console.log(e)
      });
  }
  next()
}
build(configs);
function buildSingle({input, output}) {
    const isProduction = /min\.js$/.test(output.file)
    return rollup.rollup(input)
    .then(bundle => bundle.generate(output))
    .then(bundle => {
        // console.log(bundle)
        const code = bundle.output[0].code
        if (isProduction) {
            const minified = terser.minify(code, {
                toplevel: true,
                output: {
                ascii_only: true
                },
                compress: {
                pure_funcs: ['makeMap']
                }
            }).code;
            return writeFile(output.file, minified, true);
          } else {
            return writeFile(output.file, code);
          }
    })
}
function writeFile(file,code, minify) {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, code, err => {
            if (err) {
                console.log(err);
                return reject(err);
            }
            if (minify) {
                zlib.gzip(code, (err, zipped) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    }
                    resolve()
                })
            } else {
                resolve()
            }
        });
    });
};
