import React, { useState, useEffect } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import ChatInterface from './components/ChatInterface';
import './styles/App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="App">
      <header className="app-header">
        <h1>🤖 AI Engineering Assistant</h1>
        <p>Document Processing & Technical Q&A</p>
      </header>

      <Authenticator>
        {({ signOut, user }) => (
          <main className="app-main">
            <div className="user-info">
              <span>Welcome, {user?.username || 'Engineer'}!</span>
              <button onClick={signOut} className="sign-out-btn">
                Sign Out
              </button>
            </div>
            <ChatInterface user={user} />
          </main>
        )}
      </Authenticator>
    </div>
  );
}

export default App;