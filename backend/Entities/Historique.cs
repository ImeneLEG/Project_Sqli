using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Entities { 
    public class Historique
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }

        public int VideoId { get; set; }

        public DateTime ViewedAt { get; set; }

        public DateTime CreatedAt { get; set; }
    }

}