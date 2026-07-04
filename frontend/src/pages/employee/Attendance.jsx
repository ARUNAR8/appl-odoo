import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function EmployeeAttendance() {
  const { database, getActiveEmployee, clockInOrOut } = useContext(AuthContext);
  
  const emp = getActiveEmployee();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!emp) return <div style={{ padding: '2rem' }}>Loading attendance profile...</div>;

  const empLogs = database.attendance
    .filter(log => log.empId === emp.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort latest first

  const presentCount = empLogs.filter(log => log.status === 'Present').length;
  const lateCount = empLogs.filter(log => log.status === 'Late').length;

  const today = new Date().toISOString().split('T')[0];
  const todayLog = empLogs.find(log => log.date === today);
  const isClockedIn = todayLog && (!todayLog.checkOut || todayLog.checkOut === '');

  const handleToggleCheckIn = () => {
    clockInOrOut(emp.id);
  };

  return (
    <div className="page-wrapper">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <Card title="Time Clocking Center">
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <h3 style={{ fontSize: '2.5rem', marginBottom: '1rem', letterSpacing: '1px', fontWeight: 700, color: 'var(--primary)' }}>
              {currentTime}
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Today: {new Date().toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <Button
              variant={isClockedIn ? 'danger' : 'success'}
              size="lg"
              style={{ width: '100%', height: '54px', fontSize: '1.15rem' }}
              onClick={handleToggleCheckIn}
            >
              {isClockedIn ? 'Clock Out' : 'Clock In'}
            </Button>
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
              Current Status: <strong style={{ color: isClockedIn ? 'var(--success)' : 'var(--text-muted)' }}>{isClockedIn ? 'Clocked In' : 'Clocked Out'}</strong>
            </p>
            {todayLog && (
              <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Clock-in recorded at: <strong>{todayLog.checkIn}</strong>
                {todayLog.checkOut && <> | Clock-out at: <strong>{todayLog.checkOut}</strong></>}
              </div>
            )}
          </div>
        </Card>

        <Card title="Monthly Tracking Stats">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', height: '100%', alignItems: 'center' }}>
            <div style={{ padding: '1.25rem 1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Days Present</h4>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>{presentCount}</p>
            </div>
            <div style={{ padding: '1.25rem 1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Late Clock-ins</h4>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)' }}>{lateCount}</p>
            </div>
            <div style={{ padding: '1.25rem 1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Active Tracker</h4>
              <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>Weekly View</p>
            </div>
            <div style={{ padding: '1.25rem 1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Logged Days</h4>
              <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{empLogs.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Clock In/Out Registry History">
        {empLogs.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', padding: '1rem' }}>No attendance log history found.</p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Clock In</th>
                  <th>Clock Out</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {empLogs.map((log, idx) => (
                  <tr key={idx}>
                    <td><strong>{log.date}</strong></td>
                    <td>{log.checkIn}</td>
                    <td>{log.checkOut || '--'}</td>
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
        )}
      </Card>
    </div>
  );
}