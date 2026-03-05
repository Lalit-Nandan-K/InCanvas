import React, { useState } from 'react'
import { Search } from 'lucide-react';
import UserCard from '../components/UserCard';
import Loading from '../components/Loading';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { fetchUser } from '../features/user/userSlice';

const Discover = () => {
  const dispatch = useDispatch();
  const [input, setInput] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = async (searchText = "") => {
    try {
      setLoading(true);
      const { data } = await api.post('/api/user/discover', { input: searchText });
      if (data.success) {
        setUsers(data.users);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      await searchUsers(input);
    }
  };

  const handleFollow = async (id) => {
    try {
      const { data } = await api.post('/api/user/follow', { id });
      if (!data.success) return toast.error(data.message);
      toast.success(data.message);
      await Promise.all([searchUsers(input), dispatch(fetchUser())]);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleConnect = async (id) => {
    try {
      const { data } = await api.post('/api/user/connect', { id });
      if (!data.success) return toast.error(data.message);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  React.useEffect(() => {
    searchUsers();
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white'>
      <div className='max-w-6xl mx-auto p-6'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-slate-900 mb-2'>Discover People</h1>
          <p className='text-slate-600'>Search by username, email, name, or location.</p>
        </div>

        <div className='mb-8 shadow-md rounded-md border border-slate-200/60 bg-white/80'>
          <div className='p-6'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5'/>
              <input
                type='text'
                placeholder='Search people by name, username, bio, or location...'
                className='pl-10 sm:pl-12 py-2 w-full border border-gray-300 rounded-md max-sm:text-sm'
                onChange={(e)=>setInput(e.target.value)}
                value={input}
                onKeyUp={handleSearch}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <Loading height='60vh'/>
        ) : (
          <div className='flex flex-wrap gap-6'>
            {users.map((user)=>(
              <UserCard user={user} key={user._id} onFollow={handleFollow} onConnect={handleConnect} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Discover
