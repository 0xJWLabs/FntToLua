import "./App.css";
import Body from "./layouts/Body";
import Footer from "./layouts/Footer";

function App() {
  return (
      <div class="flex flex-1 flex-col min-h-screen overflow-auto">
        <Body />
        <Footer />
      </div>
  );
}

export default App;
