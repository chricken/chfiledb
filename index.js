'use strict';

import fs from 'fs';
import settings from './settings.js';
import Connection from './classes/Connection.js';
import fileOp from './fileop.js';

const chfiledb = {
    init({ DBPath = false }) {
        // Wenn der Benutzer einen eigenen Datenpfad verwenden möchte
        if (DBPath) settings.DBPath = DBPath;
    },

    connect({
        dbName = '',
        autoCreate = true,
        debug = false
    }) {
        return fileOp.checkIfExists({dbName}).then( 

            exists => {
                console.log('exists', exists);
                
                if (exists) { 
                    return new Connection(dbName);
                } else if (autoCreate) {
                    return chfiledb.create(dbName, true).then(
                        () => new Connection(dbName)
                    )
                } else {
                    if(debug) console.log('Database does not exist and is not allowed to be created automaticaly');
                    throw(new Error('Database does not exist and is not allowed to be created automaticaly'))
                }
            }
        )
    },
    create(dbName, debug = false) {
        return new Promise((resolve, reject) => {
            fs.readdir(settings.dbPath, (err, files) => {
                // Schauen, ob der Datenbank-Pfad existiert
                if (err) {
                    // Fehler, wenn nicht
                    if (debug) console.log(err);
                    reject({
                        msg: 'The Database folder could not be found',
                    })
                } else {
                    // Schauen, ob die gewünschte Datenbank existiert
                    if (files) {
                        console.log(files);

                    }
                }
            })

        });
    },
    delete(dbName) {
    }

}

export default chfiledb;
export const db = chfiledb.db;
