using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;

using Projet_Sqli.Entities;
using Projet_Sqli.Data;

namespace Projet_Sqli.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }




        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            // Vérifier si l'email existe déjà
            if (_context.Users.Any(u => u.Email == registerDto.Email))
            {
                return BadRequest("L'email est déjà utilisé.");
            }

            // Récupérer ou ajouter le rôle spécifié
            var role = await _context.Roles.FirstOrDefaultAsync(r => r.Name == registerDto.Role.Name);

            // Si le rôle n'existe pas, le créer et l'ajouter à la base de données
            if (role == null)
            {
                role = new Role
                {
                    Name = registerDto.Role.Name,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                if (_context.Roles.Any(u => u.Name == role.Name))
                {
                    _context.Roles.Add(role);
                    await _context.SaveChangesAsync(); // Assurez-vous que l'ID du rôle est généré avant de l'utiliser
                }

            }

            // Créer un nouvel utilisateur
            var user = new User
            {
                Username = registerDto.Username,
                Password = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                Email = registerDto.Email,
                Country = registerDto.Country,
                RoleId = role.Id,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // Ajouter l'utilisateur à la base de données
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok($"Inscription réussie.Vous êtes {user.Role.Name}");
        }



        [HttpPost("login")]

        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            // Rechercher l'utilisateur par email
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
            {
                return BadRequest("Email ou mot de passe incorrect.");
            }

            // Créer les claims pour l'utilisateur
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role.Name)
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var authProperties = new AuthenticationProperties
            {
                IsPersistent = true // Maintenir la session
            };

            // Sign in the user
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity), authProperties);

            return Ok(new { Message = "Connexion réussie.", RoleMessage = $"Vous êtes {user.Role.Name}." });
        }


        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok("Déconnexion réussie.");
        }


    }
}
