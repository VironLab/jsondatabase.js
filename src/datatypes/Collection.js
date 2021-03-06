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

const fs = require('fs');
const md5 = require('md5');
const { v4: uuidv4 } = require('uuid');
const { EventEmitter } = require('events');
const { DatabaseActionError } = require('../errors');
const DocumentCollection = require('./DocumentCollection');
const Document = require('./Document');
const JsonDatabase = require('../JsonDatabase');

class Collection {
    constructor(collectionPath, database) {
        this.state = { loading: true, ready: false };
        this.collectionPath = collectionPath;
        this.database = database;

        this.md5Previous = null;
        this.fsWait = false;

        this.lastSave = new Date().getTime();
        this.unsaved = 0;

        //? exists collection file
        var existsCollection = fs.existsSync(collectionPath);
        if (!existsCollection) {
            fs.writeFileSync(collectionPath, JSON.stringify({ _id: uuidv4(), collection_data: [] }, null, 4));
        }

        this.refresh();

        //! Event setup
        this.events = new EventEmitter();
        this.events.on('ready', () => {
            this.state.ready = true;
            this.state.loading = false;
        });
        this.events.on('change', () => {
            this.refresh();
        });
        this.events.on('end', () => {
            try {
                clearTimeout(this.fsWait);
            } catch (error) {}
        });

        //! Setup file watchers
        this.fileWatcher = fs.watch(collectionPath, (event, filename) => {
            if (!filename) return;
            if (this.fsWait != null) return;
            //! add a small watcher delay of 10ms
            this.fsWait = setTimeout(() => {
                this.fsWait = false;
            }, 10);
            //? check file checksum to see if there are made changes
            var md5Current = md5(fs.readFileSync(collectionPath));
            if (md5Current == this.md5Previous) return;
            this.md5Previous = md5Current;
            this.events.emit('change');
        });

        this.saveInterval = setInterval(() => {
            if (this.unsaved > 0) this.save();
        }, 1000);

        this.events.emit('ready');
    }

    /**
     * Reload Documents from file
     */
    refresh() {
        var collectionFileData = JSON.parse(fs.readFileSync(this.collectionPath));
        var collectionData = collectionFileData.collection_data;
        this._id = collectionFileData._id;
        //! push new Documents
        this.documents = new DocumentCollection(this, []);
        collectionData.forEach((documentData) => {
            this.documents.push(new Document(documentData));
        });
        return this;
    }

    /**
     * Save Documents to Collection file
     */
    save(ignore_last = false) {
        if (new Date().getTime() - this.lastSave > 1000 || ignore_last) {
            var data = [];
            this.documents.forEach((document) => {
                data.push(JSON.parse(document.toJson()));
            });
            fs.writeFileSync(this.collectionPath, JSON.stringify({ _id: this._id, collection_data: data }, null, 2));
            this.lastSave = new Date().getTime();
            this.unsaved = 0;
        } else {
            this.unsaved++;
        }
    }

    /**
     * Query documents by a query object pass an empty object for all documents
     * @param { Object } query
     * @returns { DocumentCollection } result
     */
    query(query = {}) {
        if (query == {}) return this.documents;
        let result = new DocumentCollection(this, []);
        this.documents.forEach((document) => {
            var keyValueMatches = [];
            var data = document.get();
            for (var [key, value] of Object.entries(query)) {
                if (data[key] != null && value === data[key]) keyValueMatches.push(true);
                else keyValueMatches.push(false);
            }
            if (!keyValueMatches.includes(false)) result.push(document);
        });
        return result;
    }

    /**
     * Query the first of the documents by a query object pass an empty object for all documents
     * @param { Object } query
     * @returns { Document } result
     */
    findOne(query = {}) {
        return this.query(query)[0];
    }

    /**
     * Query documents by key and given expected value
     * @param { String } key
     * @param { String } expectedValue
     * @returns { DocumentCollection } result
     */
    search(key, expectedValue) {
        var query = {};
        query[key] = expectedValue;
        return this.query(query);
    }

    /**
     * Query the first of documents by key and given expected value
     * @param { String } key
     * @param { String } expectedValue
     * @returns { DocumentCollection } result
     */
    searchOne(key, expectedValue) {
        var query = {};
        query[key] = expectedValue;
        return this.findOne(query);
    }

