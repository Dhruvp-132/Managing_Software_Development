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
function loadTransactions() {
    fetch('get_transactions.php')
    .then(response => response.json())
    .then(data => {
        displayTransactions(data.transactions);
        updateSummary(data.summary);
    })
    .catch(error => console.error('Error loading transactions:', error));
}

function displayTransactions(transactions) {
    const tbody = document.getElementById('transactionsBody');
    tbody.innerHTML = '';

    transactions.forEach(transaction => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${transaction.date}</td>
            <td class="${transaction.type}">${transaction.type.toUpperCase()}</td>
            <td>${transaction.category}</td>
            <td class="${transaction.type}">$${parseFloat(transaction.amount).toFixed(2)}</td>
            <td>${transaction.description || ''}</td>
            <td><button class="delete-btn" onclick="deleteTransaction(${transaction.id})">Delete</button></td>
        `;
    });
}

function updateSummary(summary) {
    document.getElementById('totalIncome').textContent = summary.totalIncome.toFixed(2);
    document.getElementById('totalExpenses').textContent = summary.totalExpenses.toFixed(2);
    document.getElementById('netBalance').textContent = summary.netBalance.toFixed(2);
}

function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        fetch(`delete_transaction.php?id=${id}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadTransactions();
            } else {
                alert('Error deleting transaction: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }
}
