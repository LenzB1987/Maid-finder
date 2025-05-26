import React, { useEffect } from 'react';
import Routes from './routes';
import { useAuthStore } from './store/auth';

function App() {
  const { loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return <Routes />;
}

export default App;