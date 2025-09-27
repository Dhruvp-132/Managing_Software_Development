document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - Starting app'); // Optional debug
    
    loadTransactions(); // Load initial transactions

    const form = document.getElementById('transactionForm');
    if (form) {
        form.addEventListener('submit', addTransaction);
        console.log('Form event listener attached'); // Debug
    } else {
        console.error('Error: Form with id="transactionForm" not found in HTML!');
        return; // Stop if form missing
    }

    // Set default date to today
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.valueAsDate = new Date();
    } else {
        console.error('Error: Date input with id="date" not found!');
    }
});

function addTransaction(e) {
    e.preventDefault();
    console.log('Add transaction triggered'); // Debug

    const form = document.getElementById('transactionForm'); // Re-fetch for safety
    if (!form) {
        alert('Form not available!');
        return;
    }

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
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            form.reset();
            document.getElementById('date').valueAsDate = new Date(); // Reset date to today
            loadTransactions();
            console.log('Transaction added successfully'); // Debug
        } else {
            alert('Error adding transaction: ' + (data.message || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Error in addTransaction:', error);
        alert('Failed to add transaction. Check console for details.');
    });
}

function loadTransactions() {
    console.log('Loading transactions...'); // Debug
    fetch('get_transactions.php')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.transactions && data.summary) {
            displayTransactions(data.transactions);
            updateSummary(data.summary);
            console.log('Transactions loaded:', data.transactions.length); // Debug
        } else {
            console.error('Invalid response from server:', data);
        }
    })
    .catch(error => {
        console.error('Error loading transactions:', error);
        // Optional: Show user-friendly message
        document.getElementById('transactionsBody').innerHTML = '<tr><td colspan="6">Error loading data. Please refresh.</td></tr>';
    });
}

function displayTransactions(transactions) {
    const tbody = document.getElementById('transactionsBody');
    if (!tbody) {
        console.error('Transactions body not found!');
        return;
    }
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
    const totalIncomeEl = document.getElementById('totalIncome');
    const totalExpensesEl = document.getElementById('totalExpenses');
    const netBalanceEl = document.getElementById('netBalance');
    
    if (totalIncomeEl) totalIncomeEl.textContent = summary.totalIncome.toFixed(2);
    if (totalExpensesEl) totalExpensesEl.textContent = summary.totalExpenses.toFixed(2);
    if (netBalanceEl) netBalanceEl.textContent = summary.netBalance.toFixed(2);
}

function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        console.log('Deleting transaction ID:', id); // Debug
        fetch(`delete_transaction.php?id=${id}`, { 
            method: 'DELETE' 
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                loadTransactions();
                console.log('Transaction deleted'); // Debug
            } else {
                alert('Error deleting transaction: ' + (data.message || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error in deleteTransaction:', error);
            alert('Failed to delete transaction.');
        });
    }
}
