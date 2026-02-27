import { useState } from 'react'
import './App.css'
import ProjectList from './ProjectList'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import CreateProject from './CreateProject'

function App() {

  return (
    <>
      <BrowserRouter>
        <h1><Link to="/">ManageMe</Link></h1>

        {/* <nav>
          <Link to="/projects">Project List</Link>
        </nav> */}

        <Routes>
          <Route path="/" element={<ProjectList />} />
          <Route path="/projects/new" element={<CreateProject />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
