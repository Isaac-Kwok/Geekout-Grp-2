import logo from '../logo.svg';
import Button from '@mui/material/Button';
import '../App.css';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Button LinkComponent={Link} variant="contained" color="primary" to="/test">Test Page</Button>
      </header>
    </div>
  );
}

export default App;
