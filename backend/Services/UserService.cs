using Microsoft.EntityFrameworkCore;
using Projet_Sqli.Data;
using Projet_Sqli.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Projet_Sqli.Services
{
    public class UserService
    {
        private readonly ApplicationDbContext _context;

        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<User> CreateUserAsync(User user)
        {
            user.CreatedAt = DateTime.UtcNow;
            user.UpdatedAt = DateTime.UtcNow;
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User> UpdateUserAsync(User user)
        {
            user.UpdatedAt = DateTime.UtcNow;
            _context.Entry(user).State = EntityState.Modified;
            _context.Entry(user).Property(x => x.CreatedAt).IsModified = false;
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task DeleteUserAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
            }
        }


        public async Task<IEnumerable<MonthlyUserStats>> GetMonthlyUserStatsAsync(int year)
        {
            var stats = await _context.Users
                .Where(u => u.CreatedAt.Year == year)
                .GroupBy(u => new { u.CreatedAt.Year, u.CreatedAt.Month })
                .Select(g => new MonthlyUserStats
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    UserCount = g.Count()
                })
                .OrderBy(s => s.Year)
                .ThenBy(s => s.Month)
                .ToListAsync();

            // Assurez-vous d'avoir une entrée pour chaque mois, même s'il n'y a pas d'inscriptions
            var allMonths = Enumerable.Range(1, 12)
                .Select(month => new MonthlyUserStats { Year = year, Month = month, UserCount = 0 })
                .ToList();

            return allMonths.GroupJoin(stats,
                all => all.Month,
                stat => stat.Month,
                (all, stat) => stat.FirstOrDefault() ?? all);
        }
    }

    public class MonthlyUserStats
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public int UserCount { get; set; }
    }

}
