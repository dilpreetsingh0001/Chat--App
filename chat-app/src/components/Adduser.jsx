import React, { useState } from "react";
import "./adduser.css";
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { toast } from "react-toastify";
import { useUserStore } from '../lib/userStore';

const Adduser = () => {

    const [user, setUser] = useState(null);
    const {currentUser} = useUserStore();

    const handleSearch = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get("username");

        try {
            const userRef = collection(db, "users");

            // Create a query against the collection.
            const q = query(userRef, where("username", "==", username));
            const querySnapshot = await getDocs(q);

            if(querySnapshot.empty){
                toast.error("No user found");
                // console.log("No user found");
                return;
            }
            else{
                setUser(querySnapshot.docs[0].data());
            }
            
        } catch (error) {
            
        }
    };

    const handleAdd = async () => {
        const chatRef = collection(db, "chats");
        const userChatsRef = collection(db, "userchats");
        try {
            const currentChatsRef = await getDoc(doc(userChatsRef,currentUser.id))
            // console.log(currentChatsRef.data())
            const currentChats = currentChatsRef.data();
            for(const item of currentChats.chats){
                if(item.recieverId == user.id){
                    toast.error("User already added");
                    return;
                }
            }
            const newChatRef = doc(chatRef);

            await setDoc(newChatRef, {
                createdAt: serverTimestamp(),
                messages: [],
            });

            await updateDoc(doc(userChatsRef, user.id), {
                chats:arrayUnion({
                    chatId:newChatRef.id,
                    lastMessage:"",
                    recieverId:currentUser.id,
                    updatedAt:Date.now()
                }),
            });

            await updateDoc(doc(userChatsRef, currentUser.id), {
                chats:arrayUnion({
                    chatId:newChatRef.id,
                    lastMessage:"",
                    recieverId:user.id,
                    updatesAt:Date.now()
                }),
            });

            // console.log(newChatRef.id);
            
        } catch (error) {
            toast.error(error.message);
            
        }
    };

    return(
        <div className="adduser">
            <form onSubmit={handleSearch}>
                <input type="text" placeholder="Username" name="username"/>
                <button type="submit">Search</button>

            </form>
            {user && <div className="user-result">
                <div className="detail">
                    <img src={user.avatar} alt="" />
                    <span>{user.username}</span>
                </div>
                <button onClick={handleAdd}>Add User</button>
            </div>}
        </div>
    );
};

export default Adduser;