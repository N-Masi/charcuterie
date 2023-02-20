import logo from "./assets/CC_logo_white.png"
import bg1 from "./assets/background1.JPG"
import './App.css';
import { Parallax } from 'react-parallax';

function App() {
  return (
      <div className="App">
        <Parallax blur={8} bgImage={bg1} strength={500} className="parallax">
          <h1>
            Brown University Charcuterie Club
          </h1>
          <img src={logo} className="App-logo" alt="logo"/>
          <p className="text">
            Subscribe to our { }
            <a
              className="App-link"
              href="https://listserv.brown.edu/?SUBED1=CHARCUTERIE"
              target="_blank"
              rel="noreferrer"
            >
              mailing list
            </a> to get notifited of upcoming meetings or announcements, view our { }
            <a
              className="App-link"
              href="https://docs.google.com/document/d/130l8zOTL7OrqZNrzcdUyL8Sf6hlWuUrz_XvnYiCnUNc/edit?usp=sharing"
              target="_blank"
              rel="noreferrer"
            >
              constitution
            </a>, 
            or reach us by { }
            <a
              className="App-link"
              href="mailto:charcuterie_club@brown.edu"
              target="_blank"
              rel="noreferrer"
            >
              email
            </a>!
          </p>
        </Parallax>
      </div>
  );
}

export default App;
