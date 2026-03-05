import { Route, Routes } from "react-router-dom";
import Messages from "./pages/Messages";
import ChatBox from "./pages/ChatBox";
import Connections from "./pages/Connections";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import Feed from "./pages/Feed";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "./features/user/userSlice";
import Loading from "./components/Loading";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const userLoading = useSelector((state) => state.user.loading);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  if (userLoading) return <Loading />;

  return (
    <>
      <Toaster />
      <Routes>
        {!user ? (
          <Route path="*" element={<Login />} />
        ) : (
          <Route path="/" element={<Layout />}>
            <Route index element={<Feed />} />
            <Route path="messages" element={<Messages />} />
            <Route path="messages/:userId" element={<ChatBox />} />
            <Route path="connections" element={<Connections />} />
            <Route path="discover" element={<Discover />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/:profileId" element={<Profile />} />
            <Route path="create-post" element={<CreatePost />} />
            <Route path="*" element={<Feed />} />
          </Route>
        )}
      </Routes>
    </>
  );
}

export default App;
