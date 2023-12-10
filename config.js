// const filePath = 'bifurcatii.csv'; //PROD
const filePath = 'csv_data.csv'; //DEV

const folder = __dirname + '/GROUPS/';
let fileName = 'Grupuri.txt';

const fs = require('fs')

if (!fs.existsSync(folder)) { // daca folderul GROUPS nu exista, il creez
    fs.mkdirSync(folder, { recursive: true });
}

module.exports = Object.assign(
    {},
    {
        fileName,
        filePath,
        folder
    }
);

