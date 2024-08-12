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
    }
}
