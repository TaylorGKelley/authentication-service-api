import { Route, Routes } from "react-router-dom";
import LoginCallback from "./Pages/LoginCallback";
import Home from "./Pages/Home";

const App = () => {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/login-callback" element={<LoginCallback />} />
    </Routes>
  );
};

export default App;
