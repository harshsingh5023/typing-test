import TypingBox from "./Components/TypingBox";
import { GlobalStyles } from "./Styles/Global";
import { ThemeProvider } from "styled-components";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import { auth } from "./firebaseConfig";
import { useTheme } from "./Context/ThemeContext";
import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import UserPage from "./Pages/UserPage";
import AlertSnackBar from "./Components/AlertSnackBar";

function App() {
  
  return (
    <>
    <AlertSnackBar />
    <Routes>
      <Route path='/' element={<HomePage />} ></Route>
      <Route path='/user' element={<UserPage />} ></Route>

    </Routes>
    </>
  );
}

export default App;
