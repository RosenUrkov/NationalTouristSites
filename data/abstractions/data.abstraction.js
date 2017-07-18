const ObjectId = require('mongodb').ObjectID;

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 12;

class Data {
    constructor(database, collectionName) {
        if (typeof database === 'undefined') {
            throw new Error('Database is undefined!');
        }

        if (typeof collectionName !== 'string') {
            throw new Error('Incorrect collection name!');
        }

        this.database = database;
        this.collectionName = collectionName;
        this.collection = this.database.collection(this.collectionName);
    }

    getAll() {
        return this.filter({});
    }

    filter(filterObject) {
        return this.collection.find(filterObject).toArray();
    }

    findById(id) {
        if (typeof id !== 'string') {
            return Promise.reject('Invalid id!');
        }

        // eslint-disable-next-line
        return this.collection.findOne({ _id: ObjectId(id) });
    }

    add(model) {
        if (typeof model === 'undefined') {
            return Promise.reject('Model is undefined!');
        }

        if (!this.isModelValid(model)) {
            return Promise.reject('Invalid model for ' + this.collectionName);
        }

        return this.collection.insert(model);
    }

    getRange(start, size) {
        start = Number(start);
        size = Number(size);

        if (Number.isNaN(start) || start < 1) {
            start = DEFAULT_PAGE;
        }

        if (Number.isNaN(size) || size < 1) {
            size = DEFAULT_PAGE_SIZE;
        }

        return this.collection.find()
            .skip((start - 1) * size)
            .limit(size)
            .toArray();
    }

    isModelValid() {
        return true;
    }
}

module.exports = Data;
