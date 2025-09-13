import { sql } from "../config/db.js";
const SERVER_ERROR_MSG = "Internal server Error.";

export async function getTransactionsByUserId(req, res) {
  try {
    const { userId } = req.params;
    const transactions = await sql`
    SELECT * FROM transactions 
    WHERE user_id = ${userId} 
    ORDER BY created_at DESC
    `;

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error in getting transactions", error);
    res.status(500).json({ message: SERVER_ERROR_MSG });
  }
}

export async function createTransaction(req, res) {
  try {
    const { user_id, title, amount, category } = req.body;

    if (!user_id || !title || amount === undefined || !category) {
      return res.status(400).json({ message: "All fields is required." });
    }

    const transaction = await sql`
        INSERT INTO transactions(user_id, title, amount, category)
        VALUES (${user_id}, ${title}, ${amount}, ${category})
        RETURNING *
        `;
    console.log(transaction);
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.error("Error in creating transaction", error);
    res.status(500).json({ message: SERVER_ERROR_MSG });
  }
}

export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid Transaction id." });
    }
    const result = await sql`
    DELETE FROM transactions WHERE id=${id} RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Transaction Not Found." });
    }
    res.status(200).json({ message: "Transaction Deleted Successfully." });
  } catch (error) {
    console.error("Error in deleting a transaction", error);
    res.status(500).json({ message: SERVER_ERROR_MSG });
  }
}

export async function getSummaryTransaction(req, res) {
  try {
    const { userId } = req.params;
    // SELECT COALESCE(SUM(amount), 0) as balance -> GET SUM BUT IF UNDEFINED GET 0
    const balanceResult = await sql`
    SELECT COALESCE(SUM(amount), 0) AS balance 
    FROM transactions 
    WHERE user_id = ${userId}
    `;

    const incomeResult = await sql`
    SELECT COALESCE(SUM(amount), 0) AS income 
    FROM transactions 
    WHERE user_id = ${userId} AND amount > 0
    `;

    const expensesResult = await sql`
    SELECT COALESCE(SUM(amount), 0) AS expenses 
    FROM transactions 
    WHERE user_id = ${userId} AND amount < 0;
    `;

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expensesResult[0].expenses,
    });
  } catch (error) {
    console.error("Error in getting summary", error);
    req.status(500).json({ message: SERVER_ERROR_MSG });
  }
}
