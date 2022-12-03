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
import ComparePage from "./Pages/ComparePage";
import AlertSnackBar from "./Components/AlertSnackBar";

function App() {
  const { theme } = useTheme();
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <AlertSnackBar />
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/user" element={<UserPage />}></Route>
          <Route path="/compare/:username" element={<ComparePage />}></Route>
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
