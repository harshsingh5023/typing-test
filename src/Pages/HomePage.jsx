import { ThemeProvider } from "styled-components";
import TypingBox from "../Components/TypingBox";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { GlobalStyles } from "../Styles/Global";
import { auth } from "../firebaseConfig";
import { useTheme } from "../Context/ThemeContext";

const HomePage = () => {
    const { theme } = useTheme();
  console.log(auth);
    return (
<ThemeProvider theme={theme}>
      <div className="canvas">
        <GlobalStyles />
        {/* <h1 style={{ textAlign: "center" }}>Typing Test</h1> */}
        <Header />
        <TypingBox />
        <Footer />
        {/* <h1 style={{"textAlign":'center'}}>Footer</h1> */}
      </div>
    </ThemeProvider>
    );
}

export default HomePage;
