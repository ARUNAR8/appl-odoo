import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function EmployeeDashboard() {
  const { database, getActiveEmployee, clockInOrOut } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const emp = getActiveEmployee();
  if (!emp) return <div style={{ padding: '2rem' }}>Loading employee details...</div>;

  // 1. Attendance Rate Calculations
  const empLogs = database.attendance.filter(log => log.empId === emp.id);
  const presentLogs = empLogs.filter(log => log.status === 'Present' || log.status === 'Late');
  const attRate = empLogs.length > 0 
    ? ((presentLogs.length / empLogs.length) * 100).toFixed(1) 
    : '100.0';

  // 2. Leave Balance Calculations
  const approvedLeaves = database.leaves.filter(
    req => req.empId === emp.id && req.status === 'Approved'
  );
  
  const annualUsed = approvedLeaves
    .filter(req => req.type === 'Annual')
    .reduce((sum, req) => sum + parseInt(req.duration || 0), 0);
  const remainingLeaves = Math.max(15 - annualUsed, 0);

  // 3. Payroll Latest Net Pay Calculations
  const empPayslips = database.payroll.filter(p => p.empId === emp.id);
  const latestPayslip = empPayslips.length > 0 ? empPayslips[empPayslips.length - 1] : null;
  const netPay = latestPayslip 
    ? latestPayslip.netPay 
    : (emp.basicSalary + emp.allowances - emp.deductions);

  // 4. Combine Recent Activity Logs
  const combinedActivities = [];
  
  // Add attendance logs
  empLogs.forEach(log => {
    combinedActivities.push({
      type: 'attendance',
      action: `Clocked In (${log.status})`,
      time: `${log.date}, ${log.checkIn}`,
      status: log.status
    });
  });

  // Add leave logs
  const empLeaves = database.leaves.filter(req => req.empId === emp.id);
  empLeaves.forEach(req => {
    combinedActivities.push({
      type: 'leave',
      action: `Requested ${req.type} Leave`,
      time: `Dates: ${req.dates}`,
      status: req.status
    });
  });

  // Sort by date/time (mock sorting, since it's mockup we can just show latest first)
  const sortedActivities = combinedActivities.slice(0, 4);

  // Check clock state
  const today = new Date().toISOString().split('T')[0];
  const todayLog = empLogs.find(log => log.date === today);
  const isClockedIn = todayLog && (!todayLog.checkOut || todayLog.checkOut === '');

  const handleClockClick = () => {
    clockInOrOut(emp.id);
  };

  return (
    <div className="page-wrapper">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', textAlign: 'left' }}>
          Hello, {emp.name}
        </h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0, textAlign: 'left' }}>
          Here is your workday summary and quick actions.
        </p>
      </div>

      <div className="dashboard-grid">
        {/* Stat Card 1 */}
        <Card>
          <div className="stat-card-content">
            <div className="stat-info">
              <span className="stat-label">Attendance Rate</span>
              <span className="stat-value">{attRate}%</span>
              <span className="stat-change up">Based on {empLogs.length} tracked days</span>
            </div>
            <div className="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        {/* Stat Card 2 */}
        <Card>
          <div className="stat-card-content">
            <div className="stat-info">
              <span className="stat-label">Annual Leave Balance</span>
              <span className="stat-value">{remainingLeaves} Days</span>
              <span className="stat-change">Out of 15 days yearly allowance</span>
            </div>
            <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5" />
              </svg>
            </div>
          </div>
        </Card>

        {/* Stat Card 3 */}
        <Card>
          <div className="stat-card-content">
            <div className="stat-info">
              <span className="stat-label">Net Salary ({latestPayslip ? latestPayslip.month.split(' ')[0] : 'Current'})</span>
              <span className="stat-value">${netPay.toLocaleString()}</span>
              <span className="stat-change up">{latestPayslip ? 'Processed and Paid' : 'Estimate (Base Salary)'}</span>
            </div>
            <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h16.5a1.5 1.5 0 011.5 1.5v11.25a1.5 1.5 0 01-1.5 1.5H3.75A1.5 1.5 0 012.25 16.5V6a1.5 1.5 0 011.5-1.5z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <Card title="Activity Log & Requests">
          {sortedActivities.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', padding: '1rem 0' }}>No recent activity records.</p>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Detail / Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedActivities.map((act, idx) => (
                    <tr key={idx}>
                      <td><strong>{act.action}</strong></td>
                      <td>{act.time}</td>
                      <td>
                        <span className={"badge " + (
                          act.status === 'Present' || act.status === 'Approved' ? 'badge-success' : 
                          act.status === 'Pending' || act.status === 'Late' ? 'badge-warning' : 'badge-danger'
                        )}>
                          {act.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card title="Quick Portal Actions">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem 0' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>Daily Time Tracking</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{isClockedIn ? 'Working now' : 'Not clocked in'}</span>
              </div>
              <Button 
                variant={isClockedIn ? 'danger' : 'success'} 
                size="sm" 
                onClick={handleClockClick}
              >
                {isClockedIn ? 'Clock Out' : 'Clock In'}
              </Button>
            </div>

            <Button variant="primary" style={{ width: '100%' }} onClick={() => navigate('/leave')}>
              Request Leave / Time-Off
            </Button>
            <Button variant="outline" style={{ width: '100%' }} onClick={() => navigate('/payroll')}>
              View Payslip Details
            </Button>
            <Button variant="ghost" style={{ width: '100%' }} onClick={() => navigate('/profile')}>
              Update Profile Details
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}