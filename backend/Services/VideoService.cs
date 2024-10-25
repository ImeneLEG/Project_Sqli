﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using Projet_Sqli.Entities;
using Projet_Sqli.Data;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging;


namespace Projet_Sqli.Services
{
    public class VideoServices
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly ApplicationDbContext _dbContext;
        private readonly ILogger<VideoServices> _logger;


        // Define the list of country codes and names
        public readonly List<Tuple<string, string>> countries = new List<Tuple<string, string>>
        {
            new Tuple<string, string>("US", "United States"),
            new Tuple<string, string>("GB", "United Kingdom"),
            new Tuple<string, string>("DE", "Germany"),
            new Tuple<string, string>("FR", "France"),
            new Tuple<string, string>("RU", "Russia"),
            new Tuple<string, string>("MA", "Morocco"),
            new Tuple<string, string>("NO", "Norway"),
            new Tuple<string, string>("SA", "Saudi Arabia"),
            new Tuple<string, string>("JP", "Japan"),
            new Tuple<string, string>("IN", "India"),
            new Tuple<string, string>("CA", "Canada"),
            new Tuple<string, string>("AU", "Australia"),
            new Tuple<string, string>("BR", "Brazil"),
            new Tuple<string, string>("ZA", "South Africa"),
            new Tuple<string, string>("EG", "Egypt"),
            new Tuple<string, string>("NG", "Nigeria"),
            new Tuple<string, string>("MX", "Mexico"),
            new Tuple<string, string>("KR", "South Korea"),
            new Tuple<string, string>("AR", "Argentina"),
            new Tuple<string, string>("IT", "Italy"),
        };

        public VideoServices(HttpClient httpClient, ApplicationDbContext dbContext, ILogger<VideoServices> logger)
        {
            _httpClient = httpClient;
            _apiKey = "AIzaSyDozD3fqe1Aof_tGmEpt8lyYVV_v7ENxuA";
            _dbContext = dbContext;
            _logger = logger;

        }


