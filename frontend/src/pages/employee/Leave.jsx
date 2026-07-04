import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function EmployeeLeave() {
  const [leaveType, setLeaveType] = useState('Annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Leave application submitted!');
      setStartDate('');
      setEndDate('');
      setReason('');
    }, 1500);
  };

  const history = [
    { type: 'Annual Leave', range: '2026-08-10 to 2026-08-14', duration: '5 Days', status: 'Approved' },
    { type: 'Sick Leave', range: '2026-07-01 to 2026-07-01', duration: '1 Day', status: 'Approved' },
    { type: 'Personal Leave', range: '2026-09-02 to 2026-09-04', duration: '3 Days', status: 'Pending' }
  ];

  return (
    <div className="page-wrapper">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <Card title="Leave Balances">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'center' }}>
            <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ color: 'var(--text-secondary)' }}>Annual Leave</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>12 / 15 Days</p>
            </div>
            <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ color: 'var(--text-secondary)' }}>Sick Leave</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>5 / 7 Days</p>
            </div>
          </div>
        </Card>

        <Card title="Apply for Leave">
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <label className="input-label">Leave Type</label>
              <select className="input-field" value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                <option value="Annual">Annual Leave</option>
                <option value="Sick">Sick Leave</option>
                <option value="Personal">Personal Leave</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <Input label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
              <Input label="End Date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
            </div>

            <Input label="Reason" type="text" placeholder="Short description..." value={reason} onChange={(e) => setReason(e.target.value)} required />

            <Button type="submit" variant="primary" loading={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
              Submit Application
            </Button>
          </form>
        </Card>
      </div>

      <Card title="Leave Applications History">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>Duration Range</th>
                <th>Days Count</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((row, idx) => (
                <tr key={idx}>
                  <td><strong>{row.type}</strong></td>
                  <td>{row.range}</td>
                  <td>{row.duration}</td>
                  <td>
                    <span className={"badge " + (row.status === 'Approved' ? 'badge-success' : 'badge-warning')}>
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