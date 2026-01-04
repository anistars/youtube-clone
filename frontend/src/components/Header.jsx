import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header(){
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  return (
    <header style={{display:'flex',justifyContent:'space-between',padding:12,borderBottom:'1px solid #eee'}}>
      <div style={{cursor:'pointer'}} onClick={()=>navigate('/')}>YouClone</div>
      <div>
        {username ? <span>Hi, {username}</span> : <button onClick={()=>navigate('/auth')}>Sign In</button>}
      </div>
    </header>
  );
}
