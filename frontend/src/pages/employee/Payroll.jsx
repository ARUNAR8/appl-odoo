import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function EmployeePayroll() {
  const { database, getActiveEmployee } = useContext(AuthContext);
  
  const emp = getActiveEmployee();
  if (!emp) return <div style={{ padding: '2rem' }}>Loading payroll profile...</div>;

  const empPayslips = database.payroll
    .filter(p => p.empId === emp.id)
    .sort((a, b) => b.month.localeCompare(a.month)); // Show latest payslip first

  const latestPayslip = empPayslips.length > 0 ? empPayslips[0] : null;

  // Use current employee values if no processed payslips yet
  const baseSalary = latestPayslip ? latestPayslip.base : emp.basicSalary;
  const allowances = latestPayslip ? latestPayslip.allowances : emp.allowances;
  const deductions = latestPayslip ? latestPayslip.deductions : emp.deductions;
  const netPay = latestPayslip ? latestPayslip.netPay : (baseSalary + allowances - deductions);

  const handleDownload = (month) => {
    alert(`Downloading payslip for ${month || 'current month'}... (Simulated)`);
  };

  return (
    <div className="page-wrapper">
      <Card title={latestPayslip ? `Salary Statement Summary (${latestPayslip.month})` : "Current Salary Structure Summary"} style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ padding: '0.5rem 0' }}>
            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Basic Base Salary</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${baseSalary.toLocaleString()}</p>
          </div>
          <div style={{ padding: '0.5rem 0' }}>
            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>House / Conveyance Allowance</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success)' }}>+${allowances.toLocaleString()}</p>
          </div>
          <div style={{ padding: '0.5rem 0' }}>
            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Tax / Insurance Deductions</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--danger)' }}>-${deductions.toLocaleString()}</p>
          </div>
          <div style={{ padding: '0.5rem 0' }}>
            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Net Take-Home Pay</h4>
            <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--primary)' }}>${netPay.toLocaleString()}</p>
          </div>
        </div>
        <Button variant="primary" onClick={() => handleDownload(latestPayslip?.month)}>
          {latestPayslip ? `Download PDF Payslip (${latestPayslip.month})` : "Download Current Salary Estimate"}
        </Button>
      </Card>

      <Card title="Historical Payslips Log">
        {empPayslips.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', padding: '1rem' }}>No payroll history found.</p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Base Salary</th>
                  <th>Allowances</th>
                  <th>Deductions</th>
                  <th>Net Pay</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {empPayslips.map((row, idx) => (
                  <tr key={idx}>
                    <td><strong>{row.month}</strong></td>
                    <td>${row.base.toLocaleString()}</td>
                    <td style={{ color: 'var(--success)' }}>+${row.allowances.toLocaleString()}</td>
                    <td style={{ color: 'var(--danger)' }}>-${row.deductions.toLocaleString()}</td>
                    <td><strong style={{ color: 'var(--primary)' }}>${row.netPay.toLocaleString()}</strong></td>
                    <td>
                      <Button variant="outline" size="sm" onClick={() => handleDownload(row.month)}>PDF</Button>
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