require('express-async-errors');
const winston = require('winston');

module.exports = function () {
    //captura exceções síncronas desconhecidas do express() e salva no arquivo de log abaixo
    winston.handleExceptions(
        new winston.transports.Console({colorize: true, prettyPrint: true}),
        new winston.transports.File({ filename: 'uncaughtExceptions.log' }));

    //captura exceções assíncronas lançadas por promises()
    process.on('unhandleRejection', (ex) => {
        throw ex;
    })
    //faz o log dos exceptions do express no arquivo de log
    winston.add(winston.transports.File, { filename: 'logfile.log' });
}