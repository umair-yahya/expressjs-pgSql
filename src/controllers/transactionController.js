import { db } from "../config/db.js";
import { transactions } from "../models/transactions.js";
import { users } from "../models/user.js";
import { eq } from "drizzle-orm";

export const createTransaction = async (req, res) => {
  try {
    const body = {
      ...req.body,
      user_id: req.user.id,
    };

    const [data] = await db.insert(transactions).values(body).returning();
    res.status(201).json({ success: true, transaction: data });
  } catch (err) {
    console.error("Create Transaction Error:", err);
    res.status(500).json({ success: false, message: "Failed to create transaction", error: err.message });
  }
};

export const getMyTransactions = async (req, res) => {
  try {
    const data = await db
      .select()
      .from(transactions)
      .where(eq(transactions.user_id, req.user.id));

    res.json({ success: true, transactions: data });
  } catch (err) {
    console.error("Get Transactions Error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch transactions", error: err.message });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const [data] = await db
      .update(transactions)
      .set(req.body)
      .where(eq(transactions.id, req.params.id))
      .returning();

    if (!data) return res.status(404).json({ success: false, message: "Transaction not found" });

    res.json({ success: true, updated: data });
  } catch (err) {
    console.error("Update Transaction Error:", err);
    res.status(500).json({ success: false, message: "Failed to update transaction", error: err.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const deleted = await db
      .delete(transactions)
      .where(eq(transactions.id, req.params.id))

    if (!deleted) return res.status(404).json({ success: false, message: "Transaction not found" });

    res.json({ success: true, message: "Transaction deleted" });
  } catch (err) {
    console.error("Delete Transaction Error:", err);
    res.status(500).json({ success: false, message: "Failed to delete transaction", error: err.message });
  }
};

export const leftJoinUsersTransactions = async (req, res) => {
  try {
    const data = await db
      .select({
        userId: users.id,
        userName: users.name,
        transactionId: transactions.id,
        product: transactions.product,
        quantity: transactions.quantity,
        price: transactions.price,
        type: transactions.type,
      })
      .from(users)
      .leftJoin(transactions, eq(users.id, transactions.user_id))

    res.json({success: true, data });
  } catch (err) {
    res.status(500).json({ message: "Error fetching data", error: err.message });
  }
};

export const rightJoinTransactionsUsers = async (req, res) => {
  try {
    const results = await db.execute(`
      SELECT 
        t.id as "transactionId",
        t.product,
        t.quantity,
        t.price,
        t.type,
        u.id as "userId",
        u.name as "userName"
      FROM transactions t
      RIGHT JOIN users u
      ON t.user_id = u.id
      WHERE t.id IS NOT NULL

    `);

    res.json({ success: true, data: results.rows  });
  } catch (err) {
    console.error("RIGHT JOIN Error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch data", error: err.message });
  }
};