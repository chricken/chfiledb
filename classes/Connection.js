'use strict';

import fileOp from '../fileop.js';

class Connection {
    constructor(dbName) {
        Object.assign(this, { dbName });
        this.path = fileOp.pathFiles + dbName + '/';
        console.log('connected', this.path);

    }
    listOfIDs() {
        // console.log('IDs', this.path);

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
                // console.log(res);
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
        return new Promise((resolve, reject) => {
            if (payload.id) {

            } else {
                this.getNextID().then(
                    id => {
                        payload.id = id;
                        console.log('create', payload);
                        return fileOp.saveJSON({
                            url: this.path + id + '.json',
                            payload,
                            overwrite,
                            debug
                        })
                    }
                );
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
        // Diese Methode soll ein Array von IDs laden und die dazugehörigen Dokumente zurückgeben
    }

    deleteDoc({ id = {} }) {
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