using System;
using System.ComponentModel.DataAnnotations;

namespace Projet_Sqli.Entities
{
    public class RegisterDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string Country { get; set; }

        public Role Role { get; set; }
    }

}




