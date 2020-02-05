import React from "react";
import axios from "axios";
import "./App.css";

const api = axios.create({
  baseURL: "http://localhost:3005"
});

async function getPDF() {
  return api.get("/pdf", {
    responseType: "arraybuffer",
    headers: {
      Accept: "application/pdf"
    }
  });
}

function savePDF() {
  return getPDF().then(response => {
    console.log(response);
    const blob = new Blob([response.data], {
      type: "application/pdf"
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "your-file.pdf";
    link.click();
  });
}

function App() {
  // savePDF().then(response => {
  //   console.log(response);
  // })
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={savePDF}> PDF CLIQUE ME</button>
      </header>
    </div>
  );
}

export default App;
