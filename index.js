'use strict';

import settings from './settings.js';
import Connection from './classes/Connection.js';
import fileOp from './fileop.js';

import cache from './cache.js';

const chfiledb = {
    init({ DBPath = false } = {}) {
        return new Promise(resolve => {
            // Wenn der Benutzer einen eigenen Datenpfad verwenden möchte
            // Backslashes ersetzen
            DBPath.replaceAll('\\', '/');

            // Checken, ob der Pfad mit "/" endet
            if (DBPath[DBPath.length - 1] != '/') DBPath += '/';

            // Pfad ersetzen
            settings.dbPath = DBPath;
            console.log(settings);

            resolve({
                status: 'ok'
            });
        })
    },

    connect({
        dbName = 'empty',
        autoCreate = true,
        debug = false
    } = {}) {
        // console.log('connect', dbName);
        // Cache-Objekt anlegen
        if (!cache[dbName])
            cache[dbName] = {};

        return fileOp.checkIfExists({ dbName }).then(

            res => {
                // console.log('connect', dbName, autoCreate, res.payload);
                // console.log(settings);

                if (res.payload) {
                    // console.log('exists');
                    return new Connection(dbName);
                } else if (autoCreate) {
                    // console.log('autocreate');
                    // create() erzeugt eine neue Connection
                    return chfiledb.create({ dbName, debug })
                } else {
                    if (debug)
                        console.trace('Database does not exist and is not allowed to be created automatically', res)
                    return {
                        status: 'err',
                        msg: 'Database does not exist and is not allowed to be created automatically'
                    }
                }
            }
        )
    },
    empty({ dbName, debug = false } = {}) {

    },
    create({ dbName = false, debug = false } = {}) {
        if (!dbName) {
            return new Promise(resolve => {
                resolve({
                    status: 'err',
                    msg: 'No name for a database given.'
                })
            })
        }
        return new Promise(resolve => {
            // Schauen, ob der Datenbank-Pfad existiert
            resolve(fileOp.createDB({ dbName }))
        }).then(
            () => new Connection(dbName)
        );
    },

    delete({ dbName = false, debug = false }) {
        if (!dbName) {
            return new Promise(resolve => {
                resolve({
                    status: 'err',
                    msg: 'No name for a database given.'
                })
            })
        } else {
            return fileOp.deleteDB({ dbName, debug });
        }

    }

}

export default chfiledb;
export const db = chfiledb.db;

