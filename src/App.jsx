import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router'
import HomePage from './HomePage.jsx'
import EventDetailsPage from './EventDetailsPage.jsx'
import AddEventPage from './AddEventPage.jsx'

function App() {

  return (
    

    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/event/:id" element={<EventDetailsPage />} />
      <Route path="/add" element={<AddEventPage />} />
    </Routes>

  )
}

export default App
