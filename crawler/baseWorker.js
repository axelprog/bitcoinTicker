const ModuleMessage = require('./moduleMessage');

const modulePath = process.argv[2];

if (modulePath) {
    module = require(modulePath);
}
process.send(new ModuleMessage('log', module.name, `Module ${modulePath} was loaded`));

module.parse().then((result) => {
    process.send(new ModuleMessage('data', module.name, result));

    process.send(new ModuleMessage('log', module.name, `Module ${modulePath} has finished the work. Result: ${JSON.stringify(result)}`));

    process.disconnect();
}, (reject) => {
    process.send(new ModuleMessage('log', module.name, `Module ${modulePath} return error. Result: ${JSON.stringify(reject)}`));

    process.disconnect();
})
    .catch((reject) => {
        process.send(new ModuleMessage('error', module.name, `Module ${modulePath} return error. Result: ${JSON.stringify(reject)}`));
    });

process.send(new ModuleMessage('log', module.name, `Parsing was began`));
