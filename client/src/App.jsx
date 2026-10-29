import React from 'react'
import Home from './pages/Home'
import Blogs from './pages/Blogs'
import About from './pages/About'
import { Route, Routes } from 'react-router-dom'
import Blog from './pages/Blog'
import Layout from './pages/admin/Layout'
import Dashboard from './pages/admin/Dashboard'
import AddBlog from './pages/admin/AddBlog'
import ListBlog from './pages/admin/ListBlog'
import AdminComments from './pages/admin/Comments'
import NotFound from './pages/NotFound'
import ScrollToTop from './components/ScrollToTop'
import Login from './components/admin/Login'
import 'quill/dist/quill.snow.css'
import {Toaster} from 'react-hot-toast'
import { useAppContext } from './context/AppContext'


const App = () => {
  
  const {token} = useAppContext();

  return (
    <div>
      <Toaster />
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/blogs' element={<Blogs />} />
        <Route path='/about' element={<About />} />
        <Route path='/blog/:id' element={<Blog />} />
        <Route path='/admin' element={token ? <Layout/> : <Login/>}>
          <Route index element={<Dashboard/>} />
          <Route path='addBlog' element={<AddBlog key="add" />} />
          <Route path='editBlog/:id' element={<AddBlog key="edit" />} />
          <Route path='listBlog' element={<ListBlog />} />
          <Route path='comments' element={<AdminComments />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
