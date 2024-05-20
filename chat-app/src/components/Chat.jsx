import React, { useRef } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import { useEffect } from "react";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useChatStore } from "../lib/chatStore";
import { useUserStore } from "../lib/userStore";
import upload from "../lib/upload";


const Chat = () => {
    const [openEmoji, setOpenEmoji] = useState(false);
    const [text, settext] = useState("");
    const [chat, setChat] = useState();
    const [img, setImg] = useState({
        file: null,
        url: "",
    });
    const {chatId, user,isCurrentUserBlocked, isRecieverBlocked,changeChat} = useChatStore();
    const {currentUser} = useUserStore();

    const endRef = useRef(null);

    useEffect(() => {
        endRef.current.scrollIntoView({ behavior: "smooth" });
    },[chat]);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "chats",chatId), (res) => {
            setChat(res.data());
        });
 
        return () => {
            unsub();
        }
    }, [chatId]);

    const handleEmoji = (event) => {
        settext(text + event.emoji);
    }

    const handleSend = async () => {
        if(!text){
            return;
        }

        let imageUrl = null;

        
        try {
            
            if(img.file){
                imageUrl = await upload(img.file);
            }
            // console.log(Date.now())
            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                    senderId:currentUser.id,
                    text: text,
                    createAt: new Date(),
                    ...(imageUrl && {img: imageUrl})
                })
            });

            const userIds = [currentUser.id, user.id]

            userIds.forEach(async (id) => {

                const userChatRef = doc(db, "userchats", id);
                const userChatsSnapShot = await getDoc(userChatRef);

                if(userChatsSnapShot.exists()){
                    const userChatsData = userChatsSnapShot.data();

                    const chatIndex = userChatsData.chats.findIndex((chat) => chat.chatId === chatId);

                    userChatsData.chats[chatIndex].lastMessage = text;
                    userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
                    userChatsData.chats[chatIndex].updatedAt = Date.now();

                    await updateDoc(userChatRef, {
                        chats: userChatsData.chats
                    });

                }
            });

            settext("");
            setImg({
                file: null,
                url: ""
            });
            
        } catch (error) {
            console.error(error);
            
        }
    }

    const handleImage = (e) => {
        if(e.target.files[0]){
            setImg({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
        }
    }

    return (
        <div className="chat">
            <div className="top">
                <div className="user">
                    <img src={user?.avatar || "./avatar.png"} alt="" />
                    <div className="text">
                        <span>{user?.username}</span>
                        <p>desc</p>
                    </div>
                </div>
                <div className="icons">
                    <img src="./phone.png" alt="" />
                    <img src="./video.png" alt="" />
                    <img src="./info.png" alt="" />
                </div>
            </div>

            <div className="center">
                {
                    chat?.messages?.map((message) => (

                        <div className={message.senderId === currentUser?.id ? "message own" : "message"} key={message?.messageID} onClick={() => handleMenu(messageId)}>
                            <div className="text">
                                {message.img && <img src={message.img} alt="" />}
                                <p>{message.text}</p>
                                <span>1 min ago</span>
                            </div>
                        </div>
                    ))}

                    { img.url &&
                       <div className="message own">
                            <div className="text">
                                <img src={img.url} alt="" />
                            </div>
                        </div> 
                    }
                <div ref={endRef}></div>
            </div>

            <div className="bottom">
                <div className="icons">
                    <label htmlFor="file">
                        <img src="./img.png" alt="" />

                    </label>
                    <input type="file" id="file" style={{display:"none"}} onChange={handleImage}/>
                    <img src="./camera.png" alt="" />
                    <img src="./mic.png" alt="" />
                </div>
                <input type="text" placeholder={(isCurrentUserBlocked || isRecieverBlocked) ? "You Cannot Send a Message" : "Type a text..."} onChange={e=>settext(e.target.value)} value={text} disabled={isCurrentUserBlocked || isRecieverBlocked}/>
                <div className="emoji">
                    <img src="./emoji.png" alt="" onClick={() => {setOpenEmoji(!openEmoji)}}/>
                    <div className="emoji-picker">
                        <EmojiPicker open={openEmoji} onEmojiClick={handleEmoji}/>
                    </div>
                </div>
                <button className="send-button" onClick={handleSend} disabled={isCurrentUserBlocked || isRecieverBlocked}>Send</button>
            </div>
        </div>
    );
};

export default Chat;