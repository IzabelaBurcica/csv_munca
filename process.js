
const { fileName,
    filePath, folder } = require('./config.js')
// const { readCSV, writeFile } = require("./functions.js")

const { readcsv, writeFile, processCsvData } = require("./read.js")


const fs = require('fs')
const path = require('path');

var my_variable = true;
async function main() {
    try {
        const file = folder + fileName;
        //console.log(file);
        let data = '';
        let index = 1;

        //await console.log("am incarcat fisierul csv");
        const response = await readcsv(filePath);

const datac= processCsvData(response);
        //await console.log("am luat grupurile din fiserul csv")
        //displayGroups(response);
        try {


            //await console.log(response);
            //await console.log("incep sa scriu datele in fiser txt");
            for await (const [group, nodes] of Object.entries(datac)) {
                const group_data = group + " : " + nodes + "\n";
                data += group + " : " + nodes + "\n";
                // await console.log(group_data);

                // await writeFile(group_data, file);

            }
            // await writeFile(data, file);

            while (my_variable == true) {
                if (!fs.existsSync(file)) {
                    await writeFile(data, file);
                    my_variable = false;
                } else {
                    let name = path.basename(file.split(".")[0]);
                    // console.log(name);
                    // process.exit(1);
                    let extension = path.extname(file);
                    // console.log(extension);
                    // process.exit(1);
                    const newfile = folder + name + "_" + index + extension;
                    // console.log(newfile);
                    // process.exit(1);
                    if (!fs.existsSync(newfile)) {
                        await writeFile(data, newfile);
                        my_variable = false;
                    } else {
                        index += 1;
                    }

                }

            }

        } catch (err) {
            console.error(err);
        }

    } catch (error) {
        console.error('A aparut o eroare:', error.message);
    }
}

main();






