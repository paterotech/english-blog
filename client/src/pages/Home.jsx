import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import BlogList from '../components/BlogList'
import Footer from '../components/Footer'
import usePageMeta from '../hooks/usePageMeta'

const Home = () => {
  usePageMeta({
    title: 'Home',
    description:
      'This blog consolidates all the evidence produced throughout the English course: videos, audio recordings, and oral and written texts.',
  })

  return (
    <>
      <Navbar />
      <Header />
      <BlogList />
      <Footer />
    </>
  )
}

export default Home
