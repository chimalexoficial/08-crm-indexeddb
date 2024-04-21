
(function () {
    let DB;

    const form = document.querySelector('#form');

    document.addEventListener('DOMContentLoaded', () => {
        connectToDB();
        form.addEventListener('submit', validateCustomer);

    })

    function connectToDB() {
        const openOrCreateDB = window.indexedDB.open('crm', 1);

        openOrCreateDB.addEventListener('error', () => console.error('Error opening DB'));

        openOrCreateDB.addEventListener('success', () => {
            console.log('Successfully opened DB');
            DB = openOrCreateDB.result;
        });
    }

    function validateCustomer(e) {
        e.preventDefault();
        const name = document.querySelector('#name').value;
        const email = document.querySelector('#email').value;
        const phone = document.querySelector('#phone').value;
        const company = document.querySelector('#company').value;

        if (name === '' || email === '' || phone === '' || company === '') {
            showAlert('All fields are required', 'error');
        }

        // Creating an object
        const customer = {
            name, email, phone, company, id: Date.now()
        }
        console.log(customer);
        
        createNewCustomer(customer);
    }

    function createNewCustomer(customer) {
        let transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');
        objectStore.add(customer);

        transaction.onerror = function(e) {
            showAlert('Email already in use', 'error')
            console.log(e.target.error);
        }

        transaction.onsuccess = function () {
            showAlert('Customer added successfully, redirecting...', 'success');
        }

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000)
    }

    function showAlert(message, type) {

        const alertActive = document.querySelector('.alertActive');

        if (!alertActive) {
            const divMessage = document.createElement('div');
            divMessage.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'alertActive');

            if (type === 'error') {
                divMessage.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
            } else { //success
                divMessage.classList.add('bg-green-100', 'border-green-200', 'text-green-700');
            }
            divMessage.textContent = message;
            form.appendChild(divMessage);

            setTimeout(() => {
                divMessage.remove();
            }, 2500);
        }
    }




})();