import { useState } from "react";

function WelcomeCard(props) {
  // 1. STATE: Data that can change over time
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "20px",
        margin: "20px",
        borderRadius: "8px",
      }}
    >
      {/* 2. PROPS: Data passed into this component */}
      <h2>Welcome, {props.name}!</h2>
      <p>Your role is: {props.role}</p>

      {/* 3. USING STATE */}
      <p>Status: {isActive ? "🟢 Online" : "🔴 Offline"}</p>

      <button onClick={() => setIsActive(!isActive)}>Toggle Status</button>
    </div>
  );
}

export default WelcomeCard;
