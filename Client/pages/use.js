import Link from 'next/link'
import { useEffect, useState } from 'react';

import { io } from "socket.io-client";

import {faThumbsUp, faThumbsDown} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
// * For creating connection with the server socket
function useSocket(url) {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const socketIo = io(url, { reconnection: true })

    setSocket(socketIo)

    function cleanup() {
      socketIo.disconnect()
    }
    return cleanup

    // should only run once and not on every re-render,
    // so pass an empty array
  }, [])

  return socket
}

const Home = ({getChats, reqErr}) => {
    const socket = useSocket();
    const [chats, setChats] = useState([]);

    useEffect(() => {
      setChats([
        {'id': 123, 'userId': 234}, 
        {'id': 123, 'userId': 234}
  
      ])
        if (getChats) {
        setChats(getChats);
        }
    }, []);


    // * Handle Error
    if (chats === undefined || reqErr) {
      useEffect(() => {
        setChats([
          {'id': 123, 'userId': 234}, 
          {'id': 123, 'userId': 234}
    
        ])
      }, [])
      // return (
      //   <div className="handle-error">
      //       <center>
      //       <h1 style={{color: 'red', margin: '20rem auto'}}> Can't Load page <br /> Error {reqErr.message}</h1>
      //       </center>
      //   </div>
      //   );
    }


    // * If event is updated then listen for event data using socket
    // useEffect(() => {
    //     if (socket) {
    //     // * use below commented code for testing socket connection
    //     // socket.on('conn', data => {
    //     //   console.log(data);
    //     // })
    //     socket.on('chats', data => {
    //         setChats(data);
    //     })
    //     }
    // }, [socket]);

    const chatCard = chats.map(chat => {
        <div className="col-sm chats" key={chat.id}>
            <span className='user-chat'>{chat.userId}</span>
            <button><FontAwesomeIcon icon={faThumbsUp}/></button>
            <button><FontAwesomeIcon icon={faThumbsDown}/></button>
        </div>
    })

     // * Checking if there is some event exist
  var IsValid = true;
  const lenChat = chatCard.length;
  var c = 0;
  for (let index = 0; index < lenChat; index++) {
    if (chatCard[index] === undefined) {
      c++;
    }
  }

  if (c === lenChat) {
    IsValid = false;
  }
    return <div>
      <center>
        <div className="welcome-home">
          <span className="welcome-text">Welcome to ASKGPT</span>
          <span className="createdby">Made by <strong>Ishan Joshi</strong> - {new Date().getFullYear()}</span>
        </div>
      </center>
      {/* {console.log(chats)} */}
      <div class="card" style={{width: "5rem"}}>
        {/* <img class="card-img-top" src="..." alt="Card image cap"> */}
        <center>
        <div class="card-body">
        <p class="card-text">Giva me a template for write a professional email to my boss.</p>
        </div>
        </center>
      </div>
      <div class="card" style={{width: "5rem"}}>
        {/* <img class="card-img-top" src="..." alt="Card image cap"> */}
        <center>
        <div class="card-body">
        <p class="card-text">Suggest me some innovative idea to organise a birthday party for 10 year old.</p>
        </div>
        </center>
      </div>
      <div class="card" style={{width: "5rem"}}>
        {/* <img class="card-img-top" src="..." alt="Card image cap"> */}
        <center>
        <div class="card-body">
        <p class="card-text">Tell me a joke.</p>
        </div>
        </center>
      </div>
      <div className="container search-bar">
        <input 
        className="form-control search-input" 
        type="search" 
        // onChange={Typed} 
        placeholder="Search Event Title"
        // onChange={Typed}
        autoFocus
        />
        </div>
        <div className="container content">
          <div className="row">
                { chats.length > 0 && chatCard }
          </div>
        { 
          (chats.length <= 0 || !IsValid) && <div className="container no-event" ><br/><center>No Chats Available. Try to Create One</center> <br/> <Link href="/chats/new"><a className="btn btn-success">Create Chat</a></Link> </div> 
        }
        </div>
    </div>
}

Home.getInitialProps = async (context, client, currentUser) => {

    try {
      const { data } = await client.get('/api/chats');
  
      return { getChats: data };
      
    } catch (error) {
  
      console.log(error.message);
      return { reqErr: error.message };
    }
    
  };
  
  export default Home; 