import React from "react";
import "./Userinfo.css";
import { useUserStore } from "../lib/userStore";
import { auth } from "../lib/firebase";

const Userinfo = () => {

    const {currentUser} = useUserStore();

    return (
        <div className="userinfo">
            <div className="user">
                <img src={currentUser.avatar || avatar.png} alt="" />
                <h3>{currentUser.username}</h3>
            </div>
            <div className="icons">
                <p onClick={()=>auth.signOut()}>Logout</p>
                <img src="./more.png" alt="" />
                <img src="./video.png" alt="" />
                <img src="./edit.png" alt="" />
            </div>
        </div>
    );
};

export default Userinfo;