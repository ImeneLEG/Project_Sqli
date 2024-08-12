using System;
using System.Collections.Generic;

namespace Projet_Sqli.Entities
{
    public class Videos
    {
        public int Id { get; set; }
        public string VideoId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime PublishedAt { get; set; }
        public string Url { get; set; }
        public string Thumbnail { get; set; }
        public string Views { get; set; }
        public string Likes { get; set; }
        public string Comments { get; set; }
        public List<string> Tags { get; set; }
        public int Duration { get; set; }
        public string ChannelId { get; set; }
        public string ChannelTitle { get; set; }
        public string TrendingRanks { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
