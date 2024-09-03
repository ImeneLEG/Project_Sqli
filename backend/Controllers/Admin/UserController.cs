using Microsoft.AspNetCore.Mvc;

using Projet_Sqli.Entities;
using Projet_Sqli.Services;

using System.Collections.Generic;
using System.Threading.Tasks;
using Swashbuckle.AspNetCore.Annotations;
using Projet_Sqli.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


namespace Projet_Sqli.Controllers.Admin
{
    [Route("api/admin/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public UserController(UserService userService, ApplicationDbContext context, IConfiguration configuration)
        {
            _userService = userService;
            context = context;
            _configuration = configuration;
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


        
        

        

        
        

       

        [HttpGet("stats/{year}")]
        public async Task<ActionResult<IEnumerable<MonthlyUserStats>>> GetMonthlyUserStats(int year)
        {
            var stats = await _userService.GetMonthlyUserStatsAsync(year);
            return Ok(stats);
        }
    }
}