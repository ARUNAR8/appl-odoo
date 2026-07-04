import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function AdminAttendance() {
  const { database } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Map database logs to include employee name and department
  const attendanceLogs = database.attendance.map(log => {
    const emp = database.employees.find(e => e.id === log.empId);
    return {
      ...log,
      name: emp ? emp.name : 'Unknown Employee',
      department: emp ? emp.department : 'General'
    };
  }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort latest first

  // Filter logs
  const filteredLogs = attendanceLogs.filter(log => {
    const matchesSearch = 
      log.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.empId.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesDate = selectedDate ? log.date === selectedDate : true;

    return matchesSearch && matchesDate;
  });

  const handleExport = () => {
    alert('Simulating CSV Data Export... Registry exported successfully!');
  };

  return (
    <div className="page-wrapper">
      <Card title="Company Attendance Registry Dashboard">
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 2, minWidth: '240px' }}>
            <Input
              label="Search Employee or Department"
              placeholder="Search name, ID, or division..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginBottom: 0 }}
            />
          </div>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <Input
              label="Filter Date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ marginBottom: 0 }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {selectedDate && (
              <Button variant="outline" onClick={() => setSelectedDate('')}>
                Clear Date
              </Button>
            )}
            <Button variant="primary" onClick={handleExport}>
              Export CSV Registry
            </Button>
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', padding: '1.5rem 0', textAlign: 'center' }}>
            No attendance records matched the search filters.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Employee Name</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Clock In</th>
                  <th>Clock Out</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((row, idx) => (
                  <tr key={idx}>
                    <td><code>{row.empId}</code></td>
                    <td><strong>{row.name}</strong></td>
                    <td>{row.department}</td>
                    <td>{row.date}</td>
                    <td>{row.checkIn}</td>
                    <td>{row.checkOut || '--'}</td>
                    <td>
                      <span className={"badge " + (
                        row.status === 'Present' ? 'badge-success' : 
                        row.status === 'Late' ? 'badge-warning' : 'badge-danger'
                      )}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}