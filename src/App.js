
import { Route,Routes } from 'react-router-dom';
import Login from './components/login';
import Home from './components/Home';
import Signup from './components/signup';
import {Toaster} from 'react-hot-toast';
import Error from './Error.js'
import Forgotpassword from './components/forgotpassword';


function App() {
  return (
    <>
    <Routes>
      <Route path='/login' element={<Login />}/>
      <Route path='/' element={<Home />}/>
      <Route path='/signup' element={<Signup />}/>
      <Route path='*' element={<Error />}/>

      <Route path='/forgotpassword' element={<Forgotpassword />}/>
    </Routes>
    <Toaster toastOptions={{
      className: '',
      style: {
        fontSize: '1.8rem',
        padding:"14px",
      }
    }} />
    </>
  );
}

export default App;
