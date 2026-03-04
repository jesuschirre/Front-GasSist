import Routes from './routers/routes'
import { AuthContextProvider } from './context/AuthContext'
import { BrowserRouter } from 'react-router-dom'
function App() {

  return (
    <>
      <BrowserRouter>
        < AuthContextProvider>
          <Routes/>
        </ AuthContextProvider>
      </BrowserRouter>
    </>
  )
}

export default App
