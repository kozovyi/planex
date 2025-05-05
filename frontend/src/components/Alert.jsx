import { useState, useEffect } from "react";
import "../styles/alert.css";

export default function Alert({ text, show, onClick }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);

      const timer = setTimeout(() => {
        setVisible(false);
        if (onClick) onClick();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [show]);

  return (
    <div className={`alert-banner ${visible ? "show" : "hide"}`}>
      <span>{text}</span>
      <button
        onClick={() => {
          setVisible(false);
          if (onClick) onClick();
        }}
      >
        x
      </button>
    </div>
  );
}
