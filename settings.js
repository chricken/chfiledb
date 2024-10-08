'use strict';

let path = new URL(import.meta.url).pathname;
path = `${path.substring(0, path.lastIndexOf('/') + 1)}`.substring(1);
// console.log(path);

const settings = {
    dbPath: path + 'dbs/',
}

export default settings;