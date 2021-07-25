# jsondatabase.js

[![License](https://img.shields.io/github/license/VironLab/jsondatabase.js)](LICENSE.txt)
[![Discord](https://img.shields.io/discord/785956343407181824.svg)](https://discord.gg/wvcX92VyEH)

---

`npm install --save jsondatabase.js`

jsondatabase.js is a nodejs module to create a simple JSON oriented database in your projects

---

# CURRENTLY UNDER DEVELOPMENT

---

### Current functionality

```js
// import module classes
const { JsonDatabase, Document } = require('jsondatabase.js');

// create a new Database Instance
var db = new JsonDatabase('./jsondbtest');

// get and create if not existing collection
var userCollection = db.getCollection('users');

// document creation from an Object
var document1 = Document.from({ name: 'username1', id: 1, email: 'username1@example.com' });
var document2 = Document.from({ name: 'username2', id: 2, email: 'username2@example.com' });

// insert the created documents
userCollection.insertManyDocuments(document1, document2); // returns a DocumentCollection ( extended Array )

// Delete a document by query
let firstDeletion = userCollection.deleteOneDocument({ name: 'username1' });
console.log(firstDeletion); // true when success

// insertion of a document with a function
userCollection.insertDocument(
    Document.from({
        name: 'username3',
        function: () => {
            console.log('Funny Function XD');
        },
    }),
);

// Query Documents

// query documents where the key is set to the value
var documentCollection = userCollection.query({ key: 'value' }); // returns DocumentCollection<Document>
// query documents where the name is set to username
userCollection.query({ name: 'username' }); // returns DocumentCollection<Document>
userCollection.findOne({ name: 'username3' }); // returns first Document
// query documents where the id is set to 1
userCollection.query({ id: 1 }); // returns DocumentCollection<Document>
// search by key and value
userCollection.search('name', 'username1'); // returns DocumentCollection<Document>
userCollection.searchOne('name', 'username1'); // returns first Document
// search by exxisting keys
userCollection.byContainingKeys(['name', 'id']); // returns DocumentCollection<Document> of documents where name and id field is set
userCollection.byContainingKeysOne(['name', 'id']); // returns first Document where name and id field is set

// get the document with the inserted function
var docWithFunction = userCollection.findOne({ name: 'username3' });

// run saved function inside the document
docWithFunction.getFunction('function')();

// update documents data by query
let updated = userCollection.updateManyDocuments({}, { collection_length: userCollection.length() });
console.log(updated); // true when success

// deletion of all documents when collection length is greater then 10
if (userCollection.length() >= 10) console.log(userCollection.deleteManyDocuments({}));

// secure close database filewatchers and save unsaved changes
db.close();
```

---

### Discord

<div align="center">
    <h1 style="color:#154444">Other Links:</h1>
    <a style="color:#00ff00" target="_blank" href="https://discord.gg/wvcX92VyEH"><img src="https://img.shields.io/discord/785956343407181824?label=vironlab.eu%20Discord&logo=Discord&logoColor=%23ffffff&style=flat-square"></img></a>
</div>
