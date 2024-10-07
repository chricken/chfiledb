'use strict';

import fileOp from '../fileop.js';

class Connection {
    constructor(dbName) {
        console.log('connectio',dbName);
        
        Object.assign(this, { dbName });
        // Wenn die Datenbank existiert, prima
        // Wenn die Datenbank nicht existiert, lege sie an
    }
    get getNextID() {

    }
    createDoc({ payload = {} }) {
        return new Promise((resolve, reject) => {
            if (payload.id) {

            } else {
                let id = this.getNextID;
                payload
            }
        })
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