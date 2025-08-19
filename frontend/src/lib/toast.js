import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export function showToast(message, type = "info", duration = 1000) {
  const bgColors = {
    success: "linear-gradient(to right, #4ade80, #22c55e)", // green
    error: "linear-gradient(to right, #f87171, #ef4444)",   // red
    info: "linear-gradient(to right, #60a5fa, #2563eb)",    // blue
  };
  Toastify({
    text: message,
    duration,
    gravity: "top",
    position: "center", 
    close: true,   
    style: {
      background: bgColors[type] || bgColors.info,
      color: "white",
      padding: "1rem",
      
    },
  }).showToast();
}