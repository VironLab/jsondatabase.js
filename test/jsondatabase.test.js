const jsondatabase = require('../');
var db;

test('Initialize tests', () => {
    db = new jsondatabase.JsonDatabase('./database');
});

test('Create or Get Collection of Database', () => {
    expect(db).not.toBeNull();
    var collection = db.getCollection('users');
    expect(collection).not.toBeNull();
});

test('Add Document to DB', () => {
    var collection = db.getCollection('users');
    for (let i = 0; i < 10; i++) {
        var name = 'name-' + collection.getDocuments().length;
        var document = collection.insertDocument(jsondatabase.Document.from({ name: name }));
        expect(document.getString('name')).toBe(name);
    }
});

test('Get a Document with query method from a collection', () => {
    var collection = db.getCollection('users');
    var documents = collection.query({ name: 'name-0' });
    expect(documents[0].getString('name')).toBe('name-0');
});

test('Shutdown tests', () => {
    db.close();
});
