import { useContext, useEffect } from 'react';
import AuthForm from './Components/Auth/AuthForm';
import { AuthContext } from './Contexts/AuthContext';
import ChatHome from './Components/Chat/index';
import { ConversationContxtProvider } from './Contexts/ConversationContext';

function App() {
  const { user } = useContext(AuthContext);
  return (
    <div className="App">
      {!user ? <AuthForm /> : (
        <ConversationContxtProvider>
          <ChatHome />
        </ConversationContxtProvider>
      )}
    </div>
  );
}

export default App;
