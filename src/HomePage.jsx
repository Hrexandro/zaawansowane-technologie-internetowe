import { useState } from 'react'
import './App.css'

function HomePage() {
  function Button({ text, handleClick }) {
    return <button onClick={handleClick}>{text}</button>;
  }

  const handleBackClick = () => {
    window.location.href = "https://www.google.com";
  };

  const newEventClick = () => {
    window.location.href = "https://www.google.com";
  };

  return (
    <>
        <div>
          <Button text="Cofnij" handleClick={handleBackClick} />
          <Button text="Nowe wydarzenie" handleClick={newEventClick}/>
        </div>
    </>
  )
}

export default HomePage
