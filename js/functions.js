function connectToDB() {
    const openOrCreateDB = window.indexedDB.open('crm', 1);

    openOrCreateDB.addEventListener('error', () => console.error('Error opening DB'));

    openOrCreateDB.addEventListener('success', () => {
        console.log('Successfully opened DB');
        DB = openOrCreateDB.result;
    });
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