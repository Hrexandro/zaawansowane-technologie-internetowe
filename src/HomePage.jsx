import { useState } from 'react'
import './App.css'
import { Link } from 'react-router'

function HomePage() {


  return (

        <div>
          <Link to="/add">Dodaj nowe wydarzenie</Link>
          <br />
          <Link to="/event/1">Zobacz wydarzenie 1</Link>
          <h1>Lista wydarzeń</h1>
        </div>

  )
}

export default HomePage
