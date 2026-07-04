exports.logAttendance = async (req, res) => {
  try {
    res.status(200).json({ message: 'Attendance logged' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};