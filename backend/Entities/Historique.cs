using Microsoft.EntityFrameworkCore.Metadata.Internal;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Projet_Sqli.Entities
{
    public class Historique
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; }

        [Required]
        public int VideoId { get; set; }

        [ForeignKey("VideoId")]
        //public Video Video { get; set; }

        [Required]
        public DateTime ViewedAt { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }
    }
}
