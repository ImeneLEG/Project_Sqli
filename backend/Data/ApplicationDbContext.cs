using Microsoft.EntityFrameworkCore;
using Projet_Sqli.Entities;



namespace Projet_Sqli.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        public DbSet<Role> Roles { get; set; }
        public DbSet<Historique> Historiques { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .Property(u => u.CreatedAt)
                .HasDefaultValueSql("GETDATE()");

            modelBuilder.Entity<User>()
                .Property(u => u.UpdatedAt)
                .HasDefaultValueSql("GETDATE()");

            // Seed the database with default roles
            modelBuilder.Entity<Role>().HasData(
                new Role { Id = 1, Name = "user", CreatedAt = DateTime.Now, UpdatedAt = DateTime.Now },
                new Role { Id = 2, Name = "admin", CreatedAt = DateTime.Now, UpdatedAt = DateTime.Now }
            );
        }
    }
}