        public async Task<List<Videos>> GetTrendingVideosAsync(string regionCode)
        {
            // Check if the region code is valid
            if (!countries.Any(c => c.Item1.Equals(regionCode, StringComparison.OrdinalIgnoreCase)))
            {
                throw new ArgumentException("Invalid region code");
            }

            // Check if today's videos for the specified region are already in the database 

            _logger.LogInformation("Checking if videos are in the database...");

            var today = DateTime.Now.ToString("yyyy-MM-dd");

            var allVideos = await _dbContext.Videos.ToListAsync();

            var existingVideos = allVideos
                .Where(v => v.TrendingRanks.ContainsKey(today) && v.TrendingRanks[today].ContainsKey(regionCode))
                .ToList();

            if (existingVideos.Count >= 20)
            {
                _logger.LogInformation($"Returning {existingVideos.Count} videos from the database for region {regionCode}.");
                return existingVideos;
            }

            // Otherwise, make an API call to fetch trending videos
            var requestUrl = $"https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&maxResults=20&regionCode={regionCode}&key={_apiKey}";
            _logger.LogInformation($"Request URL: {requestUrl}"); 

            var response = await _httpClient.GetStringAsync(requestUrl);
            var jsonResponse = JObject.Parse(response);
            var items = jsonResponse["items"];

            var videos = new List<Videos>();

            if (items != null)
            {
                for (int i = 0; i < items.Count(); i++)
                {
                    var item = items[i];
                    if (item != null)
                    {
                        var videoId = item["id"]?.ToString() ?? string.Empty;

                        // Check if the video already exists in the database
                        var existingVideo = await _dbContext.Videos
                            .FirstOrDefaultAsync(v => v.VideoId == videoId);

                        if (existingVideo == null)
                        {
                            var video = new Videos
                            {
                                VideoId = videoId,
                                Title = item["snippet"]?["title"]?.ToString() ?? string.Empty,
                                Description = item["snippet"]?["description"]?.ToString() ?? string.Empty,
                                PublishedAt = DateTime.TryParse(item["snippet"]?["publishedAt"]?.ToString(), out var publishedDate) ? publishedDate : DateTime.MinValue,
                                Url = $"https://www.youtube.com/watch?v={videoId}",
                                Thumbnail = item["snippet"]?["thumbnails"]?["default"]?["url"]?.ToString() ?? string.Empty,
                                Views = new Dictionary<DateTime, int> { { DateTime.Now, int.Parse(item["statistics"]?["viewCount"]?.ToString() ?? "0") } },
                                Likes = new Dictionary<DateTime, int> { { DateTime.Now, int.Parse(item["statistics"]?["likeCount"]?.ToString() ?? "0") } },
                                Comments = new Dictionary<DateTime, int> { { DateTime.Now, int.Parse(item["statistics"]?["commentCount"]?.ToString() ?? "0") } },
                                Tags = item["snippet"]?["tags"]?.ToObject<List<string>>() ?? new List<string>(),
                                Duration = ParseDuration(item["contentDetails"]?["duration"]?.ToString() ?? string.Empty),
                                ChannelId = item["snippet"]?["channelId"]?.ToString() ?? string.Empty,
                                ChannelTitle = item["snippet"]?["channelTitle"]?.ToString() ?? string.Empty,
                                TrendingRanks = new Dictionary<string, Dictionary<string, int>>(),
                                CreatedAt = DateTime.Now,
                                UpdatedAt = DateTime.Now
                            };

                            // Set the ranking based on the index from the API response
                            var dateKey = DateTime.Now.ToString("yyyy-MM-dd");
                            video.TrendingRanks[dateKey] = new Dictionary<string, int>
                    {
                        { regionCode, i + 1 }
                    };

                            // Add the video to the database
                            _dbContext.Videos.Add(video);
                            await _dbContext.SaveChangesAsync();

                            videos.Add(video);
                        }
                        else
                        {
                            // Generate the date key as a string
                            var dateKey = DateTime.Now.ToString("yyyy-MM-dd");

                            // Check if the date key already exists
                            if (!existingVideo.TrendingRanks.ContainsKey(dateKey))
                            {
                                existingVideo.TrendingRanks[dateKey] = new Dictionary<string, int>();
                            }

                            // Set the ranking based on the index from the API response
                            existingVideo.TrendingRanks[dateKey][regionCode] = i + 1;
                            existingVideo.UpdatedAt = DateTime.Now;

                            _dbContext.Videos.Update(existingVideo);
                            await _dbContext.SaveChangesAsync();

                            videos.Add(existingVideo);
                        }
                    }
                }
            }

            return videos;
        }


        // Analyser la durée de la vidéo

        private int ParseDuration(string duration)
        {
            var timeSpan = System.Xml.XmlConvert.ToTimeSpan(duration);
            return (int)timeSpan.TotalSeconds;
        }
        // Récupération du nombre de vidéo enrégistré par jour
        public async Task<Dictionary<DateTime, int>> GetVideoCountPerDayAsync()
        {
            return await _dbContext.Videos
                .GroupBy(v => v.CreatedAt.Date)
                .Select(g => new { Date = g.Key, Count = g.Count() })
                .OrderByDescending(x => x.Date)
                .ToDictionaryAsync(x => x.Date, x => x.Count);

        }


        // Les vidéos les plus regardées par pays
        public async Task<List<Videos>> GetTopVideosByCountryAsync(int topX, string countryCode)
        {
            try
            {
                if (topX <= 0 || string.IsNullOrEmpty(countryCode))
                    throw new ArgumentException("Invalid parameters");

                // Fetch trending videos from the API
                var trendingVideos = await GetTrendingVideosAsync(countryCode);

                // Get the top X videos from the trending videos
                var TopVideos = trendingVideos
                    .OrderBy(v => v.TrendingRanks
                        .SelectMany(tr => tr.Value)
                        .Where(kvp => kvp.Key == countryCode)
                        .Select(kvp => kvp.Value)
                        .DefaultIfEmpty(0)
                        .Max())
                    .Take(topX)
                    .ToList();

                return TopVideos;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching most viewed videos by country");
                throw; // Re-throw the exception for further handling
            }
        }





        //récuperation des videos par id 
        public async Task<Videos> GetVideoByIdAsync(string videoId)
        {
            return await _dbContext.Videos
                                   .FirstOrDefaultAsync(v => v.VideoId == videoId);
        }



        public List<Tuple<string, string>> GetRegions()
        {
            return countries;
        }

    }
}