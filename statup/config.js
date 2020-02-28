const config = require('config');

module.exports = function () {
    //verifica se a jwtPrivateKey foi consfigurada como variável de ambiente
    if (!config.get('jwtPrivateKey')) {
        throw new Error('FATAL ERROR...jwtPrivateKey is not difined...');
    }
}