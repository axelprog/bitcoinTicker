const colors = require('colors');

class Module {
    static parse() {
        setTimeout(() => {
            process.send({
                child: process.pid,
                result: 'test data'
            });
            process.disconnect();
        }, 3000);
    }
}

Module.moduleName = 'sampleModule';
Module.expires = Date('11/1/17');

module.exports = Module;

process.on('message', (data) => {
    if (data.start) {
        Module.parse();
    }
});