const ModuleMessage = require('./moduleMessage').ModuleMessage;

const modulePath = process.argv[2];

/**
 * it is the main thread running module. It loads a module, and process data from it
 */

if (!modulePath) { //exit on the error
    process.send(new ModuleMessage('log', module.moduleName, `Module ${modulePath} doesn't have module path`));
    process.disconnect();
}

//load a crawler module
module = require(modulePath);

//send log for the debug
process.send(new ModuleMessage('log', module.moduleName, `Module ${modulePath} was loaded`));

//run the parsing process
module.parse().then((result) => {
    //on the success end
    process.send(new ModuleMessage('data', module.moduleName, result));
    process.send(new ModuleMessage('log', module.moduleName, `Module ${modulePath} has finished the work. Result: ${JSON.stringify(result)}`));
    process.disconnect();
}, (reject) => {
    //on the error end
    process.send(new ModuleMessage('log', module.moduleName, `Module ${modulePath} return error. Result: ${JSON.stringify(reject)}`));
    process.disconnect();
})
    .catch((reject) => {
        //on the error
        process.send(new ModuleMessage('error', module.moduleName, `Module ${modulePath} return error. Result: ${JSON.stringify(reject)}`));
        process.disconnect();
    });

//send log for the debug
process.send(new ModuleMessage('log', module.moduleName, `Parsing was began`));
