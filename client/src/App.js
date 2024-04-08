import "./App.css";
import Cookies from "universal-cookie";
import { StreamChat } from "stream-chat";
import Login from "./components/Login";
import SignUp from "./components/SignUp";

function App() {

  const cookies = new Cookies();
  const token = cookies.get("token");
  const client = StreamChat.getInstance(process.env.REACT_APP_API_KEY);

  if (token) {
    client
      .connectUser(
        {
          id: cookies.get("userId"),
          name: cookies.get("username"),
          firstName: cookies.get("firstName"),
          lastName: cookies.get("lastName"),
          hashedPassword: cookies.get("hashedPassword"),
        },
        token
      )
      .then((user) => {
        console.log(user);
      });
  }
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
