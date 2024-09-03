using Microsoft.EntityFrameworkCore.Metadata.Internal;

using System;
using Projet_Sqli.Entities;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;



namespace Projet_Sqli.Entities

{
    public class Favoris
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public String VideoId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
