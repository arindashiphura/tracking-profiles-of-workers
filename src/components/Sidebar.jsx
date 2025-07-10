import React from 'react';
import { FaHome, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div style={{ width: '240px', height: '100vh', background: '#003399', display: 'flex', flexDirection: 'column', padding: 0 }}>
      {/* Header */}
      <div style={{ background: '#FFA500', padding: '32px 0 16px 0', textAlign: 'center' }}>
        {/* Placeholder for logo */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ width: 48, height: 48, background: '#fff', borderRadius: '50%', margin: '0 auto' }}></div>
        </div>
        <div style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, letterSpacing: 1 }}>CEDARWOOD</div>
        <div style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 }}>INSTITUTE</div>
      </div>
      {/* Menu */}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1 }}>
        <li style={{ display: 'flex', alignItems: 'center', color: '#fff', padding: '20px 24px', borderBottom: '1px solid #002366', cursor: 'pointer' }}>
          <FaHome style={{ color: '#FFA500', marginRight: 16, fontSize: 22 }} />
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Add Profile</Link>
        </li>
        <li style={{ display: 'flex', alignItems: 'center', color: '#fff', padding: '20px 24px', borderBottom: '1px solid #002366', cursor: 'pointer' }}>
          <FaUserCircle style={{ color: '#FFA500', marginRight: 16, fontSize: 22 }} />
          <Link to="/profiles" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>All Profiles</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar; 