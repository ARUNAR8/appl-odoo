import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function EmployeeLeave() {
  const { database, getActiveEmployee, applyForLeave } = useContext(AuthContext);
  
  const emp = getActiveEmployee();
  const [leaveType, setLeaveType] = useState('Annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  if (!emp) return <div style={{ padding: '2rem' }}>Loading leave profile...</div>;

  const empRequests = database.leaves
    .filter(req => req.empId === emp.id)
    .sort((a, b) => b.id.localeCompare(a.id)); // Show newest requests

  // Calculate used balances
  const approvedLeaves = empRequests.filter(r => r.status === 'Approved');
  
  const annualUsed = approvedLeaves
    .filter(r => r.type === 'Annual')
    .reduce((sum, r) => sum + parseInt(r.duration || 0), 0);

  const sickUsed = approvedLeaves
    .filter(r => r.type === 'Sick')
    .reduce((sum, r) => sum + parseInt(r.duration || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (new Date(startDate) > new Date(endDate)) {
      alert('End Date cannot be before Start Date');
      return;
    }

    setLoading(true);

    // Calculate duration in days
    const diffTime = Math.abs(new Date(endDate) - new Date(startDate));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    setTimeout(() => {
      applyForLeave(emp.id, {
        type: leaveType,
        startDate,
        endDate,
        duration: diffDays,
        reason
      });
      setLoading(false);
      setStartDate('');
      setEndDate('');
      setReason('');
      alert('Leave application submitted successfully!');
    }, 1000);
  };

  return (
    <div className="page-wrapper">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <Card title="Leave Balances">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'center' }}>
            <div style={{ padding: '1.25rem 1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Annual Leave</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{15 - annualUsed} / 15 Days</p>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{annualUsed} used</span>
            </div>
            <div style={{ padding: '1.25rem 1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Sick Leave</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{7 - sickUsed} / 7 Days</p>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sickUsed} used</span>
            </div>
          </div>
        </Card>

        <Card title="Apply for Time-Off">
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <label className="input-label">Leave Type</label>
              <select className="input-field" value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                <option value="Annual">Annual Leave</option>
                <option value="Sick">Sick Leave</option>
                <option value="Personal">Personal Leave (Unpaid)</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <Input 
                label="Start Date" 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                required 
              />
              <Input 
                label="End Date" 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
                required 
              />
            </div>

            <Input 
              label="Reason / Remarks" 
              type="text" 
              placeholder="e.g. Doctor appointment, family function..." 
              value={reason} 
              onChange={(e) => setReason(e.target.value)} 
              required 
            />

            <Button type="submit" variant="primary" loading={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
              Submit Request
            </Button>
          </form>
        </Card>
      </div>

      <Card title="My Leave History Logs">
        {empRequests.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', padding: '1rem' }}>No applied leaves history found.</p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Leave Type</th>
                  <th>Dates Range</th>
                  <th>Total Duration</th>
                  <th>Reason</th>
                  <th>Manager Comment</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {empRequests.map((row, idx) => (
                  <tr key={idx}>
                    <td><strong>{row.type} Leave</strong></td>
                    <td>{row.dates}</td>
                    <td>{row.duration}</td>
                    <td>{row.reason}</td>
                    <td><span style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>{row.comment || '--'}</span></td>
                    <td>
                      <span className={"badge " + (
                        row.status === 'Approved' ? 'badge-success' : 
                        row.status === 'Pending' ? 'badge-warning' : 'badge-danger'
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