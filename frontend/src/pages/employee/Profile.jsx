import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';

export default function EmployeeProfile() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [phone, setPhone] = useState('+1 (555) 019-2834');
  const [address, setAddress] = useState('123 Cyberpunk Drive, Neo City');

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditOpen(false);
    alert('Profile updated successfully!');
  };

  return (
    <div className="page-wrapper">
      <div className="profile-header">
        <div className="profile-avatar-large">JD</div>
        <div className="profile-meta-info">
          <h2 className="profile-name">John Doe</h2>
          <span className="profile-role-badge">Lead Developer</span>
        </div>
        <Button variant="outline" onClick={() => setIsEditOpen(true)}>
          Edit Info
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', flexWrap: 'wrap' }}>
        <Card title="Job Profile Summary">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="info-item">
              <span className="info-label">Employee ID</span>
              <span className="info-value">EMP-2026-089</span>
            </div>
            <div className="info-item">
              <span className="info-label">Department</span>
              <span className="info-value">Engineering</span>
            </div>
            <div className="info-item">
              <span className="info-label">Join Date</span>
              <span className="info-value">January 15, 2023</span>
            </div>
            <div className="info-item">
              <span className="info-label">Supervisor</span>
              <span className="info-value">Sarah Connor (CTO)</span>
            </div>
          </div>
        </Card>

        <Card title="Personal Information">
          <div className="profile-info-grid">
            <div className="info-item">
              <span className="info-label">Email Address</span>
              <span className="info-value">john.doe@company.com</span>
            </div>
            <div className="info-item">
              <span className="info-label">Phone Number</span>
              <span className="info-value">{phone}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Permanent Address</span>
              <span className="info-value">{address}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Emergency Contact</span>
              <span className="info-value">Jane Doe (Spouse) - +1 (555) 019-9988</span>
            </div>
          </div>
        </Card>
      </div>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Update Personal Info">
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