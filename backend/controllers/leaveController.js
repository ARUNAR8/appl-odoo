exports.applyLeave = async (req, res) => {
  try {
    res.status(201).json({ message: 'Leave applied' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};