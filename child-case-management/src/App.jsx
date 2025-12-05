import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" /> 
        
        <h1 style={{ color: '#61dafb', fontSize: '3rem', marginBottom: '20px' }}>
           Child Case Management System
        </h1>
        
        <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
          Welcome to the Child Protection Case Management System
        </p>
        
        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
          <button 
            style={{
              padding: '12px 24px',
              backgroundColor: '#61dafb',
              color: '#282c34',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600'
            }}
            onClick={() => alert('Login feature will be implemented')}
          >
            Login to System
          </button>
          
          <button 
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: '#61dafb',
              border: '2px solid #61dafb',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600'
            }}
            onClick={() => alert('Dashboard feature will be implemented')}
          >
            View Dashboard
          </button>
        </div>
        
        <div style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '500px'
        }}>
          <p style={{ marginBottom: '10px' }}>
            ✅ React Application is running successfully!
          </p>
          <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
           
          </p>
        </div>
      </header>
    </div>
  );
}

export default App;