import React from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function EmployeeDashboard() {
  const recentActivities = [
    { id: 1, action: 'Checked In', time: 'Today, 9:02 AM', status: 'On Time' },
    { id: 2, action: 'Checked Out', time: 'Yesterday, 5:04 PM', status: 'Completed' },
    { id: 3, action: 'Leave Requested', time: 'July 1, 2026', status: 'Pending' },
    { id: 4, action: 'Checked In', time: 'June 30, 2026, 9:15 AM', status: 'Late' }
  ];

  return (
    <div className="page-wrapper">
      <div className="dashboard-grid">
        <Card>
          <div className="stat-card-content">
            <div className="stat-info">
              <span className="stat-label">Attendance Rate</span>
              <span className="stat-value">98.2%</span>
              <span className="stat-change up">↑ 0.5% this month</span>
            </div>
            <div className="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card>
          <div className="stat-card-content">
            <div className="stat-info">
              <span className="stat-label">Remaining Leaves</span>
              <span className="stat-value">14 Days</span>
              <span className="stat-change">Earned Annual Leave</span>
            </div>
            <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.75m-3.75 3h3.75m-3.75 3h3.75m-3.75 3h3.75M12 3v18" />
              </svg>
            </div>
          </div>
        </Card>

        <Card>
          <div className="stat-card-content">
            <div className="stat-info">
              <span className="stat-label">Net Salary (June)</span>
              <span className="stat-value">$4,250.00</span>
              <span className="stat-change up">Processed on June 30</span>
            </div>
            <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h16.5a1.5 1.5 0 011.5 1.5v11.25a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V6a1.5 1.5 0 011.5-1.5zm1.5 3h13.5m-13.5 3h13.5m-13.5 3h13.5" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', flexWrap: 'wrap' }}>
        <Card title="Recent Activity Logs">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Timestamp</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivities.map((act) => (
                  <tr key={act.id}>
                    <td><strong>{act.action}</strong></td>
                    <td>{act.time}</td>
                    <td>
                      <span className={"badge " + (
                        act.status === 'On Time' || act.status === 'Completed' ? 'badge-success' : 
                        act.status === 'Pending' ? 'badge-warning' : 'badge-danger'
                      )}>
                        {act.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Quick Actions">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Button variant="primary" style={{ width: '100%' }}>
              Clock In / Out
            </Button>
            <Button variant="outline" style={{ width: '100%' }}>
              Request Leave
            </Button>
            <Button variant="ghost" style={{ width: '100%' }}>
              Download Latest Payslip
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}