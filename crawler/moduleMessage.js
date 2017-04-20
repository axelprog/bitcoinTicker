/**
 * Enum with message types
 * @type {{log: string, data: string, error: string}}
 */
MessageType ={
    log: 'log',
    data: 'data',
    error: 'error'
};

/**
 * Messages for communication between threads and the main application
 */
class ModuleMessage {
    /**
     *
     * @param { MessageType} type - type of the message
     * @param {string} name - the reporter module name
     * @param {*} data - the message data
     */
    constructor(type, name, data) {
        this.type = type;
        this.name = name;
        this.data = data;
    }
}


module.exports = {ModuleMessage, MessageType};