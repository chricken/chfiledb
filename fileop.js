'use strict';

import fs from 'fs';
import settings from './settings.js';

const fileOp = {
    loadJSON(url = '') {
        return new Promise((resolve, reject) => {
            if (!url) reject({ msg: 'No path assigned' });
            else {
                // Datei laden
                fs.readFile(url, (err, data) => {
                    if (err) reject({ msg: 'Error while fetching file', err })
                    else resolve(JSON.parse(data.toString()));
                })
            }
        })
    },
    saveJSON({ }) {

    },
    appendJSON({ }) {

    },
    delete({ }) {

    },
    checkIfExists({ dbName }) {
        return new Promise((resolve, reject) => {
            // Soll nur ein Boolean liefern, ob die Datei existiert
            fs.readFile(
                `${settings.dbPath}${dbName}.json`,
                err => {
                    if (err) resolve(false)
                    else resolve(true)
                }
            )
        })
    },
}

export default fileOp;