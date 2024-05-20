import React from "react";
import "./login.css";
import { useState } from "react";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword,sendEmailVerification,signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db, googleProvider } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import upload from "../lib/upload";

const Login = () => {

    const [avatar, setAvatar] = useState({file: null,url: ""});
    const [loading, setLoading] = useState(false);

    const handleAvatar = (e) => {
        if(e.target.files[0]){
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        const formdata = new FormData(e.target);

        const {email, password} = Object.fromEntries(formdata);
        setLoading(true);

        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            if(response.user.emailVerified==false){
                toast.error("Please verify your email first!");
                auth.signOut();
                setLoading(false)
                return;
            }
            toast.success("Logged in successfully!");
            
        } catch (error) {
            toast.error(error.message);
            
        }
        setLoading(false);
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        const formdata = new FormData(e.target);

        const {username, email, password} = Object.fromEntries(formdata);
        setLoading(true);

        try {

            const res = await createUserWithEmailAndPassword(auth, email, password);
            const imageUrl = await upload(avatar.file);
            const response = await sendEmailVerification(res.user);

            await setDoc(doc(db, "users", res.user.uid), {
                username:username,
                email:email,
                avatar:imageUrl,
                id:res.user.uid,
                blocked:[],

            });

            await setDoc(doc(db, "userchats", res.user.uid), {
                chats:[]
            });
            toast.success("User created successfully!");
            toast.info("A verification mail has been sent to you. Please verify your email.")
            
        } catch (error) {
            toast.error(error.message);
            
        }
        setLoading(false);
        auth.signOut();

    }

    const handleGoogleLogin = async () => {
        try {
            const response = await signInWithPopup(auth, googleProvider);
            const userdata  = response.user;
            await setDoc(doc(db, "users", response.user.uid), {
                username:response.user.displayName,
                email:response.user.email,
                avatar: response.user.photoURL,
                id:response.user.uid,
                blocked:[],

            });

            await setDoc(doc(db, "userchats", response.user.uid), {
                chats:[]
            });
            console.log(userdata)
            toast.success("Sign in successful");
        } catch (error) {
            toast.error(error);
        }
    }

    return (
        <div className="login">
            <div className="box">
                <h2>Welcome Back,</h2>
                <form onSubmit={handleLogin}>
                    <input type="text" placeholder="Email" name="email"/>
                    <input type="password" placeholder="Password" name="password"/>
                    <button type="submit">{loading ? "Loading..." : "Login"}</button>
                </form>
                <div className="google-btn" onClick={handleGoogleLogin}>
                    <img src="./unnamed.png" alt="Google logo"/>  
                    Sign in with Google
                </div>
            </div>
            <div className="seperator"></div>
            <div className="box">
                <h2>Create an Account</h2>
                <form onSubmit={handleRegister}>
                    <label htmlFor="file">
                        <img src={avatar.url || "./avatar.png"} alt="" />
                        Upload an Image</label>

                    <input type="file" id="file" style={{display:"none"}} onChange={handleAvatar} required/>
                    <input type="text" placeholder="Username" name="username" required/>
                    <input type="text" placeholder="Email" name="email" required/>
                    <input type="password" placeholder="Password" name="password" required/>
                    <button>{loading ? "Loading..." : "Register"}</button>
                </form>
            </div>
        </div>
    );
};

export default Login;