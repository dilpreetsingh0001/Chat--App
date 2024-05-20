import { doc, getDoc } from 'firebase/firestore';
import { create } from 'zustand';
import { db } from './firebase';
import { toast } from 'react-toastify';
import { useUserStore } from './userStore';

export const useChatStore = create((set) => ({
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isRecieverBlocked: false,
  changeChat: (chatId,user) => {
    const currentUser = useUserStore.getState().currentUser;

    if(user?.blocked.includes(currentUser?.id)){
      console.log(1)
      return set({
        chatId: chatId,
        user: null,
        isCurrentUserBlocked: true,
        isRecieverBlocked: false,
      })
    }

    else if(currentUser?.blocked.includes(user?.id)){
      console.log(2);
        return set({
          chatId: chatId,
          user: user,
          isCurrentUserBlocked: false,
          isRecieverBlocked: true,
        })
      }
    
    else{
        return set({
            chatId: chatId,
            user: user,
            isCurrentUserBlocked: false,
            isRecieverBlocked: false,
        })
    }
  },

  changeBlock:()=>{
    set(state=>({...state,isRecieverBlocked:!state.isRecieverBlocked}))
  }
}));