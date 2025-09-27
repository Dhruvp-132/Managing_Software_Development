document.addEventListener('DOMContentLoaded', function() {
    loadTransactions(); // Load initial transactions

    const form = document.getElementById('transactionForm');
    form.addEventListener('submit', addTransaction);

    // Set default date to today
    document.getElementById('date').valueAsDate = new Date();
});

function addTransaction(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('date', document.getElementById('date').value);
    formData.append('type', document.getElementById('type').value);
    formData.append('category', document.getElementById('category').value);
    formData.append('amount', document.getElementById('amount').value);
    formData.append('description', document.getElementById('description').value);

    fetch('add_transaction.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            form.reset();
            document.getElementById('date').valueAsDate = new Date(); // Reset date to today
            loadTransactions();
        } else {
            alert('Error adding transaction: ' + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}