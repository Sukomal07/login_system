import { Route, Routes } from 'react-router-dom'
import Signup from './auth/Signup'
import Login from './auth/Login'
import Profile from './user/Profile'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Signup />} />
      <Route path='/login' element={<Login />} />
      <Route path='/profile' element={<Profile />} />
    </Routes>
  )
}

export default App
