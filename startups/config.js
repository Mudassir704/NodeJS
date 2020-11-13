const config = require('config');

module.exports = function () {
    if(!config.get('jwtPrivateKey')) {
        console.error("FATAL ERROR: jwt key is not defined...");
        process.exit(1);
    }    
}