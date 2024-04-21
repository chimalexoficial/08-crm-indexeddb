(function () {
    let DB;
    let idCustomer;
    const nameInput = document.querySelector('#name');
    const emailInput = document.querySelector('#email');
    const phoneInput = document.querySelector('#phone');
    const companyInput = document.querySelector('#company');

    const form = document.querySelector('#form');

    document.addEventListener('DOMContentLoaded', () => {
        // Verify URL ID
        connectToDB();

        form.addEventListener('submit', updateCustomer);

        const paramsURL = new URLSearchParams(window.location.search);

        idCustomer = paramsURL.get('id');
        console.log(idCustomer);

        if (idCustomer) {
            setTimeout(() => {
                getCustomer(idCustomer);
            }, 100)
        }
    });

    function updateCustomer(e) {
        e.preventDefault();

        if(nameInput.value === '' || emailInput.value === '' || companyInput.value === '' || phoneInput.value === '') {
            showAlert('All fields are required', 'error')
            return;
        }

        // Update customer
        const updatedCustomer = {
            name: nameInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
            company: companyInput.value,
            id: Number(idCustomer)
        }
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');
        objectStore.put(updatedCustomer);

        transaction.oncomplete = function() {
            showAlert('Update successfully, redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2500)
        }

        transaction.onerror = function() {
           showAlert('Hubo un error', 'error');
        }
    }

    function getCustomer(id) {
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');
        console.log(objectStore);
        const customer = objectStore.openCursor();
        customer.onsuccess = function (e) {
            const cursor = e.target.result;
            if (cursor) {
                console.log(cursor.value);
                if (cursor.value.id === Number(id)) {
                    fillForm(cursor.value);
                }
                cursor.continue();
            }
        }
    }

    function fillForm(dataCustomer) {
        const {name, email, phone, company} = dataCustomer;
        nameInput.value = name;
        emailInput.value = email;
        phoneInput.value = phone;
        companyInput.value = company;
    }

    function connectToDB() {
        const openOrCreateDB = window.indexedDB.open('crm', 1);

        openOrCreateDB.addEventListener('error', () => console.error('Error opening DB from edit'));

        openOrCreateDB.addEventListener('success', () => {
            console.log('Successfully opened DB from edit');
            DB = openOrCreateDB.result;
        });
    }
})();