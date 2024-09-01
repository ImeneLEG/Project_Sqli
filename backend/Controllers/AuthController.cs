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
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Projet_Sqli.Services;

namespace Projet_Sqli.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly UserService _userService;

        public AuthController(ApplicationDbContext context , IConfiguration configuration, UserService userService)
        {
            _context = context;
            _configuration = configuration;
            _userService = userService;
            _userService = userService;
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

                _context.Roles.Add(role);
                await _context.SaveChangesAsync(); // Assurez-vous que l'ID du rôle est généré avant de l'utiliser
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

            // Générer le jeton JWT après l'inscription réussie
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, _configuration["Jwt:Subject"]),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role.Name),
                new Claim("Country", user.Country),
                new Claim("userId", user.Id.ToString()),
                new Claim("Email", user.Email)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.UtcNow.AddMinutes(60),
                signingCredentials: signIn
            );
            var tokenValue = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new { Token = tokenValue, User = user });
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
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, _configuration["Jwt:subject"]),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),



                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role.Name),
                new Claim("Country", user.Country),
                new Claim("userId", user.Id.ToString()), // Add userId as a claim
                new Claim("Email", user.Email.ToString())
            };


            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:key"]));
            var signIn = new SigningCredentials(key,SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims, expires: DateTime.UtcNow.AddMinutes(60),
                signingCredentials : signIn
                );
            string tokenValue = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new { Token = tokenValue, User = user });
            
            //return Ok(user);
        }









        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            // En JWT, la déconnexion implique que le client supprime le jeton JWT stocké.
            // Cependant, nous pouvons également ajouter des entêtes HTTP pour empêcher la mise en cache.

            // Empêcher la mise en cache de la page de réponse
            Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
            Response.Headers["Pragma"] = "no-cache";
            Response.Headers["Expires"] = "0";

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

            Console.WriteLine("User is not authenticated or missing claims.");
            return Unauthorized();
        }

        [HttpPut("update")]
        // [Authorize(Roles = "Admin")] // Autoriser seulement pour admin
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto updateUserDto)
        {
            // Rechercher l'utilisateur par ID
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("Utilisateur non trouvé.");
            }

            // Mise à jour des champs de l'utilisateur
            user.Username = updateUserDto.Username ?? user.Username;
            user.Email = updateUserDto.Email ?? user.Email;
            user.Country = updateUserDto.Country ?? user.Country;

            if (!string.IsNullOrEmpty(updateUserDto.Password))
            {
                user.Password = BCrypt.Net.BCrypt.HashPassword(updateUserDto.Password);
            }

            user.UpdatedAt = DateTime.UtcNow;

            // Sauvegarder les modifications dans la base de données
            await _context.SaveChangesAsync();
            return Ok(new { message = "Utilisateur mis à jour avec succès." });
        }

        // Méthode pour supprimer un utilisateur
        [HttpDelete("delete/{id}")]
        //[Authorize] // Autoriser seulement les utilisateurs connectés
        public async Task<IActionResult> DeleteUser(int id)
        {
            // Rechercher l'utilisateur par ID
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("Utilisateur non trouvé.");
            }

            // Supprimer l'utilisateur de la base de données
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Utilisateur supprimé avec succès." });
        }

        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("stats/{year}")]
        //[Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<MonthlyUserStats>>> GetMonthlyUserStats(int year)
        {
            var stats = await _userService.GetMonthlyUserStatsAsync(year);
            return Ok(stats);
        }



    }
}
