import React, { useState } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import ChatInterface from './components/ChatInterface';
import KnowledgeContribution from './components/KnowledgeContribution';
import './styles/App.css';

function App() {
  const [currentView, setCurrentView] = useState('chat');

  const renderCurrentView = (user) => {
    switch(currentView) {
      case 'chat':
        return <ChatInterface user={user} />;
      case 'contribute':
        return <KnowledgeContribution />;
      default:
        return <ChatInterface user={user} />;
    }
  };

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
              <div className="nav-buttons">
                <button 
                  className={`nav-btn ${currentView === 'chat' ? 'active' : ''}`}
                  onClick={() => setCurrentView('chat')}
                >
                  💬 Chat
                </button>
                <button 
                  className={`nav-btn ${currentView === 'contribute' ? 'active' : ''}`}
                  onClick={() => setCurrentView('contribute')}
                >
                  🧠 Contribute
                </button>
                <button onClick={signOut} className="sign-out-btn">
                  Sign Out
                </button>
              </div>
            </div>
            
            {renderCurrentView(user)}
          </main>
        )}
      </Authenticator>
    </div>
  );
}

export default App;