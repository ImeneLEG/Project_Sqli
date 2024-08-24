using Microsoft.AspNetCore.Mvc;
using Projet_Sqli.Services;
using System;

namespace Projet_Sqli.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FavorisController : ControllerBase
    {
        private readonly FavorisService _favorisService;

        // Ensure the constructor is public
        public FavorisController(FavorisService favorisService)
        {
            _favorisService = favorisService;
        }

        // Get all the favorites for a user
        [HttpGet("user/{userId}/favorites")]
        public async Task<IActionResult> GetUserFavoriteVideos(int userId)
        {
            var userExists = _favorisService.CheckIfUserExists(userId);
            if (!userExists)
            {
                return NotFound(new { Message = "User not found." });
            }

            var favoriteVideos = await _favorisService.GetFavoriteVideosByUserAsync(userId);

            if (favoriteVideos == null || !favoriteVideos.Any())
            {
                return NotFound(new { Message = "No favorite videos found for this user." });
            }

            return Ok(favoriteVideos);
        }



        // Add video to favorites
        [HttpPost("user/{userId}/video/{videoId}")]
        public IActionResult AddToFavorites(int userId, String videoId)
        {
            try
            {
                _favorisService.AddToFavorites(userId, videoId);
                return Ok(new { Message = "Video added to favorites." });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        // Delete video from favorites
        [HttpDelete("user/{userId}/video/{videoId}")]
        public IActionResult RemoveFromFavorites(int userId, String videoId)
        {
            try
            {
                _favorisService.RemoveFromFavorites(userId, videoId);
                return Ok(new { Message = "Video removed from favorites." });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}
