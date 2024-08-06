﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class HistoriqueService
    {
        private readonly ApplicationDbContext _context;

        public HistoriqueService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddHistoryAsync(int userId, int videoId)
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