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

const { v4: uuidv4 } = require('uuid');

class DocumentCollection extends Array {
    constructor(collection, documents) {
        super(...documents);
        this._id = uuidv4();
        if (!collection) throw new Error('Collection cannot be null');
        this.collection = collection;
        this.len = this.length;
    }

    /**
     * Query documents by a query object pass an empty object for all documents
     * @param { Object } query
     * @returns { DocumentCollection } result
     */
    query(query) {
        return this.collection.query(query);
    }

    /**
     * Query the first of the documents by a query object pass an empty object for all documents
     * @param { Object } query
     * @returns { DocumentCollection } result
     */
    findOne(query) {
        return this.collection.findOne(query);
    }

    /**
     * Query documents by key and given expected value
     * @param { String } key
     * @param { String } expectedValue
     * @returns { DocumentCollection } result
     */
    search(key, expectedValue) {
        return this.collection.search(key, expectedValue);
    }

    /**
     * Query the first of documents by key and given expected value
     * @param { String } key
     * @param { String } expectedValue
     * @returns { DocumentCollection } result
     */
    searchOne(key, expectedValue) {
        return this.collection.searchOne(key, expectedValue);
    }

    /**
     * search all documents wich contain the given keys
     * @param { Array<String> || String } keys
     * @returns { DocumentCollection } result
     */
    byContainingKeys(...keys) {
        return this.collection.byContainingKeys(keys);
    }

    /**
     * search first document wich contain the given keys
     * @param { Array<String> || String } keys
     * @returns { DocumentCollection } result
     */
    byContainingKeysOne(...keys) {
        return this.collection.byContainingKeysOne(keys);
    }

    /**
     * Insert a Document to a collection
     * @param { Document | Object } document
     * @returns { Document } document wich was inserted
     */
    insertDocument(document) {
        return this.collection.insertDocument(document);
    }

    /**
     * Insert a Document to a collection
     * @param { Array<Document | Object> } documents
     * @returns { DocumentCollection } documentCollection of inserted Documents
     */
    insertManyDocuments(...documents) {
        return this.collection.insertManyDocuments(documents);
    }

    /**
     * Delete the first found document by a giben query object
     * @param { Object } query
     * @returns { Boolean } success
     */
    deleteOneDocument(query) {
        return this.collection.deleteOneDocument(query);
    }

    /**
     * Delete all found documents by a giben query object
     * @param { Object } query
     * @returns { Boolean } success
     */
    deleteManyDocuments(query) {
        return this.collection.deleteManyDocuments(query);
    }

    /**
     * Update the first found document by a giben query object
     * @param { Object } query
     * @returns { Boolean } success
     */
    updateOneDocument(query, update) {
        return this.collection.updateOneDocument(query, update);
    }

    /**
     * Update all found documents by a giben query object
     * @param { Object } query
     * @returns { Boolean } success
     */
    updateManyDocuments(query, update) {
        return this.collection.updateManyDocuments(query, update);
    }

    /**
     * Get the database instance
     * @returns { JsonDatabase } databaseInstance
     */
    getDatabase() {
        return this.collection.getDatabase();
    }

    /**
     * Get the collection instance
     * @returns { Collection } collectionInstance
     */
    getCollection() {
        return this.collection;
    }

    /**
     * Get the length of all inserted Documents
     * @returns { Number } documents.length
     */
    length() {
        return this.length;
    }

    /**
     * Get a document by given index
     * @returns { Document } document
     */
    get(index) {
        return this[index] || null;
    }

    /**
     * Get ALL Documents inserted into the DocumentCollection as Array
     * @returns { Array<Document> } documents
     */
    array() {
        return new Array(...this);
    }
}

module.exports = DocumentCollection;
