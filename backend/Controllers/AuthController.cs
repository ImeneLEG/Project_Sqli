using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;

using Projet_Sqli.Entities;
using Projet_Sqli.Data;
using Microsoft.AspNetCore.Authorization;

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

            return Ok( new { role = $"{user.Role.Name}" , email=$"{user.Email}", country=$"{user.Country}" , username=$"{user.Username}" });
        }



        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
            {
                return BadRequest("Email ou mot de passe incorrect.");
            }

            // Create claims for the user, including the userId
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role.Name),
                new Claim("Country", user.Country),
                new Claim("userId", user.Id.ToString()) // Add userId as a claim
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var authProperties = new AuthenticationProperties
            {
                IsPersistent = true
            };

            // Authenticate the user
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity), authProperties);

            return Ok(new
            {
                Message = "Connexion réussie.",
                RoleMessage = $"Vous êtes {user.Role.Name}.",
                Country = $"{user.Country}",
                Email = $"{user.Email}"
            });
        }




        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok("Déconnexion réussie.");
        }



        [HttpGet("getCountryByEmail")]
        public async Task<IActionResult> GetCountryByEmail([FromQuery] string email)
        {
            // Rechercher l'utilisateur par email
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                return NotFound("Utilisateur non trouvé.");
            }

            // Retourner un message avec le pays de l'utilisateur
            return Ok($"L'utilisateur avec l'email {email} est enregistré dans le pays : {user.Country}");
        }




        [HttpGet("getCountryID")]
        public async Task<IActionResult> GetCountryByIDl([FromQuery] int id)
        {
            // Rechercher l'utilisateur par email
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound("Utilisateur non trouvé.");
            }

            // Retourner un message avec le pays de l'utilisateur
            return Ok(new
            {
                Country = $"{user.Country}"
            });
        }


        // utuilisation : 'https://localhost:7275/api/Auth/getCountryID?id=1' \


        //curent user connected 
        [HttpGet("current-user")]
        [Authorize]
        public IActionResult GetCurrentUser()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "userId");
            var usernameClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name);
            var roleClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role);
            var countryClaim = User.Claims.FirstOrDefault(c => c.Type == "Country");

            if (userIdClaim != null && usernameClaim != null && roleClaim != null && countryClaim != null)
            {
                return Ok(new
                {
                    UserId = userIdClaim.Value,
                    Username = usernameClaim.Value,
                    Role = roleClaim.Value,
                    Country = countryClaim.Value
                });
            }

            return Unauthorized();
        }




    }
}
