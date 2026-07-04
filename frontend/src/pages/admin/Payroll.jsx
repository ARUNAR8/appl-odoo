import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';

export default function AdminPayroll() {
  const { database, updateSalaryStructure, runPayrollCycle } = useContext(AuthContext);

  const [selectedEmp, setSelectedEmp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payrollMonth, setPayrollMonth] = useState('July 2026');

  // Form Fields
  const [basic, setBasic] = useState(0);
  const [allowances, setAllowances] = useState(0);
  const [deductions, setDeductions] = useState(0);

  const handleEditSalary = (emp) => {
    setSelectedEmp(emp);
    setBasic(emp.basicSalary);
    setAllowances(emp.allowances);
    setDeductions(emp.deductions);
    setIsModalOpen(true);
  };

  const handleSaveSalary = (e) => {
    e.preventDefault();
    if (selectedEmp) {
      updateSalaryStructure(selectedEmp.id, basic, allowances, deductions);
      setIsModalOpen(false);
      alert('Salary structure updated successfully!');
    }
  };

  const handleRunPayroll = () => {
    const confirmRun = window.confirm(`Are you sure you want to run the payroll cycle for ${payrollMonth}?`);
    if (confirmRun) {
      runPayrollCycle(payrollMonth);
    }
  };

  // Company payout calculations
  const totalBase = database.employees.reduce((sum, emp) => sum + emp.basicSalary, 0);
  const totalAllowances = database.employees.reduce((sum, emp) => sum + emp.allowances, 0);
  const totalDeductions = database.employees.reduce((sum, emp) => sum + emp.deductions, 0);
  const totalNet = totalBase + totalAllowances - totalDeductions;

  return (
    <div className="page-wrapper">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <Card title="Payroll Processing Cycle Control">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.25rem 0' }}>
            <div className="input-container" style={{ marginBottom: 0 }}>
              <label className="input-label">Cycle Month Selection</label>
              <select 
                className="input-field" 
                value={payrollMonth} 
                onChange={(e) => setPayrollMonth(e.target.value)}
              >
                <option value="July 2026">July 2026</option>
                <option value="August 2026">August 2026</option>
                <option value="September 2026">September 2026</option>
              </select>
            </div>
            
            <Button variant="primary" style={{ width: '100%' }} onClick={handleRunPayroll}>
              Run Payroll Cycle
            </Button>
          </div>
        </Card>

        <Card title="Payroll Budget Overview">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center', height: '100%', alignItems: 'center' }}>
            <div style={{ padding: '0.75rem 0.5rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Total Base</h4>
              <p style={{ fontSize: '1.15rem', fontWeight: 'bold' }}>${totalBase.toLocaleString()}</p>
            </div>
            <div style={{ padding: '0.75rem 0.5rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Net Payout</h4>
              <p style={{ fontSize: '1.15rem', fontWeight: 'bold', color: 'var(--primary)' }}>${totalNet.toLocaleString()}</p>
            </div>
            <div style={{ padding: '0.75rem 0.5rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Deductions</h4>
              <p style={{ fontSize: '1.15rem', fontWeight: 'bold', color: 'var(--danger)' }}>-${totalDeductions.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Employee Compensation Statements Directory">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee Name</th>
                <th>Basic Salary</th>
                <th>Allowances</th>
                <th>Deductions</th>
                <th>Calculated Net Pay</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {database.employees.map((emp) => {
                const calculatedNet = emp.basicSalary + emp.allowances - emp.deductions;
                return (
                  <tr key={emp.id}>
                    <td><code>{emp.id}</code></td>
                    <td><strong>{emp.name}</strong></td>
                    <td>${emp.basicSalary.toLocaleString()}</td>
                    <td style={{ color: 'var(--success)' }}>+${emp.allowances.toLocaleString()}</td>
                    <td style={{ color: 'var(--danger)' }}>-${emp.deductions.toLocaleString()}</td>
                    <td><strong style={{ color: 'var(--primary)' }}>${calculatedNet.toLocaleString()}</strong></td>
                    <td>
                      <Button variant="outline" size="sm" onClick={() => handleEditSalary(emp)}>
                        Adjust Salary
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Adjust Compensation: ${selectedEmp?.name}`}>
        <form onSubmit={handleSaveSalary}>
          <Input 
            label="Basic Base Salary ($)" 
            type="number" 
            value={basic} 
            onChange={(e) => setBasic(e.target.value)} 
            required 
          />
          <Input 
            label="Housing / Conveyance Allowances ($)" 
            type="number" 
            value={allowances} 
            onChange={(e) => setAllowances(e.target.value)} 
            required 
          />
          <Input 
            label="Taxes / Deductions ($)" 
            type="number" 
            value={deductions} 
            onChange={(e) => setDeductions(e.target.value)} 
            required 
          />
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Compensation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}