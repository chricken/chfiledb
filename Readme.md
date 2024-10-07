# Do not use this yet

- Promise based calls
- No extra software needed

# Overview
This module allows the use of a tiny and simple Database, which is stored in JSON files. 

# Syntax
All parameters are transferred as named arguments to avoid errors in the parameter transfer

All methods have a verbose parameter that controls whether additional output should be generated


## Module Methods

### init()

## Database Methods

### create()

### delete()

### connect()

## Document Methods

### getNextID()

### createDoc()

### deleteDoc()
    
### updateDoc()
    
### findDoc()

### deleteAttribute()

# Specialities
This module requires a few things and only spans a few safety nets for developers.

For example, no error is issued when creating a new database if this database already exists. Instead, new data is then entered into the existing database.

Deletion processes take place without a safety line such as revision or similar.

Updates are simply carried out without first checking whether the data has been changed from elsewhere.