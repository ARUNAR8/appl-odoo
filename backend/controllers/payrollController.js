exports.getPayroll = async (req, res) => {
  try {
    res.status(200).json({ message: 'Payroll details' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};