
/**
 * functie care citeste un fisier CSV si formeaza grupurile pe baza informatiilor din fisier
 * @param {*} filePath - calea fisierului CSV ce trebuie citit
 * @returns {*} -returneaza un obiect care contine grupurile formate
 */
const path = require('path');
const fs = require('fs');


function readCSV(filePath) {
    try {
        const groups = []; // initializam un obiect gol pentru a stoca grupurile
        let groupIdCounter = 1; // initializam un contor pentru numele grupurilor
        if (!fs.existsSync(filePath)) {
            console.log("Fisierul pe care doriti sa-l cititi nu exista!");
        } else {
            const datafile = fs.readFileSync(filePath, 'utf-8');
            const lines = datafile.split('\n');
            console.log("ETAPA: 1 a inceput!");
            let index = 1;

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                // console.log(i)
                if (line.trim() === ' ' || line.trim() === 'id_consumer') {
                    continue;
                }

                const [id_consumer, parent_id] = line.trim().split(','); // separam linia in doua valori (id_consumer și parent_id)
                const foundGroups = findGroups(groups, id_consumer, parent_id); // gasesim grupurile existente carora apartin nodurile

                if (Object.keys(foundGroups).length === 0) {

                    createGroup(groups, id_consumer, parent_id, groupIdCounter++); // daca nu exista grupuri, se creeaza unul nou
                    // console.log(groups);
                    // process.exit(1);
                } else {

                    addToGroups(groups, foundGroups, id_consumer, parent_id); // altfel, se adauga nodurile la grupurile existente daca exista relatii intre noduri
                    // console.log(groups);
                    // process.exit(1);

                }

                if (i % 10000 === 0) { //verific sa vad daca merge functia(asta pentru ca am date foarte multe in fisier si nu vreau sa se blocheze undeva)
                    console.log("Inca merge " + index, new Date());
                    index++;
                }
                //console.log(i)
            }

            console.log("ETAPA 1 s-a incheiat!");
        }
        return {
            response: groups,
            error: null
        }

    } catch (error) {
        return {
            groups: null,
            error
        }

    }

}




/**
 * functie care creeaza un grup nou sau adauga nodurile la un grup existent in obiectul groups
 *
 * @param {*} groups - obiectul care contine toate grupurile, fiecare avand un nume unic
 * @param {*} id_consumer - identificatorul pentru consumatorul curent (nodul copil)
 * @param {*} parent_id - identificatorul pentru parintele consumatorului curent (nodul parinte)
 * @param {*} group_id - numarul care indica la ce grup sa fie adaugate nodurile sau sa fie creat un grup nou
 */
function createGroup(groups, id_consumer, parent_id, group_id) {

    const group_id_key = 'Grup ' + group_id; // construim cheia unica pentru grupul curent in obiectul groups
    const nodes = [id_consumer, parent_id]; // cream un array care contine identificatorii nodurilor id_consumer si parent_id.
    if (!groups[group_id_key]) {// verificam daca grupul cu cheia specificata exista deja in obiectul groups
        groups[group_id_key] = nodes;// daca grupul nu exista, il cream si adaugam nodurile la el


    }
    // console.log("AAAA", id_consumer, parent_id)
}




/**
 * functie care adauga nodurile la un grup existent sau le uneste cu un alt grup in obiectul groups
 *
 * @param {*} groups - obiectul care contine toate grupurile, fiecare avand un nume unic
 * @param {*} foundGroups - lista cu numele grupurilor gasite
 * @param {*} idConsumer - identificatorul pentru consumatorul curent (nodul copil)
 * @param {*} parentId - identificatorul pentru parintele consumatorului curent (nodul parinte)
 */
function addToGroups(groups, foundGroups, idConsumer, parentId) {
    const keysFound = Object.keys(foundGroups);
    const firstGroupKey = keysFound[0]; // pastreaza cheia primului grup
    const firstGroup = groups[firstGroupKey]; // iau primul grup
    // console.log(firstGroup);
    // process.exit(1);

    for (let i = 1; i < keysFound.length; i++) {
        const otherGroupKey = keysFound[i]; // iau cheia urmatorului grup 
        const otherGroup = groups[otherGroupKey];// iau urmatorul grup => [val1, val2, ...] 
        const combinedNodesSet = new Set([...firstGroup, ...otherGroup]);// concateneaza si elimina duplicarile folosind un Set
        const combinedNodes = [...combinedNodesSet];  // converteste Set inapoi la un array
        groups[firstGroupKey] = combinedNodes; // actualizeaza primul grup cu nodurile combinate
        delete groups[otherGroupKey]; // sterge grupul curent, deoarece nodurile lui au fost deja adaugate la primul grup
    }
    const finalGroupNodesSet = new Set([...groups[firstGroupKey], idConsumer, parentId]);// concateneaza si elimina duplicarile folosind un Set pentru lista finala de noduri
    const finalGroupNodes = [...finalGroupNodesSet]; // converteste Set inapoi la un array
    groups[firstGroupKey] = finalGroupNodes; // actualizeaza primul grup cu lista finala de noduri
}

