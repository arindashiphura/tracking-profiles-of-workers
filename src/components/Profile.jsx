import React from 'react';
import profileImg from '../assets/images/card2.png';

const Profile = () => {
  // Example data
  const person = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8901',
    nextOfKin1: 'Jane Doe',
    nextOfKin2: 'Richard Roe',
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: 32, textAlign: 'center' }}>
      <img src={profileImg} alt="Profile" style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', marginBottom: 24, border: '4px solid #003399' }} />
      <h2 style={{ margin: '8px 0', color: '#003399' }}>{person.firstName} {person.lastName}</h2>
      <div style={{ color: '#555', marginBottom: 8 }}>{person.email}</div>
      <div style={{ color: '#555', marginBottom: 16 }}>{person.phone}</div>
      <div style={{ textAlign: 'left', marginTop: 16 }}>
        <div style={{ color: '#003399', fontWeight: 'bold', marginBottom: 4 }}>Next of Kin / Interest 1:</div>
        <div style={{ marginBottom: 12 }}>{person.nextOfKin1}</div>
        <div style={{ color: '#003399', fontWeight: 'bold', marginBottom: 4 }}>Next of Kin / Interest 2:</div>
        <div>{person.nextOfKin2}</div>
      </div>
    </div>
  );
};

export default Profile; 