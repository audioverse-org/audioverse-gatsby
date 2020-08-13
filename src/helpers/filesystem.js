const fs = require('fs');

exports.getFile = (projectRelativePath) => {
    return fs.readFile( `${__dirname}/${projectRelativePath}`, (err, data) => {
        return (err) ? null : data.toString()
    });
}