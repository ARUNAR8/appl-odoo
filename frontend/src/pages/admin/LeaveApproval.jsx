import React from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function AdminLeaveApproval() {
  const requests = [
    { id: 1, name: 'John Doe', department: 'Engineering', type: 'Annual Leave', dates: 'Aug 10 - Aug 15', reason: 'Family vacation' },
    { id: 2, name: 'Alice Smith', department: 'Marketing', type: 'Personal Leave', dates: 'Sep 02 - Sep 05', reason: 'Moving household' },
    { id: 3, name: 'Sarah Connor', department: 'Security', type: 'Sick Leave', dates: 'Jul 15 - Jul 16', reason: 'Dental surgery' }
  ];

  return (
    <div className="page-wrapper">
      <Card title="Pending Applications Control">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Leave Type</th>
                <th>Dates</th>
                <th>Reason</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <td><strong>{req.name}</strong></td>
                  <td>{req.department}</td>
                  <td>{req.type}</td>
                  <td>{req.dates}</td>
                  <td>{req.reason}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button variant="success" size="sm">Approve</Button>
                      <Button variant="danger" size="sm">Reject</Button>
                    </div>
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