import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Router>
        <Routes>
          <Route path="/" element={<h1>Hello World</h1>} />
        </Routes>
      </Router>
    </BrowserRouter>
  )
}

export default App
