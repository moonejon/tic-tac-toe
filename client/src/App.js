import "./App.css";
import Login from "./components/Login";
import SignUp from "./components/SignUp";

function App() {
  return (
    <div className="App">
      <h1>Authentication</h1>
      <div className="auth">
        <SignUp />
        <Login />
      </div>
    </div>
  );
}

export default App;
