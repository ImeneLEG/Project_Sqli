import React, { useEffect, useState } from 'react';
import { fetchVideoStatistics, fetchTopVideosByCountry } from '../services/adminService';

const VideoStatistics = () => {
  const [statistics, setStatistics] = useState([]);
  const [topVideos, setTopVideos] = useState([]);
  const [topX, setTopX] = useState(5);
  const [countryCode, setCountryCode] = useState('MA');

  useEffect(() => {
    // Récupérer les statistiques vidéo
    const fetchStatistics = async () => {
      try {
        const stats = await fetchVideoStatistics();
        // Assurez-vous que stats est un tableau d'objets avec les propriétés `date` et `count`
        if (Array.isArray(stats)) {
          setStatistics(stats);
        } else {
          console.error('Les statistiques vidéo doivent être un tableau.');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques vidéo', error);
      }
    };

    fetchStatistics();
  }, []);

  const handleFetchTopVideos = async () => {
    try {
      const videos = await fetchTopVideosByCountry(topX, countryCode);
      // Assurez-vous que videos est un tableau d'objets avec la propriété `title`
      if (Array.isArray(videos)) {
        setTopVideos(videos);
      } else {
        console.error('Les vidéos top doivent être un tableau.');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des vidéos top', error);
    }
  };

  return (
    <div className="video-statistics">
      <h2>Statistiques des vidéos</h2>
      <div>
        <h3>Nombre total de vidéos par jour</h3>
        <ul>
          {statistics.map((stat, index) => (
            <li key={index}>{stat.date}: {stat.count} vidéos</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Top {topX} vidéos de {countryCode}</h3>
        <input
          type="number"
          value={topX}
          onChange={(e) => setTopX(Number(e.target.value))}
        />
        <input
          type="text"
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
        />
        <button onClick={handleFetchTopVideos}>Rechercher</button>
        <ul>
          {topVideos.map((video, index) => (
            <li key={index}>{video.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VideoStatistics;
