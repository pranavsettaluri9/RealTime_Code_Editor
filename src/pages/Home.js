import React, {useState} from "react"
import {v4 as uuidv4} from 'uuid';
import toast from 'react-hot-toast';
import {useNavigate} from 'react-router-dom';
const Home = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState('');
    const [username, setUserName] = useState('');
    const createNewRoom = (e) => {
        e.preventDefault();     // To avoid page refresh
        const id = uuidv4();
        setRoomId(id);
        toast.success('Created a new room')

    };

    const joinRoom = () => {
        if(!roomId || !username) {
            toast.error('Room Id & Username are required');
            return;
        }
        // Redirect
        navigate(`/editor/${roomId}`, {   // $ is used for accessing variable
            state: {
                username
            },
        });
    };

    const handleInputEnter = (e) => {
        if(e.code == "Enter") {  // e.code tells which key is pressed
            joinRoom();
        }
    }
    return <div className="homePageWrapper"> 
        <div className="formWrapper"> 
            <img className = "homePageLogo" src= "/Payal_Kate.png" alt = "code-sync-logo" />
            <h4 className="mainLabel">Paste Invitation Room Id</h4> 
            <div className="inputGroup">
                <input 
                    type = "text" 
                    className="inputBox" 
                    placeholder="Room ID"
                    onChange= {(e) =>setRoomId(e.target.value)}    /* Used for manual Id (binding roomid) */
                    value = {roomId}
                    onKeyUp = {handleInputEnter}
                />
                <input 
                type = "text"               
                className="inputBox" 
                placeholder="Username"
                onChange= {(e) =>setUserName(e.target.value)} 
                value = {username}  
                onKeyUp = {handleInputEnter}
                />          
                <button className="btn joinBtn" onClick = {joinRoom}> Join </button>
                <span className="createInfo"> If you don't have an invite create &nbsp;
                    <a onClick={createNewRoom} href="" className="createNewBtn">new room</a>
                </span>
            </div>
        </div>
        <footer> 
            <h4>Build with love by     &nbsp;      <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Click Me</a> </h4>
        </footer>
    </div>
}
export default Home;