import React, { useEffect } from "react";
import "./detail.css";
import { auth, db } from "../lib/firebase";
import { useChatStore } from "../lib/chatStore";
import { useUserStore } from "../lib/userStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

const Detail = () => {
    const {chatId, user, isCurrentUserBlocked, isRecieverBlocked, changeBlock, changeChat} = useChatStore();
    const {currentUser} = useUserStore();

    // console.log(user);
    console.log(isCurrentUserBlocked);
    console.log(isRecieverBlocked);

    const handleBlock = async () => {
        if(!user) return;

        try {

            const userDocRef = doc(db, "users", currentUser.id);

            await updateDoc(userDocRef, {
                blocked: isRecieverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
            });
            changeBlock();
            
        } catch (error) {
            console.log(error);
            
        }
    }

    return (
        <div className="detail">
            <div className="user">
                <img src={user?.avatar || "./avatar.png"} alt="" />
                <h2>{user?.username}</h2>
                <p>DEsc</p>
            </div>
            <div className="info">
                <div className="option">
                    <div className="title">
                        <span>Chat Settings</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Privacy and Help</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Photos</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                    <div className="photos">
                        <div className="photo">
                            <div className="detail">
                                <img src="./avatar.png" alt="" />
                                <span>avatar2.png</span>
                            </div>

                            <img src="./download.png" alt="" />
                        </div>
                        <div className="photo">
                            <div className="detail">
                                <img src="./avatar.png" alt="" />
                                <span>avatar2.png</span>
                            </div>

                            <img src="./download.png" alt="" />
                        </div>
                        <div className="photo">
                            <div className="detail">
                                <img src="./avatar.png" alt="" />
                                <span>avatar2.png</span>
                            </div>

                            <img src="./download.png" alt="" />
                        </div>
                        <div className="photo">
                            <div className="detail">
                                <img src="./avatar.png" alt="" />
                                <span>avatar2.png</span>
                            </div>

                            <img src="./download.png" alt="" />
                        </div>
                        <div className="photo">
                            <div className="detail">
                                <img src="./avatar.png" alt="" />
                                <span>avatar2.png</span>
                            </div>

                            <img src="./download.png" alt="" />
                        </div>
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Files</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <button onClick={handleBlock}>
                    {isCurrentUserBlocked ? "You are Blocked" : isRecieverBlocked ? "Unblock" : "Block"}
                </button>
                <button className="logout" onClick={()=> auth.signOut()}>Logout</button>
            </div>
        </div>
    );
};

export default Detail;