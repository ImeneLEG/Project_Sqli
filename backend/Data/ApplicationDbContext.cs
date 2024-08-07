using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Historique> Historiques { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            // Configuration pour l'entité User
            modelBuilder.Entity<User>()
                .Property(u => u.CreatedAt)
                .HasDefaultValueSql("GETDATE()");

            modelBuilder.Entity<User>()
                .Property(u => u.UpdatedAt)
                .HasDefaultValueSql("GETDATE()");



            // Configuration pour l'entité Historique
            modelBuilder.Entity<Historique>()
                .Property(h => h.ViewedAt)
                .HasDefaultValueSql("GETDATE()");

            modelBuilder.Entity<Historique>()
                .Property(h => h.CreatedAt)
                .HasDefaultValueSql("GETDATE()");

            // Définir les relations et les contraintes
            modelBuilder.Entity<Historique>()
                .HasOne(h => h.User)
                .WithMany(u => u.Historiques)
                .HasForeignKey(h => h.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Historique>()
                .HasOne(h => h.Video)
                .WithMany(v => v.Historiques)
                .HasForeignKey(h => h.VideoId)
                .OnDelete(DeleteBehavior.Cascade);

        }
    }
}