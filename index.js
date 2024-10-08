'use strict';

import settings from './settings.js';
import Connection from './classes/Connection.js';
import fileOp from './fileop.js';

const chfiledb = {
    init({ DBPath = false }) {
        return new Promise(resolve => {
            // Wenn der Benutzer einen eigenen Datenpfad verwenden möchte
            // Backslashes ersetzen
            DBPath.replaceAll('\\', '/');
            
            // Checken, ob der Pfad mit "/" endet
            if(DBPath[DBPath.length-1] != '/')DBPath += '/';
            
            // Pfad ersetzen
            settings.dbPath = DBPath;
            console.log(settings);
            
            resolve({
                status: 'ok'
            });
        })
    },

    connect({
        dbName = '',
        autoCreate = true,
        debug = false
    }) {
        return fileOp.checkIfExists({ dbName }).then(

            exists => {
                if (exists) {
                    return new Connection(dbName);
                } else if (autoCreate) {
                    return chfiledb.create(dbName, true).then(
                        () => new Connection(dbName)
                    )
                } else {
                    if (debug) console.log('Database does not exist and is not allowed to be created automaticaly');
                    throw (new Error('Database does not exist and is not allowed to be created automaticaly'))
                }
            }
        )
    },
    empty({ dbName, debug = false }) {

    },
    create({ name = '', debug = false }) {
        return new Promise(resolve => {
            // Schauen, ob der Datenbank-Pfad existiert
            
            resolve(fileOp.createDB({name}));

        });
    },
    delete(dbName) {
    }

}

export default chfiledb;
export const db = chfiledb.db;

