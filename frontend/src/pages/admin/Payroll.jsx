import React from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function AdminPayroll() {
  const employees = [
    { name: 'Alice Smith', base: '$6,200', allowances: '$500', deductions: '$700', netPay: '$6,000', status: 'Paid' },
    { name: 'Bob Johnson', base: '$5,500', allowances: '$300', deductions: '$600', netPay: '$5,200', status: 'Paid' },
    { name: 'Charlie Brown', base: '$4,800', allowances: '$200', deductions: '$500', netPay: '$4,500', status: 'Pending' }
  ];

  return (
    <div className="page-wrapper">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <Card title="Payroll Processing Panel">
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Current Cycle: <strong>July 2026</strong>
          </p>
          <Button variant="primary" style={{ width: '100%', marginBottom: '0.75rem' }}>
            Run Payroll Cycle
          </Button>
          <Button variant="outline" style={{ width: '100%' }}>
            Generate Direct Bank Transfers
          </Button>
        </Card>

        <Card title="Company Payroll Expenses Overview">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
            <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ color: 'var(--text-secondary)' }}>Total Payout</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>$485,200</p>
            </div>
            <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ color: 'var(--text-secondary)' }}>Taxes Witheld</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--warning)' }}>$82,400</p>
            </div>
            <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ color: 'var(--text-secondary)' }}>Status</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success)' }}>Active</p>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Employee Monthly Statements">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Base Salary</th>
                <th>Allowances</th>
                <th>Deductions</th>
                <th>Net Take-Home</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((row, idx) => (
                <tr key={idx}>
                  <td><strong>{row.name}</strong></td>
                  <td>{row.base}</td>
                  <td>{row.allowances}</td>
                  <td>{row.deductions}</td>
                  <td><strong style={{ color: 'var(--primary)' }}>{row.netPay}</strong></td>
                  <td>
                    <span className={"badge " + (row.status === 'Paid' ? 'badge-success' : 'badge-warning')}>
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