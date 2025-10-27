import React, { useState } from 'react'
import './Home.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import Feed from '../../Components/feed/Feed'

const Home = ({sidebar, searchQuery, setSearchQuery}) => {

  const [category,setCategory] = useState(0)

  return (
    <>
      <Sidebar sidebar={sidebar} category={category} setCategory={setCategory}/>
      <div className={`container ${sidebar?"":'large-container'}`}>
        <Feed category={category} searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
      </div>
    </>
  )
}

export default Home
