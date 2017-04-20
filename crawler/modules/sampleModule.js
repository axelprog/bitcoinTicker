const colors = require('colors');

class Module {
    static parse() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({message: 'all done'});
            }, 3000);
        });

    }
}

Module.moduleName = 'sampleModule';
Module.expires = new Date('11/1/17');

module.exports = Module;