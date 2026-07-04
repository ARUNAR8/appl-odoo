import React from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function AdminDashboard() {
  const pendingLeaves = [
    { id: 1, name: 'Alice Smith', type: 'Annual Leave', duration: '3 Days', reason: 'Family trip' },
    { id: 2, name: 'Bob Johnson', type: 'Sick Leave', duration: '1 Day', reason: 'Medical appointment' },
    { id: 3, name: 'Charlie Brown', type: 'Unpaid Leave', duration: '5 Days', reason: 'Personal matters' }
  ];

  return (
    <div className="page-wrapper">
      <div className="dashboard-grid">
        <Card>
          <div className="stat-card-content">
            <div className="stat-info">
              <span className="stat-label">Total Employees</span>
              <span className="stat-value">148</span>
              <span className="stat-change up">↑ 4 joined this month</span>
            </div>
            <div className="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card>
          <div className="stat-card-content">
            <div className="stat-info">
              <span className="stat-label">Present Today</span>
              <span className="stat-value">132 / 148</span>
              <span className="stat-change">89% attendance rate</span>
            </div>
            <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card>
          <div className="stat-card-content">
            <div className="stat-info">
              <span className="stat-label">Pending Approvals</span>
              <span className="stat-value">5 Requests</span>
              <span className="stat-change down">Action required</span>
            </div>
            <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', flexWrap: 'wrap' }}>
        <Card title="Pending Leave Approvals">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingLeaves.map((leave) => (
                  <tr key={leave.id}>
                    <td><strong>{leave.name}</strong></td>
                    <td>{leave.type}</td>
                    <td>{leave.duration}</td>
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

        <Card title="HR Management Console">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Button variant="primary" style={{ width: '100%' }}>Add New Employee</Button>
            <Button variant="outline" style={{ width: '100%' }}>Generate Payroll Run</Button>
            <Button variant="ghost" style={{ width: '100%' }}>Download Monthly Report</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}