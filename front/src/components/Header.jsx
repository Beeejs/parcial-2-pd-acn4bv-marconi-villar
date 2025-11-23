import React from 'react'

const Header = () => {
  return (
    <header className='flex justify-start items-center w-full bg-primary/80 p-4 rounded-t-md'>
      <a href="/" className='flex justify-start items-center'>
        <img src="/logo.png" alt="Eternal Game" className='w-[50px] h-[50px] mr-4'/>
        <span className='font-primary text-4xl text-game-flame-oscuro'>Eternal Game</span>
      </a>
    </header>
  )
}

export default Header