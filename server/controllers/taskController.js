const pool = require("../config/db");

const createTask = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.userId;
  try {
    const result = await pool.query(
      "INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *",
      [title, description, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTasks = async (req, res) => {
  const userId = req.user.userId;
  try {
    const result = await pool.query(
      "SELECT * FROM tasks WHERE user_id = $1 AND deleted_at IS NULL",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const result = await pool.query(
      "UPDATE tasks SET title = $1, description = $2 WHERE id = $3 AND deleted_at IS NULL RETURNING *",
      [title, description, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      "UPDATE tasks SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL",
      [id]
    );
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
