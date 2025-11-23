/* Components */ 
import Header from './components/Header'
import Navbar from './components/Navbar'
/* React Router DOM */
import { Outlet } from 'react-router-dom'

const Layout = () => {

  return (
    <main className='max-w-7xl mx-auto p-4'>
      <Header/>
      <Navbar/>
      <Outlet/>
    </main>
  );
}

export default Layout;
