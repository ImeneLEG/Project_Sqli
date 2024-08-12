using System;
using System.ComponentModel.DataAnnotations;

namespace Projet_Sqli.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string Country { get; set; }
        public ICollection<Historique> Historiques { get; set; } = new List<Historique>();

        public int RoleId { get; set; }
        public Role Role { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}