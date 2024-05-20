import React, { useEffect } from 'react';
import List from './components/List';
import Chat from './components/Chat';
import Detail from './components/Detail';
import Login from './components/login';
import Notification from './components/Notification';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useUserStore } from './lib/userStore';
import { useChatStore } from './lib/chatStore';
import { toast } from 'react-toastify';

const App = () => {

  const {currentUser,isLoading, fetchUserInfo} = useUserStore();
  const {chatId} = useChatStore();

  // const user = false;

  useEffect(() => {
    const unSub = onAuthStateChanged(auth,(user) => {
      if(user?.emailVerified==false){
        auth.signOut();
        return;
      }
      if(!user) return fetchUserInfo(null);
      fetchUserInfo(user.uid);
    }
    )
    return () => {
     unSub();
    }
  },[fetchUserInfo])

  if(isLoading) return <div className='loading'>Loading...</div>

  return (
    <div className='container'>
      {
        currentUser ? (
          <>
            <List />
            {chatId && <Chat />}
            {chatId && <Detail />}
          </>
        ) : (
          <>
            {!currentUser && <Login />}
          </>
        )
      }
      <Notification />
    </div>
  )
}

export default App