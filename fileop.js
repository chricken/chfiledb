'use strict';

import fs from 'fs';
import settings from './settings.js';

// Datenbanken müssen ordner sein, in denen die Dokuments als JSON-Dateien liegen

const fileOp = {
    pathFiles: '',
    loadDirList({ url = '', debug = false }) {
        return new Promise(resolve => {
            console.log('load List', url);
            fs.readdir(url, (err, res) => {
                if (err) {
                    // Wenn ein Fehler geschieht und der debug-Parameter gesetzt ist, mach eine Ausgabe
                    if (debug) console.log(err);
                    resolve({
                        status: 'err',
                        msg: err
                    })
                }
                else resolve({
                    status: 'ok',
                    payload: res
                })
            })
        })

    },
    loadJSON({ url = '', debug = false }) {
        return new Promise(resolve => {
            // Muss immer resolven, damit das abfragende Element eine zuverlässige Meldung bekommt
            if (!url) resolve({
                status: 'err',
                msg: 'No path assigned'
            });
            else {
                // Datei laden
                fs.readFile(url, (err, data) => {
                    if (err) {
                        // Wenn ein Fehler geschieht und der debug-Parameter gesetzt ist, mach eine Ausgabe
                        if (debug) console.log(err);
                        resolve({
                            status: 'err',
                            msg: err
                        })
                    }
                    else resolve({
                        status: 'ok',
                        payload: JSON.parse(data.toString())
                    });
                })
            }
        })
    },
    saveJSON({ url = '', payload = {}, overwrite = true, debug = false }) {
        return new Promise(resolve => {
            // Muss immer resolven, damit das abfragende Element eine zuverlässige Meldung bekommt
            if (!url) resolve({
                status: 'err',
                msg: 'No path assigned'
            });
            else {
                console.log('save', url, payload);
                
                fs.access(url, err => {
                    if (err || overwrite) {
                        // Datei existiert nicht, kann problemlos geschrieben werden
                        // oder das überschreiben-Flag wurde gesetzt
                        fs.writeFile(
                            url,
                            JSON.stringify(payload),
                            err => {
                                if (err) {
                                    if (debug) console.log(err);
                                    resolve({
                                        status: 'err',
                                        msg: `Problem while writing Document ${JSON.stringify(payload)}`
                                    })
                                } else {
                                    resolve({
                                        status: 'ok'
                                    })
                                }
                            })
                    } else {
                        // Datei existiert bereits
                        resolve({
                            status: 'err',
                            msg: `File ${payload.id} already exists`
                        })
                    }
                })
            }
        })
    },
    appendJSON({ }) {

    },
    delete({ }) {

    },
    checkIfExists({ dbName }) {
        return new Promise(resolve => {
            // Datei laden und bei Erfolg kann darauf zugegriffen werden
            fs.access(
                `${fileOp.pathFiles}${dbName}`,
                err => {
                    if (err) resolve({
                        status: 'ok',
                        payload: false
                    })
                    else resolve({
                        status: 'ok',
                        payload: true
                    })
                }
            )
        })
    }
}

'use strict';

let path = new URL(import.meta.url).pathname;
fileOp.pathFiles = `${path.substring(0, path.lastIndexOf('/') + 1)}${settings.dbPath}`.substring(1);
// console.log(fileOp);

export default fileOp;