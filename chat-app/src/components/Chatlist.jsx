import React, { useEffect } from "react";
import "./Chatlist.css";
import { useState } from "react";
import Adduser from "./Adduser";
import { useUserStore } from "../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useChatStore } from "../lib/chatStore";

const Chatlist = () => {
    const [addChat, setAddChat] = useState(false);

    const [chats,setChats] = useState([]);

    const {currentUser} = useUserStore();
    const {changeChat} = useChatStore();

    useEffect(() => {

        const unsub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
            const items = res.data().chats;
            const promises = items.map(async (item) => {
                const userDocRef = doc(db, "users", item.recieverId);
                const userDococSnap = await getDoc(userDocRef);

                const user = userDococSnap.data();

                return {...item, user};
            });

            const chatData = await Promise.all(promises);

            setChats(chatData.sort((a,b)=> b.updatedAt - a.updatedAt));
        });

        return () => unsub();
    }, [currentUser.id]);
    // console.log(chats);

    const handleSelect = async (chat) => {

        const userChats = chats.map((item) => {
            if(item.chatId === chat.chatId){
                const {user,...rest} = item;
                return rest;
            }
            return item;
        });

        const chatIndex = userChats.findIndex((item) => item.chatId === chat.chatId);

        userChats[chatIndex].isSeen = true;

        const userChatRef = doc(db, "userchats", currentUser.id);

        try {
            await updateDoc(userChatRef, {
                chats: userChats,
            });
            changeChat(chat.chatId,chat.user);
            
        } catch (error) {
            console.error(error);
            
        }

        
    }



    return (
        <div className="chatlist">
            <div className="search">
                <div className="searchbar">
                    <img src="./search.png" alt="" />
                    <input type="text" placeholder="Search"/>
                </div>
                <img src={addChat?"./minus.png":"./plus.png"} alt="" className="add" onClick={() => setAddChat(!addChat)}/>
            </div>
            {chats.map((chat) => (
            <div className="item" key={chat.chatId} onClick={()=>handleSelect(chat)} style={{backgroundColor: chat?.isSeen ? "transparent" : "#C4ECEE"}}>
                <img src={chat.user.avatar} alt="" />
                <div className="text">
                    <span>{chat.user.username}</span>
                    <p>{chat.lastMessage}</p>
                </div>
            </div>
            ))}
            
            
            
            
            {addChat && <Adduser />}
        </div>
    );
};

export default Chatlist;