import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ImageIcon, SendHorizonal } from 'lucide-react'
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { assets } from '../assets/assets';

const ChatBox = () => {
  const { userId } = useParams();
  const currentUser = useSelector((state) => state.user.value);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);

  const fetchUser = async () => {
    try {
      const { data } = await api.post('/api/user/profiles', { profileId: userId });
      if (data.success) setUser(data.profile);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data } = await api.post('/api/message/get', { to_user_id: userId });
      if (data.success) {
        setMessages(data.messages);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const sendMessage = async() => {
    if (!text && !image) return;
    try {
      const formData = new FormData();
      formData.append("to_user_id", userId);
      formData.append("text", text);
      if (image) formData.append("image", image);

      const { data } = await api.post('/api/message/send', formData);
      if (data.success) {
        setText("");
        setImage(null);
        await fetchMessages();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    fetchUser();
    fetchMessages();
    const id = setInterval(fetchMessages, 5000);
    return () => clearInterval(id);
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior:"smooth"})
  }, [messages])

  const sortedMessages = useMemo(
    () => [...messages].sort((a,b)=>new Date(a.createdAt) - new Date(b.createdAt)),
    [messages],
  );

  return user && (
    <div className='flex flex-col h-screen'>
      <div className='flex items-center gap-2 p-2 md:px-10 xl:pl-42 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-300'>
        <img src={user.profile_picture || assets.sample_profile} alt='' className='size-8 rounded-full' />
        <div>
          <p className='font-medium'>
            {user.full_name}
          </p>
          <p className='txt-sm text-gray-500 -mt-1'>
            @{user.username}
          </p>
        </div>
      </div>
      <div className='p-5 md:px-10 h-full overflow-y-scroll'>
      <div className='space-y-4 max-w-4xl mx-auto'>
        {sortedMessages.map((message) => (
          <div key={message._id} className={`flex flex-col ${message.from_user_id === currentUser._id ? 'items-end' : 'items-start'}`}>
            <div className={`p-2 text-sm max-w-sm bg-white text-slate-700 rounded-lg shadow ${message.from_user_id === currentUser._id ? 'rounded-br-none' : 'rounded-bl-none'}`}>
              {message.message_type === 'image' && <img src={message.media_url} className='w-full max-w-sm rounded-lg mb-1'/> }
              <p>{message.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}/>

      </div>
      </div>
      <div className='px-4'>
<div className='flex items-center gap-3 pl-5 p-1.5 bg-white w-full max-w-xl mx-auto border border-gray-200 shadow rounded-full mb-5'>
<input type='text' className='flex-1 outline-none text-slate-700' placeholder='Type a message...' onKeyDown={(e)=>e.key=== 'Enter' && sendMessage()} onChange={(e)=>setText(e.target.value)} value={text}/>
<label htmlFor="image">
  {
    image ? <img src={URL.createObjectURL(image)} alt='' className='h-8 rounded'/> : <ImageIcon className='size-7 text-gray-400 cursor-pointer'/>
  }
  <input type="file" id='image' accept='image/*' hidden onChange={(e)=>setImage(e.target.files[0])} />
</label>
<button onClick={sendMessage} className=" bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 transition text-white rounded-full cursor-pointer p-1">
  <SendHorizonal size={24}/>
</button>
</div>
      </div>
    </div>
  )
}

export default ChatBox
