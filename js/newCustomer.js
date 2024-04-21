
(function () {
    let DB;

    const form = document.querySelector('#form');

    document.addEventListener('DOMContentLoaded', () => {
        connectToDB();
        form.addEventListener('submit', validateCustomer);

    })



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






})();