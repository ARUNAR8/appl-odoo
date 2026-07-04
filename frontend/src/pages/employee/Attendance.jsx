import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function EmployeeAttendance() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleCheckIn = () => {
    setIsCheckedIn(!isCheckedIn);
  };

  const logs = [
    { date: '2026-07-03', checkIn: '09:02 AM', checkOut: '05:04 PM', status: 'Present' },
    { date: '2026-07-02', checkIn: '08:58 AM', checkOut: '05:00 PM', status: 'Present' },
    { date: '2026-07-01', checkIn: '09:12 AM', checkOut: '05:01 PM', status: 'Late' },
    { date: '2026-06-30', checkIn: '09:00 AM', checkOut: '05:03 PM', status: 'Present' }
  ];

  return (
    <div className="page-wrapper">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <Card title="Clock Center">
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem', letterSpacing: '1px' }}>{currentTime}</h3>
            <Button
              variant={isCheckedIn ? 'danger' : 'success'}
              size="lg"
              style={{ width: '100%', height: '54px', fontSize: '1.15rem' }}
              onClick={handleToggleCheckIn}
            >
              {isCheckedIn ? 'Check Out' : 'Check In'}
            </Button>
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
              Status: <strong>{isCheckedIn ? 'Checked In' : 'Checked Out'}</strong>
            </p>
          </div>
        </Card>

        <Card title="Attendance Summary (Current Month)">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
            <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ color: 'var(--text-muted)' }}>Days Present</h4>
              <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--success)' }}>21</p>
            </div>
            <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ color: 'var(--text-muted)' }}>Late Clock-ins</h4>
              <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--warning)' }}>2</p>
            </div>
            <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ color: 'var(--text-muted)' }}>Leave Count</h4>
              <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--primary)' }}>1</p>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Logs and History">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, idx) => (
                <tr key={idx}>
                  <td>{log.date}</td>
                  <td>{log.checkIn}</td>
                  <td>{log.checkOut}</td>
                  <td>
                    <span className={"badge " + (log.status === 'Present' ? 'badge-success' : 'badge-warning')}>
                      {log.status}
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