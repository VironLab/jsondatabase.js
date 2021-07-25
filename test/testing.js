/**
 * jsondatabase.js | Copyright (C) 2021 | vironlab.eu
 * Licensed under the MIT License
 *
 * ___    _______                        ______         ______
 * __ |  / /___(_)______________ _______ ___  / ______ ____  /_
 * __ | / / __  / __  ___/_  __ \__  __ \__  /  _  __ `/__  __ \
 * __ |/ /  _  /  _  /    / /_/ /_  / / /_  /___/ /_/ / _  /_/ /
 * _____/   /_/   /_/     \____/ /_/ /_/ /_____/\__,_/  /_.___/
 *
 * ____  _______     _______ _     ___  ____  __  __ _____ _   _ _____
 * |  _ \| ____\ \   / / ____| |   / _ \|  _ \|  \/  | ____| \ | |_   _|
 * | | | |  _|  \ \ / /|  _| | |  | | | | |_) | |\/| |  _| |  \| | | |
 * | |_| | |___  \ V / | |___| |__| |_| |  __/| |  | | |___| |\  | | |
 * |____/|_____|  \_/  |_____|_____\___/|_|   |_|  |_|_____|_| \_| |_|
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * You should have received a copy of the MIT License
 *
 * Repository:
 *     Github:          https://github.com/VironLab/vextension-web
 *     NPM:             https://www.npmjs.com/package/vextension-web
 * Contact:
 *     Discordserver:   https://discord.gg/wvcX92VyEH
 *     Website:         https://vironlab.eu/
 *     Mail:            contact@vironlab.eu
 *
 */

'use strict'; // https://www.w3schools.com/js/js_strict.asp

// import module classes
const { JsonDatabase, Document } = require('../src');

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
