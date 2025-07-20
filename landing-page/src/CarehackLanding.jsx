import React from "react";
import "./CarehackLanding.css"; // Import the external CSS file

export default function CareHackLanding() {
  const games = [
    {
      title: "Bubble Pop Adventure",
      url: "https://carehack-1.vercel.app/",
    },
    {
      title: "Journey of Light",
      url: "https://carehack-2.vercel.app/",
    },
    {
      title: "Pathmemo",
      url: "https://carehack-3.vercel.app/",
    },
    {
      title: "Music instrument",
      url: "https://carehack-4.vercel.app/",
    },
  ];

  return (
    <div className="carehack-container">
      <h1>CareHack Hackathon</h1>
      <p className="subtitle">
        Our Submissions to CareHack Hackathon Phase 1
      </p>

      <div className="card-container">
        {games.map((game, index) => (
          <a
            key={index}
            href={game.url}
            target="_blank"
            rel="noopener noreferrer"
            className="game-card"
          >
            <h2>{game.title}</h2>
            <p>{game.url}</p>
          </a>
        ))}
      </div>

      <footer>© {new Date().getFullYear()} For CareHack | Designed with ❤️</footer>
    </div>
  );
}
