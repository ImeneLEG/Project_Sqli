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
using Microsoft.AspNetCore.Identity.Data;
using Projet_Sqli.Services;
using System.Net.Mail;
using System.Net;

namespace Projet_Sqli.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
       
        public AuthController(ApplicationDbContext context , IConfiguration configuration)
        {
            _context = context;
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




        // Méthode de demande de réinitialisation de mot de passe
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
        {
            // Trouver le jeton dans la base de données
            var resetToken = await _context.ResetPasswordTokens
                .Include(rt => rt.User)
                .FirstOrDefaultAsync(rt => rt.Token == resetPasswordDto.Token);

            if (resetToken == null || resetToken.ExpiresAt < DateTime.UtcNow)
            {
                return BadRequest("Le lien de réinitialisation est invalide ou a expiré.");
            }

            // Trouver l'utilisateur associé au jeton
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == resetToken.UserId);
            if (user == null)
            {
                return BadRequest("Utilisateur non trouvé.");
            }

            // Mettre à jour le mot de passe de l'utilisateur
            user.Password = BCrypt.Net.BCrypt.HashPassword(resetPasswordDto.NewPassword);
            _context.Users.Update(user);

            // Supprimer le jeton après utilisation
            _context.ResetPasswordTokens.Remove(resetToken);

            // Enregistrer les modifications
            await _context.SaveChangesAsync();

            return Ok("Le mot de passe a été réinitialisé avec succès.");
        }


        [HttpPost("request-reset-password")]
        public async Task<IActionResult> RequestResetPassword([FromBody] ResetPasswordRequestDto requestDto)
        {
            // Vérifiez si l'utilisateur avec l'email existe
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == requestDto.Email);
            if (user == null)
            {
                // Pour des raisons de sécurité, ne révélez pas si l'utilisateur n'existe pas
                return BadRequest("Si un compte evc cet email exsite , vous reveverez un lien de réinitialisation");
            }

            // Générez un jeton de réinitialisation
            var resetToken = Guid.NewGuid().ToString();
            var resetPasswordToken = new ResetPasswordToken
            {
                UserId = user.Id,
                Token = resetToken,
                ExpiresAt = DateTime.UtcNow.AddHours(1) // Expiration dans 1 heure
            };

            // Enregistrez le jeton dans la base de données
            _context.ResetPasswordTokens.Add(resetPasswordToken);
            await _context.SaveChangesAsync();

            // Envoyez un email avec le lien de réinitialisation
            await SendResetPasswordEmail(user.Email, resetToken);

            return Ok("Un email de réinitialisation de mot de passe a été envoyé.");
        }




        private async Task SendResetPasswordEmail(string email, string resetToken)
        {
            try
            {
                var resetLink = $"http://localhost:5173/reset-password/{resetToken}?email={email}";
                var emailBody = $"Veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe : {resetLink}";

                using (var client = new SmtpClient("smtp.gmail.com"))
                {
                    client.Port = 587;
                    client.Credentials = new NetworkCredential("your-email@gmail.com", "password-specifique a l app et assurer d avoir la validation en deux facteurs activée"); // Utilisez un mot de passe spécifique à l'application
                    client.EnableSsl = true;

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress("nadia.azam.2002@gmail.com"),
                        Subject = "Réinitialisation de votre mot de passe",
                        Body = emailBody,
                        IsBodyHtml = false,
                    };

                    mailMessage.To.Add(email);

                    await client.SendMailAsync(mailMessage);
                }
            }
            catch (SmtpException ex)
            {
                // Log detailed SMTP exception
                Console.WriteLine($"SMTP Error: {ex.Message}");
                Console.WriteLine($"Inner Exception: {ex.InnerException?.Message}");
                throw; // Optionally rethrow or handle accordingly
            }
        }



    }
}
