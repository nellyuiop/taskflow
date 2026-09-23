import WelcomeCard from "./components/WelcomeCard";
import DataFetcher from "./components/DataFetcher"; // Import it

function App() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px" }}>
      <h1>TaskFlow Admin Panel</h1>

      <WelcomeCard name="Nelly" role="Administrator" />

      {/* Add the new component here */}
      <DataFetcher />
    </div>
  );
}

export default App;
