import React, { useState, useEffect } from 'react';
import './Chat.css';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3000', {
  auth: {
    token: localStorage.getItem('token')
  },
  transports: ['websocket'],
});

const Chat = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);


  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  const token = localStorage.getItem('token');

    useEffect(() => {
    fetchUserByToken();
    }, []);

    const fetchUserByToken = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCurrentUser(res.data);
      } catch (err) {
        console.error('Error fetching current user with token:', err);
        console.log('Token used:', token);
      }
    };

  useEffect(() => {
    if (!currentUser || !currentUser._id) return;

    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/users');
        setUsers(res.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, [currentUser]);

  const selectChat = async (otherUserId) => {
    try {
      const res = await axios.post('http://localhost:3000/api/chats', {
        userId1: currentUser._id,
        userId2: otherUserId,
      });

      const chat = res.data;
      setActiveChat(chat);
      socket.emit('joinChat', { chatId: chat._id });

      const msgRes = await axios.get(`http://localhost:3000/api/messages/${chat._id}`);
      setMessages(msgRes.data);
    } catch (err) {
      console.error('Error loading chat:', err);
    }
  };

  const sendMessage = () => {
    if (!text.trim() || !activeChat) return;

    const payload = {
      chatId: activeChat._id,
      senderId: currentUser._id,
      text,
    };

    socket.emit('sendMessage', payload);
    setMessages(prev => [...prev, {
      ...payload,
      sender: { _id: currentUser._id },
      createdAt: new Date().toISOString(),
    }]);
    setText('');
  };

  useEffect(() => {
    const handleReceiveMessage = (msg) => {
      if (msg.chat === activeChat?._id) {
        setMessages(prev => [...prev, msg]);
      }
    };

    socket.on('receiveMessage', handleReceiveMessage);
    return () => socket.off('receiveMessage', handleReceiveMessage);
  }, [activeChat]);

  if (!currentUser || !currentUser._id) {
    return <div className="chat-placeholder">Loading user...</div>;
  }

  return (
    <div className="chat-container">
      <div className={`chat-sidebar ${sidebarOpen ? '' : 'hidden'}`}>
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {users
          .filter(u =>
            u._id !== currentUser._id &&
            u.username.toLowerCase().startsWith(search.toLowerCase())
          )
          .map(user => (
            <div
              key={user._id}
              className="user-item"
              onClick={() => selectChat(user._id)}
            >
              <span>{user.username} ({user.role})</span>
            </div>
          ))}
      </div>

      <div className="chat-main">
        {activeChat ? (
          <>
            <div className="chat-header">
              <span>
                Chatting with:{' '}
                {
                  users.find(u =>
                    activeChat.participants.some(p => p._id === u._id) && u._id !== currentUser._id
                  )?.username || 'User'
                }
              </span>
              <span className="hamburger" onClick={toggleSidebar}>&#9776;</span>
            </div>

            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={msg.sender._id === currentUser._id ? 'message own' : 'message'}
                >
                  <span>{msg.text}</span>
                  <div className="timestamp">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="chat-input">
              <input
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Type a message..."
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div className="chat-placeholder">
            Send something to start the conversation
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
