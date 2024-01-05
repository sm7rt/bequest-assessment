import React, { useEffect, useState } from "react";
import { createHash } from "./utils/crypto.ts";

const API_URL = "http://localhost:8080";

function App() {
  const [data, setData] = useState<string>("");

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await fetch(API_URL);
      const { data, hash } = await response.json();
      const calculatedHash = createHash(data);

      if (calculatedHash === hash) {
        setData(data);
      } else {
        throw new Error("Data integrity check failed. Possible tampering.");
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const updateData = async () => {
    try {
      await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ data, hash: createHash(data) }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      await getData();
    } catch (error) {
      console.error("Error updating data:", error.message);
    }
  };

  const verifyData = async () => {
    const response = await fetch(`${API_URL}/verify`, {
      method: "POST",
      body: JSON.stringify({ data }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const { isVerified } = await response.json();

    if (isVerified) {
      window.alert("Data is verified.");
    } else {
      if (window.confirm("Data is tampered. Do you want to recover it?")) {
        const response = await fetch(`${API_URL}/recover`);
        const { data } = await response.json();
        setData(data);
        window.alert("Data is recovered!");
      }
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        position: "absolute",
        padding: 0,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
        fontSize: "30px",
      }}
    >
      <div>Saved Data</div>
      <input
        style={{ fontSize: "30px" }}
        type="text"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />
      <div style={{ display: "flex", gap: "10px" }}>
        <button style={{ fontSize: "20px" }} onClick={updateData}>
          Update Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={verifyData}>
          Verify Data
        </button>
      </div>
    </div>
  );
}

export default App;
