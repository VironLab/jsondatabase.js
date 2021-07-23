# jsondatabase.js

[![License](https://img.shields.io/github/license/VironLab/jsondatabase.js)](LICENSE.txt)
[![Discord](https://img.shields.io/discord/785956343407181824.svg)](https://discord.gg/wvcX92VyEH)

---

`npm install --save jsondatabase.js`

jsondatabase.js is a nodejs module to create a simple JSON oriented database in your projects

---

# CURRENTLY UNDER DEVELOPMENT

---

## Current functionality ( testing.js )

```js
const jsondatabase = require('jsondatabase.js');
var db = new jsondatabase.JsonDatabase('./jsondbtest');

db.getCollection('users').insertDocument(jsondatabase.Document.from({ name: 'username1' }));
db.getCollection('users').insertDocument(jsondatabase.Document.from({ name: 'username2' }));

console.log(db.getCollection('users').deleteOneDocument({ name: 'username1' }));
console.log(db.getCollection('users').updateManyDocuments({}, { collection_length: db.getCollection('users').length() }));

var doc = db.getCollection('users').insertDocument(
    jsondatabase.Document.from({
        name: 'functionTest',
        func: () => {
            console.log('Funny Function XD');
        },
    }),
);

var docWithFunction = db.getCollection('users').findOne({ name: 'functionTest' });
docWithFunction.data.func();

if (db.getCollection('users').length() >= 10) console.log(db.getCollection('users').deleteManyDocuments({}));

db.close();
```

---

### Discord

<div align="center">
    <h1 style="color:#154444">Other Links:</h1>
    <a style="color:#00ff00" target="_blank" href="https://discord.gg/wvcX92VyEH"><img src="https://img.shields.io/discord/785956343407181824?label=vironlab.eu%20Discord&logo=Discord&logoColor=%23ffffff&style=flat-square"></img></a>
</div>
