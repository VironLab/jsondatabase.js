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
const path = require('path');
const { EventEmitter } = require('events');
const errors = require('./errors');
const Collection = require('./datatypes/Collection');

/**
 * JSON Database Handler ( Creates Folder if not existing )
 * @param { String } rootPath rootPath defines the root directory for the JSON files (default: "./database")
 * @param { Object } options { cachingEnabled: true }
 */
class JsonDatabase {
    constructor(rootPath = './jsondatabase', options = {}) {
        this.state = { loading: true, ready: false };
        this.collections = {};
        this.collectionsOpen = [];

        //! Event setup
        this.events = new EventEmitter();
        this.events.on('ready', () => {
            this.state.ready = true;
            this.state.loading = false;
        });
        this.events.on('end', () => {
            try {
                this.collectionsOpen.forEach((collection) => {
                    collection.close();
                });
            } catch (error) {}
        });

        //? set the db root path and check if it exists
        this.rootPath = path.isAbsolute(rootPath) ? rootPath : path.resolve(process.cwd(), rootPath);
        var existsRoot = fs.existsSync(this.rootPath);

        //! create db directory if not ecisting
        if (!existsRoot) {
            fs.mkdir(this.rootPath, { recursive: true }, (err) => {
                if (err) throw new errors.FsError(err);
            });
        }
        this.events.emit('ready');
    }

    /**
     * Get a Collection in the Database | If it does not exist it will be created
     * @param { String } collectionName
     */
    getCollection(collectionName = 'collection-1.json') {
        //? collection name ends with .json ? if not add it
        if (!collectionName.endsWith('.json')) collectionName += '.json';
        var collectionPath = path.resolve(this.rootPath, collectionName);
        if (this.collections[collectionPath] != null) return this.collections[collectionPath];

        var collection = new Collection(collectionPath, this);
        this.collections[collectionPath] = collection;
        this.collectionsOpen.push(collection);

        return collection;
    }

    close() {
        this.events.emit('end');
    }
}

module.exports = JsonDatabase;
