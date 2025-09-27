<?php
header('Content-Type: application/json');
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'DELETE' || isset($_GET['id'])) {
    $id = $_GET['id'] ?? 0;
    if ($id <= 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid ID']);
        exit;
    }
    try {
        $stmt = $pdo->prepare("DELETE FROM transactions WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>
