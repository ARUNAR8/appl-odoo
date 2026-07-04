import React from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function EmployeePayroll() {
  const payslips = [
    { month: 'June 2026', base: '$4,500.00', allowances: '$300.00', deductions: '$550.00', netPay: '$4,250.00' },
    { month: 'May 2026', base: '$4,500.00', allowances: '$200.00', deductions: '$550.00', netPay: '$4,150.00' },
    { month: 'April 2026', base: '$4,500.00', allowances: '$200.00', deductions: '$550.00', netPay: '$4,150.00' }
  ];

  return (
    <div className="page-wrapper">
      <Card title="Latest Payslip Breakdown" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Basic Salary</h4>
            <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>$4,500.00</p>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Total Allowances</h4>
            <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--success)' }}>+$300.00</p>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Total Deductions</h4>
            <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--danger)' }}>-$550.00</p>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Net Take-Home Pay</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>$4,250.00</p>
          </div>
        </div>
        <Button variant="primary">Download June PDF Payslip</Button>
      </Card>

      <Card title="Payslip History Log">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Payment Month</th>
                <th>Base Salary</th>
                <th>Allowances</th>
                <th>Deductions</th>
                <th>Net Take-Home</th>
                <th>Payslips</th>
              </tr>
            </thead>
            <tbody>
              {payslips.map((row, idx) => (
                <tr key={idx}>
                  <td><strong>{row.month}</strong></td>
                  <td>{row.base}</td>
                  <td>{row.allowances}</td>
                  <td>{row.deductions}</td>
                  <td><strong style={{ color: 'var(--primary)' }}>{row.netPay}</strong></td>
                  <td>
                    <Button variant="outline" size="sm">PDF</Button>
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