//         for (let node of groups[firstGroup].concat(groups[otherGroup])) { // iteram prin fiecare nod din cele doua grupuri concatenate
//             let nodeAlreadyExists = false; // declaram o variabila de tip boolean, pentru a vedea daca un nod se afla sau nu in vreun grup
//             for (let existingNode of combinedNodes) { // iteram prin nodurile combinate
//                 if (existingNode === node) { // verificam daca nodul exista deja
//                     nodeAlreadyExists = true;
//                     break;
//                 }
//             }

//             if (!nodeAlreadyExists) { // daca nodul nu exista in lista de noduri combinate, il adaugam
//                 combinedNodes.push(node);
//             }
//         }
//         // console.log(firstGroup)
//         groups[keysFound[0]] = combinedNodes; // actualizam primul grup cu lista de noduri combinate
//         delete groups[keysFound[i]]; // stergem grupul curent, deoarece nodurile lui au fost deja adaugate la primul grup
//     }

//     const finalGroupNodes = []; // cream o lista pentru a stoca nodurile finale ale grupului
//     for (const node of groups[keysFound[0]].concat([idConsumer, parentId])) { // iteram prin fiecare nod din primul grup si adaugam nodurile la lista finala
//         let nodeAlreadyExists = false;
//         for (let existingNode of finalGroupNodes) { // iteram prin nodurile finale deja existente
//             if (existingNode === node) { // verificam daca nodul exista deja in lista finala
//                 nodeAlreadyExists = true;
//                 break;
//             }
//         }
//         if (!nodeAlreadyExists) { // daca nodul nu exista deja in lista finala
//             finalGroupNodes.push(node); // adaugam nodul la lista finala
//         }
//     }
//     groups[keysFound[0]] = finalGroupNodes; // actualizam primul grup cu lista finala de noduri
// }




/**
 * functie care gaseste grupurile care contin nodurile specificate
 * @param {*} groups - un obiect care contine grupurile existente
 * @param {*} id_consumer - id ul consumatorului pentru care se cauta grupuri
 * @param {*} parent_id - id ul parintelui pentru care se cauta grupuri
 * @returns {*} -  array cu id urile grupurilor care contin nodurile specificate
 */
// function findGroups(groups, id_consumer, parent_id) {
//     const foundGroups = []; // initializam un array gol pentru a stoca grupurile gasite
//     for (const groupId in groups) { // iteram prin fiecare grup existent
//         const nodes = groups[groupId]; // obtinem nodurile (id urile consumatorilor si parintilor) ale grupului
//         if (nodes.includes(id_consumer) || nodes.includes(parent_id)) {
//             foundGroups.push(groupId); // adaugam grupul la lista de grupuri gasite daca contine nodurile
//         }
//     }
//     return foundGroups; // returnam array ul de grupuri gasite
// }


// function findGroups(groups, id_consumer, parent_id) {
//     const foundGroups = []; // initializam un array gol pentru a stoca grupurile gasite
//     for (const [idGr, nodes] of Object.entries(groups)) {
//         const nodes = groups[idGr]; // obtinem nodurile (id urile consumatorilor si parintilor) ale grupului
//         // console.log(gr);
//         // process.exit(1);
//         let groupFound = false;
//         // console.log("A: ", nodes);
//         // process.exit(1);
//         for (let i = 0; i < nodes.length; i++) {
//             if (nodes[i] === id_consumer || nodes[i] === parent_id) {
//                 groupFound = true;
//                 break;
//             }
//         }

//         if (groupFound) {
//             foundGroups[idGr] = idGr;
//         }

//     }
//     return foundGroups;
// }




function findGroups(groups, id_consumer, parent_id) {
    const foundGroups = [];
    for (const [idGr, gr] of Object.entries(groups)) {
        if (gr[id_consumer] != undefined || gr[parent_id] != undefined) {
            foundGroups[idGr] = idGr;
        }
        // const nodes = groups[idGr];
        // console.log(nodes, gr[id_consumer]);
        // process.exit(1)
        // if (nodes.some(node => node === id_consumer || node === parent_id)) {
        //     foundGroups[idGr] = idGr;
        //     console.log(idGr);
        //     process.exit(1)
        // }
    }

    return foundGroups;
}


function writeFile(groups, fisier) {
    fs.appendFileSync(fisier, groups);
}

module.exports = {
    readCSV: readCSV,
    addToGroups: addToGroups,
    createGroup: createGroup,
    findGroups: findGroups,
    writeFile: writeFile
};



