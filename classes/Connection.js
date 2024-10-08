'use strict';

import fileOp from '../fileop.js';
import settings from '../settings.js';

class Connection {
    constructor(dbName) {
        Object.assign(this, { dbName });
        this.path = settings.dbPath + dbName + '/';
    }
    listOfIDs() {

        return fileOp.loadDirList({ url: this.path }).then(
            res => {
                if (res.status == 'ok')
                    return res.payload.map(filename => filename.split('.')[0])
                else
                    return []
            }
        ).then(
            res => {
                // Platzhalter für möglichen Debug-Code
                return res;
            }
        ).catch(
            console.warn
        )
    }
    getNextID() {
        return this.listOfIDs().then(
            ids => {
                let myID = (Math.random() * 1e17).toString(36);
                while (ids.includes(myID))
                    myID = (Math.random() * 1e17).toString(36);
                return myID;
            }
        );
    }

    echo() {
        return this;
    }

    createDoc({ payload = {}, debug = false, overwrite = false }) {
        return new Promise(resolve => {
            if (debug) console.log('create', payload);
            if (payload.id) {
                resolve(fileOp.saveJSON({
                    url: this.path + payload.id + '.json',
                    payload,
                    overwrite,
                    debug
                }))
            } else {
                resolve(this.getNextID().then(
                    id => {
                        payload.id = id;
                        return (fileOp.saveJSON({
                            url: this.path + payload.id + '.json',
                            payload,
                            overwrite,
                            debug
                        }))
                    }
                ))
            }
        })
    }

    loadDoc({ id = '' }) {
        return fileOp.loadJSON({ url: this.path + id + '.json' }).then(
            res => {
                // Platzhalter für debugging, was auf res zugreifen muss
                return res
            }
        ).catch(
            console.warn
        )
    }

    loadDocs({ ids = [], debug = false }) {
        if (!Array.isArray(ids)) return new Promise((resolve => resolve({
            status: 'err',
            msg: 'Parameter ids is not an Array'
        })))

        // Diese Methode soll ein Array von IDs laden und die dazugehörigen Dokumente zurückgeben
        return Promise.all(ids.map(id => this.loadDoc({ id })));
    }

    deleteDoc({ id = '', payload = {} }) {
        let url = `${this.path}${id || payload.id}.json`;
        return fileOp.deleteJSON({ url }).then(
            res => {
                // Platzhalter für debugging, was auf res zugreifen muss
                return res
            }
        ).catch(
            console.warn
        )
    }

    updateDoc({ payload = {}, overwrite = false }) {
        if (overwrite) {

        } else {

        }
    }

    findDoc() {
    }

    deleteAttribute() {

    }
}

export default Connection