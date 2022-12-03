import TypingBox from "../Components/TypingBox";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const HomePage = () => {
    return (
      <div className="canvas">
        {/* <h1 style={{ textAlign: "center" }}>Typing Test</h1> */}
        <Header />
        <TypingBox />
        <Footer />
        {/* <h1 style={{"textAlign":'center'}}>Footer</h1> */}
      </div>
    );
}

export default HomePage;
