'use strict';

import fileOp from '../fileop.js';
import settings from '../settings.js';
import cache from '../cache.js';

class Connection {
    constructor(dbName) {
        Object.assign(this, { dbName });
        this.path = settings.dbPath + dbName + '/';
    }
    listIDs() {

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
                return {
                    status: 'ok',
                    payload: res
                }
            }
        )
    }

    getNextID() {
        return this.listIDs().then(
            res => {
                let ids = res.payload;
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
        // hidden setzen.
        // Überprüfung muss stattfinden, damit beim Setzen auf true das Attribut true bleibt
        // payload.hidden ??= false;
        return new Promise(resolve => {
            if (debug) console.log('create', payload);
            if (payload.id) {
                // Cache beschreiben
                cache[this.dbName][payload.id] = payload;

                // console.log(cache);

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
                        // Cache beschreiben
                        // console.log('cache', JSON.stringify(cache));
                        // console.log('writeCache', this.dbName);

                        cache[this.dbName][payload.id] = payload;

                        // console.log(cache);

                        return (fileOp.saveJSON({
                            url: this.path + payload.id + '.json',
                            payload,
                            overwrite,
                            debug
                        }))
                    }
                ))
            }
        }).then(
            res => {
                // console.log(res, this);

                return {
                    status: res.status,
                    connection: this,
                    doc: res.payload
                }
            }
        )
    }

    loadDoc({ id = false, debug = false, ignoreCache = false }) {
        if (!id) {
            if (debug) console.log('No ID given');
            return new Promise(resolve => {
                resolve({
                    status: 'err',
                    msg: 'No ID given',
                    connection: this
                })
            })
        }

        console.log('searchCache', cache[this.dbName]);

        if (cache[this.dbName][id] && !ignoreCache) {
            return new Promise(resolve => {
                resolve({
                    status: 'ok',
                    cached: true,
                    doc: cache[this.dbName][id],
                    connection: this,
                })
            })
        } else {
            return fileOp.loadJSON({ url: this.path + id + '.json' }).then(
                res => {
                    if (res.status == 'err' && debug)
                        console.trace('Error loading a document', res.msg);
                    else if (res.payload.hidden) {
                        return {
                            status: 'err',
                            msg: 'Document is hidden',
                            connection: this
                        }
                    }
                    else {
                        // console.log('writeCache', this.dbName, cache, id, res.payload);

                        cache[this.dbName][id] = res.payload;
                        // console.log('writtenCache', cache);
                        res.cached = false;
                        console.log('res 139', res);
                        return {
                            status: 'ok',
                            connection: this,
                            doc: res.payload,
                            cached: false,
                        }
                    }
                }
            )
        }
    }

    loadDocs({ ids = [], debug = false, ignoreCache = false }) {
        if (!Array.isArray(ids)) return new Promise((resolve => {
            if (debug) console.trace('Parameter ids is not an Array', id)
            resolve({
                status: 'err',
                msg: 'Parameter ids is not an Array'
            })
        }))

        // Diese Methode soll ein Array von IDs laden und die dazugehörigen Dokumente zurückgeben
        return Promise.all(ids.map(id => this.loadDoc({ id, debug, ignoreCache }))).then(
            res => {

                return {
                    status: 'ok',
                    connection: this,
                    docs: res.map(el => el.doc)
                }

            }
        );
    }

    updateDoc({ payload = {}, debug = false }) {
        if (!payload.id) {
            if (debug) console.trace('No ID in payload given', payload);
            return new Promise(resolve => {
                resolve({
                    status: 'err',
                    msg: 'No ID in payload given'
                })
            })
        }

        return this.loadDoc({ id: payload.id }).then(

            // Document erweitern
            res => {
                console.log(res);
                if (res.status == 'err') return res
                let doc = res.doc;
                Object.assign(doc, payload);
                return res;
            }
        ).then(
            // Document speichern
            res => {
                console.log('res 189', res);

                if (res.status == 'err') return res

                return this.createDoc({
                    payload: res.doc,
                    overwrite: true,
                    debug
                })
            }
        )
        /*.then(
            res => {
                console.log('return 203', res);
                
                return {
                    status: res.status,
                    doc: res.payload,
                    connection: this
                }
            }
        )*/
    }

    findDoc() {
    }

    deleteDoc({ id = '', payload = false, debug = false }) {
        let url = `${this.path}${id || payload.id}.json`;
        if (!id && !payload) {
            if (debug) console.trace('Neither id ')
        }

        delete cache[this.dbName](id);
        console.log(cache);


        return fileOp.deleteJSON({ url }).then(
            res => {
                // Platzhalter für debugging, was auf res zugreifen muss
                return res
            }
        ).catch(
            console.warn
        )
    }

    hideDoc({ id = false, debug = false }) {
        if (!id) {
            if (debug) console.trace('No ID given');
            return new Promise(resolve => {
                resolve({
                    status: 'err',
                    msg: 'No ID given'
                })
            })
        }

        return this.loadDoc({ id }).then(
            // Document verstecken
            res => {
                if (res.status == 'err') return res
                res.doc.hidden = true;
                return res.doc;
            }
        ).then(
            // Document speichern
            res => {
                if (res.status == 'err') return res

                return this.createDoc({
                    payload: res,
                    overwrite: true,
                    debug
                })
            }
        )
    }

    unhideDoc({ id = false, debug = false }) {
        if (!id) {
            if (debug) console.trace('No ID given');
            return new Promise(resolve => {
                resolve({
                    status: 'err',
                    msg: 'No ID given'
                })
            })
        }

        // Laden muss direkt stattfinden, da die loadDoc()-Methode versteckte Dokumente nicht verarbeitet
        return fileOp.loadJSON({ url: this.path + id + '.json' }).then(
            res => {
                if (res.status == 'err' && debug)
                    console.trace('Error loading a document', res.msg);
                else {
                    delete res.payload.hidden;
                }
                return res;
            }
        ).then(
            // Document speichern
            res => {
                if (res.status == 'err') return res

                return this.createDoc({
                    payload: res.payload,
                    overwrite: true,
                    debug
                })
            }
        )
    }

    removeAttribute({ id = false, attributes = [], debug = false }) {
        // Alias für removeAttributes
        this.removeAttributes({ id: false, attributes: [], debug: false })
    }

    removeAttributes({ id = false, attributes = [], debug = false }) {
        if (!id) {
            if (debug) console.trace('No ID  given', payload);
            return new Promise(resolve => {
                resolve({
                    status: 'err',
                    msg: 'No ID given'
                })
            })
        }

        return this.loadDoc({ id }).then(
            // Document erweitern
            res => {
                if (res.status == 'err') return res
                else {
                    // Attribute entfernen
                    console.log(337, res);
                    attributes.forEach(attr => {
                        delete res.doc[attr]
                    })
                    return res
                }
            }
        ).then(
            // Document speichern
            res => {
                if (res.status == 'err') return res

                return this.createDoc({
                    payload: res.doc,
                    overwrite: true,
                    debug
                })
            }
        )
    }
}

export default Connection