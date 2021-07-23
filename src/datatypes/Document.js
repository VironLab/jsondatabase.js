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

var isPlainObject = (toCheckVar) => typeof toCheckVar === 'object' && toCheckVar !== null;
var isArray = (toCheckVar) => Array.isArray(toCheckVar) && toCheckVar !== null;
var isFunction = (toCheckVar) => toCheckVar !== null && typeof toCheckVar === 'function';

class Document {
    constructor(data) {
        //! Convert any data to Object
        if (!isPlainObject(data)) {
            if (isArray(data) || typeof data === 'boolean' || typeof data === 'string' || typeof data === 'number' || data instanceof String) data = { value: data };
        }

        if (isFunction(data)) {
            data = { savedFunction: data };
        }

        //? Convert functions
        var dataParsed = JSON.parse(
            JSON.stringify(data, function (key, value) {
                if (typeof value === 'function') {
                    return '/Function(' + value.toString() + ')/';
                }
                return value;
            }),
            (key, value) => {
                if (typeof value === 'string' && value.startsWith('/Function(') && value.endsWith(')/')) {
                    value = value.substring(10, value.length - 2);
                    return (0, eval)('(' + value + ')');
                }
                return value;
            },
        );

        if (!dataParsed._id) dataParsed._id = uuidv4();
        this._id = dataParsed._id;
        this.data = dataParsed;
    }

    /**
     * Get data of document optional value by a given key
     * @param { String } key
     * @returns { Object | any } value/data
     */
    get(key) {
        return key != null ? this.data[key] || null : this.data;
    }

    getString(key, defaultValue = '') {
        return key != null ? '' + this.data[key] || defaultValue : '' + this.data['value'] || defaultValue;
    }

    getInt(key, defaultValue = -1) {
        return key != null ? 0 + parseInt(this.data[key]) || defaultValue : 0 + parseInt(this.data['value']) || defaultValue;
    }

    getFunction(key, defaultValue = () => {}) {
        return key != null ? this.data[key] || defaultValue : this.data['savedFunction'] || defaultValue;
    }

    /** Convert the data to JSON string */
    toJson() {
        return JSON.stringify(
            this.data,
            function (key, value) {
                if (typeof value === 'function') {
                    return '/Function(' + value.toString() + ')/';
                }
                return value;
            },
            null,
            2,
        );
    }

    /**
     * Create an instance of this Document
     * @param { Object | Function | String | Array | Number } data
     * @returns { Document } documentInstance
     */
    static from(data) {
        return new Document(data);
    }
}

module.exports = Document;
