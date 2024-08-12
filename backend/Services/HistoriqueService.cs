using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Projet_Sqli.Data;
using Projet_Sqli.Entities;

namespace Projet_Sqli.Services
{
    public class HistoriqueService
    {
        private readonly ApplicationDbContext _context;

        public HistoriqueService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddHistoryAsync(int userId, string videoId)
        {
            var historique = new Historique
            {
                UserId = userId,
                VideoId = videoId,
                ViewedAt = DateTime.Now,
                CreatedAt = DateTime.Now
            };
            _context.Historiques.Add(historique);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Historique>> GetHistoryByUserAsync(int userId)
        {
            return await _context.Historiques
                .Where(h => h.UserId == userId)
                .OrderByDescending(h => h.ViewedAt)
               // .Include(h => h.Video)
                .ToListAsync();
        }

        public async Task ClearHistoryAsync(int userId)
        {
            var historiques = _context.Historiques.Where(h => h.UserId == userId);
            _context.Historiques.RemoveRange(historiques);
            await _context.SaveChangesAsync();
        }
    }
}
