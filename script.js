document.addEventListener('DOMContentLoaded', function() {
    loadTransactions(); // Load initial transactions

    const form = document.getElementById('transactionForm');
    form.addEventListener('submit', addTransaction);

    // Set default date to today
    document.getElementById('date').valueAsDate = new Date();
});
