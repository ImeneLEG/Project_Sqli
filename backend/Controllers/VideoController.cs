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
        private readonly HistoriqueService _historiqueService;
        private readonly VideoRetrievalService _videoRetrievalService;


        public VideosController(VideoServices videoService, HistoriqueService historiqueService, VideoRetrievalService videoRetrievalService)
        {
            _videoServices = videoService;
            _historiqueService = historiqueService;
            _videoRetrievalService = videoRetrievalService;
        }


        [HttpGet("watch/{videoId}")]
        public async Task<IActionResult> WatchVideo(int userId, string videoId)
        {
            var video = await _videoServices.GetVideoByIdAsync(videoId);
            if (video == null)
            {
                return NotFound();
            }

            // Vérifier si la vidéo est déjà dans l'historique
            var historyExists = await _historiqueService.IsVideoInHistoryAsync(userId, videoId);
            if (!historyExists)
            {
                await _historiqueService.AddHistoryAsync(userId, videoId);
            }

            return Ok(video);
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

        [HttpGet("{videoId}")]
        public async Task<IActionResult> GetVideoById(string videoId)
        {
            var video = await _videoServices.GetVideoByIdAsync(videoId);

            if (video == null)
            {
                return NotFound(new { Message = "Video not found." });
            }

            return Ok(video);
        }



        // Action pour utliser le service du chargement des viéos les plus regardées par pays
        [HttpGet("most-viewed-by-country")]
        public async Task<IActionResult> GetMostViewedVideosByCountry([FromQuery] int topX, [FromQuery] string countryCode)
        {
            try
            {
                // Validation des paramètres
                if (topX <= 0)
                {
                    return BadRequest("Le paramètre 'topX' doit être supérieur à zéro.");
                }

                if (string.IsNullOrEmpty(countryCode))
                {
                    return BadRequest("Le paramètre 'countryCode' ne doit pas être vide.");
                }

                // Appel du service pour obtenir les vidéos les plus regardées par pays
                var mostViewedVideos = await _videoServices.GetTopVideosByCountryAsync(topX, countryCode);

                return Ok(mostViewedVideos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Une erreur s'est produite : {ex.Message}");
            }

        }

        //recuperation des region pour les selectionner en front
        [HttpGet("regions")]
        public IActionResult GetRegions()
        {
            {
                var regions = _videoServices.GetRegions();
                return Ok(regions);
            }


        }






    }
}
