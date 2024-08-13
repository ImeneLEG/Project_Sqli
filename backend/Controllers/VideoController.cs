using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Projet_Sqli.Services;

namespace Projet_Sqli.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VideosController : ControllerBase
    {
        private readonly VideoServices _videoServices;

        public VideosController(VideoServices videoServices)
        {
            _videoServices = videoServices;
        }

        [HttpGet("trending/{regionCode}")]
        public async Task<IActionResult> GetTrendingVideos(string regionCode)
        {
            try
            {
                var videos = await _videoServices.GetTrendingVideosAsync(regionCode);
                return Ok(videos);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while fetching the trending videos.");
            }
        }

        // Nombre de vidéo journalier
        [HttpGet("count-per-day")]
        public async Task<IActionResult> GetVideoCountPerDay()
        {
            try
            {
                var countPerDay = await _videoServices.GetVideoCountPerDayAsync();
                return Ok(countPerDay);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Une erreur s'est produite lors de la récupération du nombre de vidéos par jour.");
            }
        }

        // Action pour utliser le service du chargement des viéos les plus regardées par pays
        [HttpGet("most-viewed-by-country")]
        public async Task<IActionResult> GetMostViewedVideosByCountry()
        {
            try
            {
                var mostViewedVideos = await _videoServices.GetMostViewedVideosByCountryAsync();
                return Ok(mostViewedVideos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Une erreur s'est produite lors de la récupération des vidéos les plus regardées par pays.");
            }
        }
    }
}
