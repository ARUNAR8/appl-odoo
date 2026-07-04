import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';

export default function AdminEmployees() {
  const { database, updateProfile } = useContext(AuthContext);

  const [selectedEmp, setSelectedEmp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [supervisor, setSupervisor] = useState('');

  const handleEditClick = (emp) => {
    setSelectedEmp(emp);
    setName(emp.name);
    setJobTitle(emp.jobTitle);
    setDepartment(emp.department);
    setSupervisor(emp.supervisor);
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (selectedEmp) {
      updateProfile(selectedEmp.id, {
        name,
        jobTitle,
        department,
        supervisor
      });
      setIsModalOpen(false);
      alert('Employee record successfully updated!');
    }
  };

  return (
    <div className="page-wrapper">
      <Card title="Employee Directory Registry">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Job Title</th>
                <th>Supervisor</th>
                <th>Email Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {database.employees.map((emp) => (
                <tr key={emp.id}>
                  <td><code>{emp.id}</code></td>
                  <td><strong>{emp.name}</strong></td>
                  <td>{emp.department}</td>
                  <td>{emp.jobTitle}</td>
                  <td>{emp.supervisor || '--'}</td>
                  <td>{emp.email}</td>
                  <td>
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(emp)}>
                      Edit Record
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Edit Employee: ${selectedEmp?.name}`}>
        <form onSubmit={handleSave}>
          <Input 
            label="Full Name" 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
          <Input 
            label="Job Position Title" 
            type="text" 
            value={jobTitle} 
            onChange={(e) => setJobTitle(e.target.value)} 
            required 
          />
          <Input 
            label="Department" 
            type="text" 
            value={department} 
            onChange={(e) => setDepartment(e.target.value)} 
            required 
          />
          <Input 
            label="Direct Supervisor" 
            type="text" 
            value={supervisor} 
            onChange={(e) => setSupervisor(e.target.value)} 
            required 
          />
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}