    /**
     * search all documents wich contain the given keys
     * @param { Array<String> || String } keys
     * @returns { DocumentCollection } result
     */
    byContainingKeys(...keys) {
        let result = new DocumentCollection(this, []);
        this.documents.forEach((document) => {
            var keyMatches = [];
            var data = document.get();
            keys.forEach((key) => {
                if (data[key] != null) keyMatches.push(true);
                else keyMatches.push(false);
            });
            if (!keyMatches.includes(false)) result.push(document);
        });
        return result;
    }

    /**
     * search first document wich contain the given keys
     * @param { Array<String> || String } keys
     * @returns { Document } result
     */
    byContainingKeysOne(...keys) {
        return this.byContainingKeys(keys)[0];
    }

    /**
     * Insert a Document to a collection
     * @param { Document | Object } document
     * @returns { Document } document wich was inserted
     */
    insertDocument(document) {
        if (!(document instanceof Document)) {
            document = new Document(document);
        }
        if (Object.keys(document.data).length > 1) {
            this.documents.push(document);
            this.save();
            return document;
        }
        return null;
    }

    /**
     * Insert a Document to a collection
     * @param { Array<Document | Object> } documents
     * @returns { DocumentCollection } documentCollection of inserted Documents
     */
    insertManyDocuments(...documents) {
        var inserted = [];
        documents.forEach((document) => {
            inserted.push(this.insertDocument(document));
        });
        return new DocumentCollection(this, inserted);
    }

    /**
     * Delete the first found document by a giben query object
     * @param { Object } query
     * @returns { Boolean } success
     */
    deleteOneDocument(query = {}) {
        let result = this.query(query);
        if (!result[0]) return false;
        var newDocumentArray = this.documents.array().filter((value, index, array) => {
            return JSON.stringify(value) != JSON.stringify(result[0]);
        });
        this.documents = new DocumentCollection(this, []);
        newDocumentArray.forEach((document) => this.documents.push(document));
        this.save();
        return true;
    }

    /**
     * Delete all found documents by a giben query object
     * @param { Object } query
     * @returns { Boolean } success
     */
    deleteManyDocuments(query = {}) {
        if (query == {}) {
            this.documents = new DocumentCollection(this, []);
            this.save();
            return true;
        }
        let result = this.query(query);
        if (!result[0]) return false;
        result.forEach((document) => {
            this.deleteOneDocument({ _id: document['_id'] });
        });
        return true;
    }

    /**
     * Update the first found document by a giben query object
     * @param { Object } query
     * @returns { Boolean } success
     */
    updateOneDocument(query = {}, update = {}) {
        let result = this.query(query);
        if (!result[0]) return false;
        var toUpdateDocumentData = result[0].get();
        Object.keys(update).forEach((key) => {
            if (key != '_id') toUpdateDocumentData[key] = update[key];
        });
        this.deleteOneDocument({ _id: toUpdateDocumentData['_id'] });
        this.documents.push(Document.from(toUpdateDocumentData));
        this.save();
        return true;
    }

    /**
     * Update all found documents by a giben query object
     * @param { Object } query
     * @returns { Boolean } success
     */
    updateManyDocuments(query = {}, update = {}) {
        let result = this.query(query);
        if (!result[0]) return false;
        result.forEach((document) => {
            this.updateOneDocument({ _id: document['_id'] }, update);
        });
        return true;
    }

    /**
     * Get the database instance
     * @returns { JsonDatabase } databaseInstance
     */
    getDatabase() {
        return this.database;
    }

    /**
     * Get ALL Documents inserted into the collection
     * @returns { DocumentCollection } documents
     */
    getDocuments() {
        return this.documents;
    }

    /**
     * Get the length of all inserted Documents
     * @returns { Number } documents.length
     */
    length() {
        return this.documents.length;
    }

    /**
     * Closes all Filewatchers in the collection and daves all unsaved changes
     */
    close() {
        if (this.unsaved > 0) this.save(true);
        this.fileWatcher.close();
        clearInterval(this.saveInterval);
        this.events.emit('end');
    }
}

module.exports = Collection;
