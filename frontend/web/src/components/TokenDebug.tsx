import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const TokenDebug: React.FC = () => {
  const { user } = useAuth();

  const checkToken = () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    console.log('=== TOKEN DEBUG ===');
    console.log('Token in localStorage:', token);
    console.log('User in localStorage:', storedUser);
    console.log('User in context:', user);
    console.log('==================');
    
    // Test API call
    fetch('http://127.0.0.1:3002/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => console.log('API test result:', data))
    .catch(err => console.error('API test error:', err));
  };

  return (
    <div className="fixed bottom-4 right-4 bg-red-500 text-white p-2 rounded">
      <button onClick={checkToken}>Debug Token</button>
    </div>
  );
};

export default TokenDebug;