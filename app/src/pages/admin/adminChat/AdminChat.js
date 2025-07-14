import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminChat.css';

const AdminChat = () => {
  const [rooms, setRooms] = useState([]);
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingTitle, setEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const fetchRooms = async () => {
    const res = await axios.get('http://localhost:3000/api/adminchat/rooms');
    setRooms(res.data);
  };

  const fetchRoom = async (id) => {
    const res = await axios.get(`http://localhost:3000/api/adminchat/rooms/${id}`);
    setCurrentRoom(res.data);
    setCurrentRoomId(id);
  };

  const sendQuestion = async () => {
    if (!question.trim()) return;
    setLoading(true);

    try {
      let roomId = currentRoomId;
      if (!roomId) {
        const createRes = await axios.post('http://localhost:3000/api/adminchat/rooms');
        roomId = createRes.data._id;
        setCurrentRoomId(roomId);
        await fetchRooms();
      }

      await axios.post('http://localhost:3000/api/adminchat/message', {
        roomId,
        question,
      });

      await fetchRoom(roomId);
      setQuestion('');
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const deleteRoom = async (id) => {
    await axios.delete(`http://localhost:3000/api/adminchat/rooms/${id}`);
    if (id === currentRoomId) {
      setCurrentRoom(null);
      setCurrentRoomId(null);
    }
    await fetchRooms();
  };

  const selectRoom = async (id) => {
    await fetchRoom(id);
    setCurrentRoomId(id);
  };

  const createNewRoom = async () => {
    const createRes = await axios.post('http://localhost:3000/api/adminchat/rooms');
    const roomId = createRes.data._id;
    await fetchRooms();
    await fetchRoom(roomId);
    setQuestion('');
  };

  useEffect(() => {
    fetchRooms();
    }, []);

    const updateRoomTitle = async () => {
    if (!newTitle.trim() || !currentRoomId) return;

    try {
        await axios.put(`http://localhost:3000/api/adminchat/rooms/${currentRoomId}`, {
        title: newTitle,
        });
        await fetchRooms();
        await fetchRoom(currentRoomId);
        setEditingTitle(false);
    } catch (err) {
        console.error('Error updating title:', err);
    }
  };

  return (
    <div className="admin-chat-container">
        <div className={`admin-sidebar ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="admin-sidebar-header">
            <h3>Chat Rooms</h3>
            <button onClick={createNewRoom}>+ New Room</button>
        </div>
        <ul className="admin-room-list">
            {rooms.map((r) => (
            <li key={r._id} className="admin-room-item">
                <button
                  className={r._id === currentRoomId ? 'active-room' : ''}
                  onClick={() => selectRoom(r._id)}
                >
                  {r.title}
                </button>
                <button onClick={() => deleteRoom(r._id)} className="delete-button">🗑</button>
            </li>
            ))}
        </ul>
        </div>

        <div className="admin-chat-main">
        <div className="admin-chat-header">
            {editingTitle ? (
                <>
                <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => {
                    if (e.key === 'Enter') updateRoomTitle();
                    }}
                    onBlur={updateRoomTitle}
                    autoFocus
                    className="edit-title-input"
                />
                </>
            ) : (
                <>
                <span>{currentRoom ? currentRoom.title : 'Admin Chat'}</span>
                {currentRoom && (
                    <button
                    className="edit-button"
                    onClick={() => {
                        setNewTitle(currentRoom.title);
                        setEditingTitle(true);
                    }}
                    >
                    ✏️
                    </button>
                )}
                </>
            )}
            <span className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>&#9776;</span>
            </div>

        <div className="admin-chat-messages">
            {currentRoom ? (
            currentRoom.messages.map((m, idx) => (
                <React.Fragment key={idx}>
                <div className="admin-message me">
                    <div className="admin-message-content">
                    <span>{m.question}</span>
                    </div>
                </div>
                <div className="admin-message ai">
                    <div className="admin-message-content">
                    <span>{m.answer}</span>
                    </div>
                </div>
                </React.Fragment>
            ))
            ) : (
            <div className="admin-placeholder">
                Start chatting by sending a message below 👇
            </div>
            )}
        </div>

        <div className="admin-chat-input">
            <input
            placeholder="Type your message..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            />
            <button onClick={sendQuestion} disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
            </button>
        </div>
        </div>
    </div>
    );
};

export default AdminChat;
