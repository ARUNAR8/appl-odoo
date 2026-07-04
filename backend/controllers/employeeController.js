exports.getProfile = async (req, res) => {
  try {
    res.status(200).json({ message: 'Get profile' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};