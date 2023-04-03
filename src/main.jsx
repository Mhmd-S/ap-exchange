import './styles/globals.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthUserProvider } from './firebase/auth'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Submit from './pages/Submit';
import Admin from './pages/Admin';
import Submissions from './pages/Submissions';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthUserProvider>
      <Router>
       <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/submit" element={<Submit />} />
        <Route path="/submissions" element={<Submissions />} />
        <Route path="/admin" element={<Admin />} />
       </Routes>   
     </Router>
    </AuthUserProvider>
  </React.StrictMode>
);


// export default function App() {
//   return (
//     <AuthUserProvider>
//       <Router>
//         <Switch>
//           <Route exact path="/" component={index} />
//           <Route exact path="/dasboard" component={dashboard} />
//           <Route path="/submit" component={submit} />
//           <Route path="/admin" component={admin} />
//           <Route component={NotFound} />
//         </Switch>
//       </Router>
//     </AuthUserProvider>
//     )
// }
