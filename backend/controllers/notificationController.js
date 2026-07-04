const pool = require('../config/db');

exports.getNotifications = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM notifications WHERE userId = ?',
      [req.user.id]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  const { id } = req.params;
  try {
    if (id === 'all') {
      await pool.query(
        'UPDATE notifications SET isRead = 1 WHERE userId = ?',
        [req.user.id]
      );
    } else {
      await pool.query(
        'UPDATE notifications SET isRead = 1 WHERE id = ?',
        [id]
      );
    }
    res.status(200).json({ message: 'Notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Exportable helper for system-triggered notifications
exports.createNotification = async (userId, message, type = 'info') => {
  try {
    await pool.query(
      'INSERT INTO notifications (userId, message, type, isRead) VALUES (?, ?, ?, 0)',
      [userId, message, type]
    );
    console.log(`[Notification] Created for ${userId}: "${message}"`);
  } catch (err) {
    console.error('Failed to create notification:', err);
  }
};
