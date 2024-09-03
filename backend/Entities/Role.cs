using System;
using System.ComponentModel.DataAnnotations;

namespace Projet_Sqli.Entities
{

    public class Role
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}



