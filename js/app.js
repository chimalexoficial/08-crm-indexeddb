(function () {
    let db;
    let confirm;
    const listCustomers = document.querySelector('#list-customers');

    document.addEventListener('DOMContentLoaded', () => {
        createDB();

        if (window.indexedDB.open('crm', 1)) {
            getCustomers();
        }

        listCustomers.addEventListener('click', deleteCustomer);
    });

    function deleteCustomer(e) {
        if (e.target.classList.contains('delete')) {
            let idDelete = Number(e.target.dataset.customer);

            confirm = window.confirm('Are you sure you want to delete this customer?');

            if (confirm) {
                const transaction = db.transaction(['crm'], 'readwrite');
                const objectStore = transaction.objectStore('crm');
                objectStore.delete(idDelete);

                transaction.oncomplete = function () {
                    console.log('Success deleting...');
                    e.target.parentElement.parentElement.remove();
                }

                transaction.onerror = function () {
                    console.log('Error deleting');
                }
            }
        }
    }

    function createDB() {
        let createDB = indexedDB.open('crm', 1);

        createDB.onupgradeneeded = function (e) {
            let db = e.target.result;
            let objectStore = db.createObjectStore('crm', { keyPath: 'id', autoIncrement: true });
            objectStore.createIndex('id', 'id', { unique: true });
            objectStore.createIndex('name', 'name', { unique: false });
            objectStore.createIndex('email', 'email', { unique: true });
            objectStore.createIndex('phone', 'phone', { unique: false });
            objectStore.createIndex('company', 'company', { unique: false });
        };

        createDB.onsuccess = function (e) {
            db = e.target.result;
            console.log('Connection to DB success :)');
            // Database opened successfully
        };

        createDB.onerror = function (e) {
            // Error occurred while opening the database
            console.log('Some error ocurred :(');
        };
    }

    function getCustomers() {
        const openDB = window.indexedDB.open('crm', 1);
        openDB.onerror = function () {
            console.log('There was an error');
        }

        openDB.onsuccess = function (e) {
            db = e.target.result;
            const objectStore = db.transaction('crm').objectStore('crm');

            objectStore.openCursor().onsuccess = function (e) {
                const cursor = e.target.result;
                if (cursor) {
                    const { name, email, phone, company, id } = cursor.value;


                    listCustomers.innerHTML += ` <tr>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                        <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${name} </p>
                        <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                        <p class="text-gray-700">${phone}</p>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                        <p class="text-gray-600">${company}</p>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                        <a href="edit-customer.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Edit</a>
                        <a href="#" data-customer="${id}" class="text-red-600 hover:text-red-900 delete">Delete</a>
                    </td>
                </tr>
            `;

                    cursor.continue();
                } else {
                    console.log('No more data');
                }
            }
        }
    }

})();