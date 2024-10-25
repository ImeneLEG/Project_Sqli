﻿using Microsoft.AspNetCore.Mvc;
using Projet_Sqli.Services;
using Projet_Sqli.Entities;

namespace Projet_Sqli.Controllers
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


   


        // Nouvel endpoint pour supprimer une vidéo spécifique de l'historique
        [HttpDelete("user/{userId}/video/{videoId}")]
        public async Task<IActionResult> RemoveVideoFromHistory(int userId, string videoId)
        {
            await _historiqueService.RemoveVideoFromHistoryAsync(userId, videoId);
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
