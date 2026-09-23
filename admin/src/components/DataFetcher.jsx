import { useState, useEffect } from "react";

function DataFetcher() {
  // 1. STATE: What data are we tracking?
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. EFFECT: This runs when the component first loads
  useEffect(() => {
    // We define an async function inside
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/posts?_limit=5",
        );
        const data = await response.json();

        setPosts(data); // Save the data to state
        setLoading(false); // Stop the loading spinner
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData(); // Call the function
  }, []); // <-- THE EMPTY ARRAY IS CRITICAL

  return (
    <div style={{ padding: "20px", background: "#f4f4f4", margin: "20px" }}>
      <h2>Fetched Data</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id} style={{ marginBottom: "10px" }}>
              <strong>{post.title}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DataFetcher;
