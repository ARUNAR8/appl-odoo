import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function AdminAttendance() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const dailyAttendance = [
    { name: 'Alice Smith', department: 'Engineering', checkIn: '08:58 AM', checkOut: '05:00 PM', status: 'Present' },
    { name: 'Bob Johnson', department: 'Design', checkIn: '09:12 AM', checkOut: '05:05 PM', status: 'Late' },
    { name: 'Charlie Brown', department: 'HR', checkIn: '09:01 AM', checkOut: '--', status: 'Present' },
    { name: 'David Miller', department: 'Marketing', checkIn: '--', checkOut: '--', status: 'Absent' },
    { name: 'Emma Wilson', department: 'Finance', checkIn: '08:45 AM', checkOut: '04:30 PM', status: 'Present' }
  ];

  const filteredAttendance = dailyAttendance.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-wrapper">
      <Card title="Attendance Registry Control">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <Input
              placeholder="Search by Employee or Department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginBottom: 0 }}
            />
          </div>
          <Button variant="outline">Filter Date</Button>
          <Button variant="primary">Export CSV</Button>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Clock In</th>
                <th>Clock Out</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map((row, idx) => (
                <tr key={idx}>
                  <td><strong>{row.name}</strong></td>
                  <td>{row.department}</td>
                  <td>{row.checkIn}</td>
                  <td>{row.checkOut}</td>
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
      </Card>
    </div>
  );
}