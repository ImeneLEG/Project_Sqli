using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Projet_Sqli.Data;
using Projet_Sqli.Entities;
using Projet_Sqli.Services;

namespace Projet_Sqli.Services
{
    public class FavorisService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly VideoServices _VideoService;


        // Public constructor for dependency injection
        public FavorisService(ApplicationDbContext dbContext, VideoServices videoService)
        {
            _dbContext = dbContext;
            _VideoService = videoService;
        }

        // Get all favorites for a specific user
        public async Task<List<Videos>> GetFavoriteVideosByUserAsync(int userId)
        {
            var favoriteVideoIds = _dbContext.Favoris
                                             .Where(f => f.UserId == userId)
                                             .OrderByDescending(f => f.CreatedAt)
                                             .Select(f => f.VideoId)
                                             .ToList();

            var favoriteVideos = new List<Videos>();
            foreach (var videoId in favoriteVideoIds)
            {
                var video = await _VideoService.GetVideoByIdAsync(videoId); // Await the asynchronous method
                if (video != null)
                {
                    favoriteVideos.Add(video);
                }
            }

            return favoriteVideos;
        }


        public bool CheckIfUserExists(int userId)
        {
            return _dbContext.Users.Any(u => u.Id == userId);
        }


        // Add a video to the user's favorites
        public void AddToFavorites(int userId, String videoId)
        {
            // Check if the favorite already exists to avoid duplicates
            var existingFavorite = _dbContext.Favoris
                                             .FirstOrDefault(f => f.UserId == userId && f.VideoId == videoId);
            if (existingFavorite != null)
            {
                throw new InvalidOperationException("This video is already in the user's favorites.");
            }

            // Create a new Favorite entity
            var favorite = new Favoris
            {
                UserId = userId,
                VideoId = videoId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // Add it to the DbSet and save changes
            _dbContext.Favoris.Add(favorite);
            _dbContext.SaveChanges();
        }

        // Remove a video from the user's favorites
        public void RemoveFromFavorites(int userId, String videoId)
        {
            // Find the favorite entry in the database
            var favorite = _dbContext.Favoris
                                     .FirstOrDefault(f => f.UserId == userId && f.VideoId == videoId);

            // If not found, throw an exception or handle it as needed
            if (favorite == null)
            {
                throw new InvalidOperationException("This video is not in the user's favorites.");
            }

            // Remove the favorite from the DbSet and save changes
            _dbContext.Favoris.Remove(favorite);
            _dbContext.SaveChanges();
        }
    }
}
