(function () {
    document.addEventListener('DOMContentLoaded', function () {
        let db;
        const openOrCreateDB = window.indexedDB.open('crm', 1);

        openOrCreateDB.addEventListener('error', () => console.error('Error opening DB'));

        openOrCreateDB.addEventListener('success', () => {
            console.log('Successfully opened DB');
            db = openOrCreateDB.result;
        });

        openOrCreateDB.addEventListener('upgradeneeded', init => {
            db = init.target.result;

            db.onerror = () => {
                console.error('Error loading database.');
            };

            const objectStore = db.createObjectStore('crm', { keyPath: 'id', autoIncrement: true });

            objectStore.createIndex('name', 'name', { unique: false });
            objectStore.createIndex('email', 'email', { unique: true });
            objectStore.createIndex('phone', 'phone', { unique: false });
            objectStore.createIndex('company', 'company', { unique: false });
            objectStore.createIndex('id', 'id', { unique: false });
        });
    })
})();