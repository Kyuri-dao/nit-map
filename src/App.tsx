import './App.css'
import { BsArrowDown, BsQuestion, BsCamera } from "react-icons/bs"

import Map from './ArUcoReader';

function App() {
  return (
    <div className='flex flex-col justify-center items-center min-h-screen gap-4'>
      <header className='flex w-full bg-gray-500 h-fit text-white p-4 rounded-bl-2xl rounded-br-2xl items-center justify-between opacity-60'>
        <BsArrowDown size={20}/>
        <p>nit-map</p>
        <BsQuestion size={20}/>
      </header>
      <main className='flex-1'>
        <Map />
      </main>
      <footer>
        <div className='p-2 bg-gray-500 m-4 rounded-2xl text-white'>
          <BsCamera size={30}/>
        </div>
      </footer>
    </div>
  )
}

export default App
