# Overview
This module manages a tiny and simple database, which is storing datasets as JSON files. 

# Naming and structure
The data is organized as one JSON file per data set in folders. The folders are referred to below as a database. The JSON files are referred to as documents.

All methods return promises.

All parameters are transferred in an object, that is being destructured in the method (a.k.a. Named Arguments).

# Usage
Install the module to your project.
```
npm i chfiledb
```
The module can be imported to your nodeJS project as ES6 module.
```
import chFileDB from 'chfiledb';
```

## Caching
To be done

## Module Methods

### init()
By default the database is being stored in a subfolder of the module. 

init() allows the definition of a custom folder. It expects an absolute path to an existig folder.

```
import chfiledb from 'chfiledb';
chfiledb.init({ DBPath: 'C:/Users/alfa/Desktop/data' }).then(
    console.log
).catch(
    console.warn
)
```

## Database Methods
The so-called database methods allow the manipulation of entire databases. This allows databases to be created, deleted and connected.

### create()
Creates a new database. 

**dbName**: Defines the name of the new database. The name is case sensitive. This parameter is *required*, so no default provided.

**debug**: Gives additional outputs in case of an error. Defaults to *false*.

The create() method returns a *connection object*, so that the database can be filled with data immediately.

```
chfiledb.create({ name: 'mydb'}).then(
    console.log
).catch(
    console.warn
)
```

### delete()
Deletes a database.

**dbName**: Defines the name of the database to be deleted. The name is case sensitive. This parameter is *required*, so no default provided.

```
chFileDB.delete({ dbName: 'myDB' }).then(
    console.log
).catch(
    console.warn
)
```

### connect()
The connect() method creates a connection to the database. Actually, it checks, if the database is there and returns an object to interact with the database. See below.

**name**: Defines the name of the database to be connected to. This parameter is *required*, so no default provided.

**autoCreate**: Controls whether the database should be created automatically if it does not exist. Defaults to *true*.

**debug**: Gives additional outputs in case of an error. Defaults to *false* 

```
chFileDB.connect({
    dbName: 'myDB',
    autoCreate: true,
    debug: true,
}).then(
    console.log
).catch(
    console.warn
)
```

## Document Methods
The document methods are contained in the return of the connect() method.

### listIDs()
This method creates an array of all existing documents in the connected database. This is handy to get a full overview of the documents or to implement pagination.

This method does not use any parameter.

```
chFileDB.connect({ dbName: 'myDB' }).then(
    conn => conn.listIDs()
).then(
    console.log
).catch(
    console.warn
)
```

### createDoc()
This method creates a new document in the connected database.
The method can get the following parameters.

The method returns a *connection object*, so that more methods can be chained.

**payload**: Contains an object to be stored in the document. If the object doesn't contain an attribut *id*, it will be created automatically.

**overwrite**: If set to true, a document with the same id will be overwritten. There will be no confirmation and no backup. Defaults to false.

**debug**: Gives additional outputs in case of an error. Defaults to *false*.


```
const rezept = {
    name: "Pasta Carbonara",
    zubereitungszeit: 30,
    portionen: 4
};
const film = {
    titel: "Inception",
    regisseur: "Christopher Nolan",
    jahr: 2010,
};

chFileDB.connect({
    dbName: 'myDB'
}).then(
    conn => conn.createDoc({
        payload: rezept
    })
).then(
    conn => conn.createDoc({
        payload: film
    })
).catch(
    console.warn
)
```

### loadDoc()
This method is loading a single document with a given ID.

**id**: ID of the document to be loaded. This parameter is *required*, so no default provided.

**debug**: Gives additional outputs in case of an error. Defaults to *false*.

```
chFileDB.connect({ dbName: 'myDB' }).then(
    conn => conn.loadDoc({ id: '2486ikkhe1q' })
).then(
    console.log
).catch(
    console.warn
)
```

### loadDocs()
This method is loading a bunch of documents based on a given array of IDs.
An ID, that doesn't lead to a document, returns undefined.

**ids**: Expects an array of IDs of the documents to be loaded.

**debug**: Gives additional outputs in case of an error. Defaults to *false*.

```
chFileDB.connect({ dbName: 'myDB' }).then(
    conn => conn.loadDocs({
        ids: [
            '14hrd1th3px',
            '2486ikkhe1q',
            'pinuc3ldigw'
        ]
    })
).then(
    console.log
).catch(
    console.warn
)
```

### updateDoc()
This method updates and adds attributes into a document.
The attributes of the document remain unaffected unless they are given a new value.

If successfull, the method returns a *connection object*, so that more methods can be chained. Otherwise, it gives an object with a status "err".

**payload** The attributes to be updated or added. The payload has to contain the ID of the document to be updated.

**debug**: Gives additional outputs in case of an error. Defaults to *false*.

```
// Document before updating
// {
//  id: "2486ikkhe1q",
//  customNum: 13
// }

chFileDB.connect({ dbName: 'myDB' }).then(
    conn => conn.updateDoc({
        payload:{
            id:'2486ikkhe1q',
            anAttr: 1000
        }
    })
).then(
    console.log
).catch(
    console.warn
)

// {
//  id: "2486ikkhe1q",
//  customNum: 13,
//  anAttr: 1000
// }
```
    
### deleteDoc()
This method deletes a single document. There is no security check or backup so be sure, that you indeed want to delete the document.

It expects the id of the document to delete. Instead, the whole object can be provided, where the method picks the id from.
Providing the id is prefered.

**id**: The id of the document to delete. This parameter is *required*, so no default provided.

**payload**: The whole object to be deleted. The method takes the id from that object.

**debug**: Gives additional outputs in case of an error. Defaults to *false*.

```
chFileDB.connect({
    dbName: 'myDB'
}).then(
    conn => conn.deleteDoc({
        id: 'q6igqag1sxs'
    })
)
```

### hideDoc()
This method shall hide a document as an alternative to delete it.
Hidden documents are intended to be treated just like deleted documents. But with the possibility to regain the data.

To be done

### findDoc()
This method will search for documents that fit a given pattern.

To be done

### deleteAttribute()
This method deletes given attributes from a document.

**id** Document ID, in which the attribute shall be removed.

**attributes** An array with te attribute key to be remove. 

**debug**: Gives additional outputs in case of an error. Defaults to *false*.

```
// Document before updating
// {
//  id: "2486ikkhe1q",
//  customNum: 13,
//  a1: 100
// }

chFileDB.connect({ dbName: 'myDB' }).then(
    conn => conn.deleteAttributes({
        id: '2486ikkhe1q',
        attributes: [
            'a1'
        ],
        debug: true
    })
).then(
    console.log
).catch(
    console.warn
)


// Document after updating
// {
//  id: "2486ikkhe1q",
//  customNum: 13
// }
```