import React, { useState, useEffect, useRef } from 'react';
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
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);


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

  const formatTimestamp = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

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
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={msg.sender._id === currentUser._id ? 'message own' : 'message'}
                  >
                    <span>{msg.text}</span>
                    <div className="timestamp">
                      {formatTimestamp(msg.createdAt)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="chat-placeholder">Send something to start the conversation</div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input">
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Type a message..."
                rows={2}
              />
              <button className="send-button" onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : ( null )}
      </div>
    </div>
  );
};

export default Chat;
