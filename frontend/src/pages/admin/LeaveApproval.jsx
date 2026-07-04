import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function AdminLeaveApproval() {
  const { database, approveLeave } = useContext(AuthContext);
  const [filterMode, setFilterMode] = useState('Pending'); // 'Pending', 'Approved', 'Rejected'

  const filteredLeaves = database.leaves
    .filter(req => req.status === filterMode)
    .sort((a, b) => b.id.localeCompare(a.id)); // Show newest requests first

  const handleAction = (leaveId, status) => {
    const comment = prompt(`Add an optional manager comment/reason for this ${status.toLowerCase()} decision:`) || '';
    approveLeave(leaveId, status, comment);
    alert(`Leave application has been ${status.toLowerCase()} successfully!`);
  };

  return (
    <div className="page-wrapper">
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <Button 
          variant={filterMode === 'Pending' ? 'primary' : 'outline'} 
          size="sm" 
          onClick={() => setFilterMode('Pending')}
        >
          Pending Review ({database.leaves.filter(l => l.status === 'Pending').length})
        </Button>
        <Button 
          variant={filterMode === 'Approved' ? 'primary' : 'outline'} 
          size="sm" 
          onClick={() => setFilterMode('Approved')}
        >
          Approved Archive ({database.leaves.filter(l => l.status === 'Approved').length})
        </Button>
        <Button 
          variant={filterMode === 'Rejected' ? 'primary' : 'outline'} 
          size="sm" 
          onClick={() => setFilterMode('Rejected')}
        >
          Rejected Archive ({database.leaves.filter(l => l.status === 'Rejected').length})
        </Button>
      </div>

      <Card title={`${filterMode} Time-Off Applications Queue`}>
        {filteredLeaves.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', padding: '1.5rem 0', textAlign: 'center' }}>
            No leave requests found in this archive.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Employee Name</th>
                  <th>Department</th>
                  <th>Leave Type</th>
                  <th>Dates Range</th>
                  <th>Duration</th>
                  <th>Employee Reason</th>
                  {filterMode !== 'Pending' && <th>Manager Remarks</th>}
                  {filterMode === 'Pending' && <th>Action Approvals</th>}
                </tr>
              </thead>
              <tbody>
                {filteredLeaves.map((row) => (
                  <tr key={row.id}>
                    <td><code>{row.empId}</code></td>
                    <td><strong>{row.name}</strong></td>
                    <td>{row.department}</td>
                    <td>{row.type} Leave</td>
                    <td>{row.dates}</td>
                    <td>{row.duration}</td>
                    <td>{row.reason}</td>
                    {filterMode !== 'Pending' && (
                      <td>
                        <span style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                          {row.comment || '--'}
                        </span>
                      </td>
                    )}
                    {filterMode === 'Pending' && (
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Button variant="success" size="sm" onClick={() => handleAction(row.id, 'Approved')}>
                            Approve
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleAction(row.id, 'Rejected')}>
                            Reject
                          </Button>
                        </div>
                      </td>
                    )}
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