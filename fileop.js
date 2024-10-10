'use strict';

import fs from 'fs';
import settings from './settings.js';

// Datenbanken müssen ordner sein, in denen die Dokuments als JSON-Dateien liegen

const fileOp = {
    pathFiles: '',
    loadDirList({ url = '', debug = false }) {
        return new Promise(resolve => {
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
                            msg: `Document could not be loaded`
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
            if (!url) {
                resolve({
                    status: 'err',
                    msg: 'No path assigned'
                });
            } else {
                // Prüfen, ob die Datei existiert
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
    createDB({ dbName, debug = false }) {
        return new Promise(resolve => {
            // Eltern-URL aller Datenbank-Ordner
            let url = settings.dbPath;

            fs.readdir(url, (err, files) => {
                if (err) {
                    if (debug) console.log(err);
                    resolve({
                        status: 'err',
                        msg: `The main Database folder ${settings.dbPath} could not be found`
                    })
                } else {
                    // Schauen, ob die gewünschte Datenbank existiert
                    // Gewünschte URL der neuen Datenbank
                    url += dbName + '/';
                    if (!files.includes(dbName)) {
                        fs.mkdir(url, err => {
                            if (err) {
                                if (debug) console.log(debug);
                                resolve({
                                    status: 'err',
                                    msg: `Datenbank konnte im Ordner ${url} nicht angelegt werden`
                                })
                            } else {
                                resolve({ status: 'ok' })
                            }
                        })
                    } else {
                        resolve({ status: 'ok' })
                    }
                }
            })
        })
    },
    deleteDB({ dbName, debug = false }) {
        
        let url = settings.dbPath;

        return new Promise(resolve => {

            // console.log(url);
            fs.readdir(url + dbName, (err, files) => {
                if (err && debug) console.log(err);
                if (!err) {
                    // Alle enthaltenen Dateien löschen
                    resolve(Promise.all(files.map(file => {
                        return new Promise(resolve => {
                            // Eine Datei löschen
                            fs.rm(url + dbName + '/' + file, err => {
                                if (!err) {
                                    resolve(file)
                                } else {
                                    if (debug) console.log(file + ' could not be deleted');
                                    resolve('err ' + file)
                                }
                            })
                        })
                    })))
                } else {
                    // Wenn es einen Fehler gegeben hat, dann existiert der Ordner nicht und muss nicht gelöscht werden
                    resolve({
                        status: 'ok'
                    })
                }
            })
        }).then(
            res => {
                return new Promise(resolve => {
                    // Verzeichnis löschen, nachdem der Inhalt entfernt wurde
                    fs.rmdir(url + dbName, err => {
                        if (err) {
                            if (debug) console.log(err);
                            resolve({
                                status: 'err',
                                msg: 'Error while deleting the database'
                            })
                        } else {
                            resolve({
                                status: 'ok'
                            })
                        }
                    })
                })
            }
        )
    },
    deleteJSON({ url = '', debug = false }) {
        return new Promise(resolve => {
            fs.access(url, err => {
                if (!err) {
                    // Datei existiert, kann gelöscht werden
                    fs.rm(url, err => {
                        if (err) {
                            // Wenn ein Fehler geschieht und der debug-Parameter gesetzt ist, mach eine Ausgabe
                            if (debug) console.log(err);
                            resolve({
                                status: 'err',
                                msg: err
                            })
                        }
                        else resolve({
                            status: 'ok'
                        });
                    })
                } else {
                    // Detei existiert nicht
                    resolve({
                        status: 'err',
                        msg: `File does not exist`
                    })
                }
            })
        })
    },
    checkIfExists({ dbName = 'empty' }) {
        // console.log('checkIfExists', dbName);

        return new Promise(resolve => {
            // Datei laden und bei Erfolg kann darauf zugegriffen werden
            fs.access(
                `${settings.dbPath}${dbName}`,
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