<?php
header('Content-Type: application/json');
include 'config.php';

try {
    // Fetch all transactions
    $stmt = $pdo->query("SELECT * FROM transactions ORDER BY date DESC");
    $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Calculate summary
    $incomeStmt = $pdo->query("SELECT SUM(amount) as total FROM transactions WHERE type = 'income'");
    $expenseStmt = $pdo->query("SELECT SUM(amount) as total FROM transactions WHERE type = 'expense'");
    
    $totalIncome = $incomeStmt->fetch()['total'] ?? 0;
    $totalExpenses = $expenseStmt->fetch()['total'] ?? 0;
    $netBalance = $totalIncome - $totalExpenses;

    echo json_encode([
        'transactions' => $transactions,
        'summary' => [
            'totalIncome' => floatval($totalIncome),
            'totalExpenses' => floatval($totalExpenses),
            'netBalance' => floatval($netBalance)
        ]
    ]);
} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
