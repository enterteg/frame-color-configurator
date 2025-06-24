'use client';

import React from 'react';

export default function LoadingFallback() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      width: '100%',
      minHeight: 200,
      minWidth: 200,
    }}>
      <div style={{
        width: 48,
        height: 48,
        border: '6px solid #e0e7ef',
        borderTop: '6px solid #3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: 16,
      }} />
      <span style={{ color: '#3b82f6', fontWeight: 500, fontSize: 18 }}>Loading...</span>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 