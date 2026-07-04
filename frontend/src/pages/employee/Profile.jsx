import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';

export default function EmployeeProfile() {
  const { getActiveEmployee, updateProfile } = useContext(AuthContext);
  
  const emp = getActiveEmployee();
  
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Update input values when active employee context changes
  useEffect(() => {
    if (emp) {
      setPhone(emp.phone || '');
      setAddress(emp.address || '');
    }
  }, [emp]);

  if (!emp) return <div style={{ padding: '2rem' }}>Loading profile...</div>;

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(emp.id, { phone, address });
    setIsEditOpen(false);
    alert('Contact details updated successfully!');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  return (
    <div className="page-wrapper">
      <div className="profile-header" style={{ marginBottom: '2.5rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <div className="profile-avatar-large">
          {getInitials(emp.name)}
        </div>
        <div className="profile-meta-info" style={{ flex: 1 }}>
          <h2 className="profile-name" style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>{emp.name}</h2>
          <span className="profile-role-badge">{emp.jobTitle}</span>
        </div>
        <Button variant="outline" onClick={() => setIsEditOpen(true)}>
          Edit Contact Info
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <Card title="Job & Corporate Summary">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="info-item">
              <span className="info-label">Employee ID</span>
              <span className="info-value" style={{ fontWeight: '600' }}>{emp.id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Division / Department</span>
              <span className="info-value">{emp.department}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Employment Position</span>
              <span className="info-value">{emp.jobTitle}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Direct Supervisor</span>
              <span className="info-value">{emp.supervisor}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Onboarding Join Date</span>
              <span className="info-value">{emp.joinDate}</span>
            </div>
          </div>
        </Card>

        <Card title="Personal & Contact Information">
          <div className="profile-info-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="info-item">
              <span className="info-label">Email Address</span>
              <span className="info-value">{emp.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Mobile Contact</span>
              <span className="info-value">{emp.phone || '--'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Residential Address</span>
              <span className="info-value">{emp.address || '--'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Emergency Contact</span>
              <span className="info-value">Jane Doe (Spouse) - +1 (555) 019-9988</span>
            </div>
          </div>
        </Card>
      </div>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Update Personal Contact Info">
        <form onSubmit={handleSave}>
          <Input 
            label="Phone Number" 
            type="text" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            required 
          />
          <Input 
            label="Residential Address" 
            type="text" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            required 
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Button variant="outline" type="button" onClick={() => setIsEditOpen(false)}>
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