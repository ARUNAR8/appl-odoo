import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function AdminDashboard() {
  const { database, selectedEmployeeId, setSelectedEmployeeId, approveLeave } = useContext(AuthContext);
  const navigate = useNavigate();

  // Company wide stats calculations
  const totalEmployees = database.employees.length;
  
  const today = new Date().toISOString().split('T')[0];
  const presentCount = database.attendance.filter(
    log => log.date === today && (log.status === 'Present' || log.status === 'Late')
  ).length;

  const pendingLeaves = database.leaves.filter(req => req.status === 'Pending');

  // Calculate monthly total payout from processed salaries
  const totalPayout = database.employees.reduce(
    (sum, emp) => sum + (emp.basicSalary + emp.allowances - emp.deductions), 0
  );

  const handleSwitchEmployee = (e) => {
    setSelectedEmployeeId(e.target.value);
  };

  const handleActionLeave = (leaveId, status) => {
    const comment = prompt(`Add a comment/remark for this decision (optional):`) || '';
    approveLeave(leaveId, status, comment);
    alert(`Leave request has been ${status.toLowerCase()}!`);
  };

  return (
    <div className="page-wrapper">
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', textAlign: 'left' }}>Admin Management Console</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, textAlign: 'left' }}>Company-wide oversight and approvals.</p>
        </div>
        
        {/* Switch Employee Dropdown Context Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', textAlign: 'left' }}>
          <label htmlFor="switch-employee" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Switch View Context:
          </label>
          <select
            id="switch-employee"
            className="input-field"
            value={selectedEmployeeId}
            onChange={handleSwitchEmployee}
            style={{ width: '240px', padding: '0.5rem' }}
          >
            <option value="">Admin View (Self)</option>
            {database.employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Switch Alert Banner if viewing employee context */}
      {selectedEmployeeId && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'rgba(99,102,241,0.15)', border: '1px dashed var(--primary)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontWeight: 'bold', display: 'block', color: 'var(--primary)' }}>Switched Context Mode Active</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              You are currently viewing other tabs (Attendance, Leaves, Profile, Payroll) as this employee.
            </span>
          </div>
          <Button variant="primary" size="sm" onClick={() => setSelectedEmployeeId('')}>
            Exit Switched View
          </Button>
        </div>
      )}

      <div className="dashboard-grid">
        <Card>
          <div className="stat-card-content">
            <div className="stat-info">
              <span className="stat-label">Total Employee Directory</span>
              <span className="stat-value">{totalEmployees}</span>
              <span className="stat-change up">Active staff members</span>
            </div>
            <div className="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197" />
              </svg>
            </div>
          </div>
        </Card>

        <Card>
          <div className="stat-card-content">
            <div className="stat-info">
              <span className="stat-label">Present Today</span>
              <span className="stat-value">{presentCount}</span>
              <span className="stat-change">Active check-ins logged today</span>
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
              <span className="stat-label">Pending Leave Requests</span>
              <span className="stat-value">{pendingLeaves.length}</span>
              <span className="stat-change down">Requires your review</span>
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
        <Card title="Leave Request Approvals Queue">
          {pendingLeaves.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', padding: '1rem 0' }}>All clear! No leave requests pending review.</p>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Type</th>
                    <th>Dates Range</th>
                    <th>Reason</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingLeaves.map((req) => (
                    <tr key={req.id}>
                      <td><strong>{req.name}</strong></td>
                      <td>{req.type}</td>
                      <td>{req.dates} ({req.duration})</td>
                      <td>{req.reason}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Button variant="success" size="sm" onClick={() => handleActionLeave(req.id, 'Approved')}>Approve</Button>
                          <Button variant="danger" size="sm" onClick={() => handleActionLeave(req.id, 'Rejected')}>Reject</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card title="Quick Management Actions">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Button variant="primary" style={{ width: '100%' }} onClick={() => navigate('/admin/employees')}>
              Manage Employee Directory
            </Button>
            <Button variant="outline" style={{ width: '100%' }} onClick={() => navigate('/admin/payroll')}>
              Run / Update Monthly Payroll
            </Button>
            <Button variant="ghost" style={{ width: '100%' }} onClick={() => navigate('/admin/attendance')}>
              View Attendance Logs
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}