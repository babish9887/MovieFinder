import React from 'react';

const errorStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '94vh',
  fontSize: '24px',
  fontWeight: 'bold',
  color: 'white',
};

function Error() {
  return (
    <div style={errorStyles}>
      404 | Page Not Found
    </div>
  );
}

export default Error;
