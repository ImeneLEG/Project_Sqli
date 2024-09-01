import React, { useEffect, useState } from 'react';
import { fetchVideoStatistics, fetchTopVideosByCountry } from '../services/adminService';

const VideoStatistics = () => {
  const [statistics, setStatistics] = useState([]);
  const [topVideos, setTopVideos] = useState([]);
  const [topX, setTopX] = useState(5);
  const [countryCode, setCountryCode] = useState('MA');

  useEffect(() => {
    // Récupérer les statistiques vidéo
    fetchVideoStatistics().then(stats => setStatistics(stats));
  }, []);

  const handleFetchTopVideos = () => {
    fetchTopVideosByCountry(topX, countryCode).then(videos => setTopVideos(videos));
  };

  return (
    <div className="video-statistics">
      <h2>Statistiques des vidéos</h2>
      <div>
        <h3>Nombre total de vidéos par jour</h3>
        <ul>
          {statistics.map(stat => (
            <li key={stat.date}>{stat.date}: {stat.count} vidéos</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Top {topX} vidéos de {countryCode}</h3>
        <input type="number" value={topX} onChange={(e) => setTopX(e.target.value)} />
        <input type="text" value={countryCode} onChange={(e) => setCountryCode(e.target.value)} />
        <button onClick={handleFetchTopVideos}>Rechercher</button>
        <ul>
          {topVideos.map(video => (
            <li key={video.id}>{video.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VideoStatistics;
