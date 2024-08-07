using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Services;
using Backend.Entities;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HistoriqueController : ControllerBase
    {
        private readonly HistoriqueService _historiqueService;

        public HistoriqueController(HistoriqueService historiqueService)
        {
            _historiqueService = historiqueService;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddHistory(int userId, int videoId)
        {
            await _historiqueService.AddHistoryAsync(userId, videoId);
            return Ok();
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<Historique>>> GetHistoryByUser(int userId)
        {
            var history = await _historiqueService.GetHistoryByUserAsync(userId);
            return Ok(history);
        }

        [HttpDelete("clear/{userId}")]
        public async Task<IActionResult> ClearHistory(int userId)
        {
            await _historiqueService.ClearHistoryAsync(userId);
            return Ok();
        }
    }
}
