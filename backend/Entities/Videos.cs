using System;
using System.Collections.Generic;

using System.Text.Json.Serialization;

namespace Projet_Sqli.Entities
{
    public class Videos
    {
        public int Id { get; set; }
        public ICollection<Historique> Historiques { get; set; } = new List<Historique>();

        public string VideoId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime PublishedAt { get; set; }
        public string Url { get; set; }
        public string Thumbnail { get; set; }
        [JsonIgnore]
        public Dictionary<DateTime, int> Views { get; set; }
        [JsonIgnore]
        public Dictionary<DateTime, int> Likes { get; set; }
        [JsonIgnore]
        public Dictionary<DateTime, int> Comments { get; set; }
        public List<string> Tags { get; set; }
        public int Duration { get; set; }
        public string ChannelId { get; set; }
        public string ChannelTitle { get; set; }
        [JsonIgnore]
        public Dictionary<DateTime, int> TrendingRanks { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
