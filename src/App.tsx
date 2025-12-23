import './App.css'
import { BsArrowDown, BsQuestion } from "react-icons/bs"

import Map from './ArUcoReader';

function App() {
  return (
    <div className='flex flex-col items-center min-h-screen bg-black'>
      <header className='flex w-full bg-black h-fit text-white p-4 items-center justify-between'>
        <BsArrowDown size={20}/>
        <p className='font-black'>nit-map</p>
        <BsQuestion size={20}/>
      </header>
      <main className='flex'>
        <Map />
      </main>
      {/* <footer className=''>
        <div className='p-2 bg-black m-4 rounded-2xl text-white'>
          <BsCamera size={30}/>
        </div>
      </footer> */}
    </div>
  )
}

export default App
