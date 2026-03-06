import './App.css'
import ProjectList from './ProjectList'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import UserManager from './utils/userManager'
import Project from './Project'

function App() {

  return (
    <>
      <BrowserRouter>
        <h1><Link to="/">ManageMe</Link></h1>
        <h1 className="pb-4">user: {UserManager.GetUser().name} {UserManager.GetUser().surname}</h1>


        <Routes>
          <Route path="/" element={<ProjectList />} />
          <Route path="/project/:id" element={<Project />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
