import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { createTransaction, deleteTransaction, getMyTransactions, leftJoinUsersTransactions, rightJoinTransactionsUsers, updateTransaction } from "../controllers/transactionController.js";

const router = express.Router();

router.post("/transactions", authMiddleware, createTransaction);
router.get("/transactions", authMiddleware, getMyTransactions);
router.put("/transactions/:id", authMiddleware, updateTransaction);
router.delete("/transactions/:id", authMiddleware, deleteTransaction);
router.get("/left-join", leftJoinUsersTransactions)
router.get("/right-join", rightJoinTransactionsUsers)

export default router;
