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
            // V�rifier si l'email existe d�j�
            if (_context.Users.Any(u => u.Email == registerDto.Email))
            {
                return BadRequest("L'email est d�j� utilis�.");
            }

            // R�cup�rer ou ajouter le r�le sp�cifi�
            var role = await _context.Roles.FirstOrDefaultAsync(r => r.Name == registerDto.Role.Name);

            // Si le r�le n'existe pas, le cr�er et l'ajouter � la base de donn�es
            if (role == null)
            {
                role = new Role
                {
                    Name = registerDto.Role.Name,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Roles.Add(role);
                await _context.SaveChangesAsync(); // Assurez-vous que l'ID du r�le est g�n�r� avant de l'utiliser
            }

            // Cr�er un nouvel utilisateur
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

            // Ajouter l'utilisateur � la base de donn�es
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // G�n�rer le jeton JWT apr�s l'inscription r�ussie
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
            // En JWT, la d�connexion implique que le client supprime le jeton JWT stock�.
            // Cependant, nous pouvons �galement ajouter des ent�tes HTTP pour emp�cher la mise en cache.

            // Emp�cher la mise en cache de la page de r�ponse
            Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
            Response.Headers["Pragma"] = "no-cache";
            Response.Headers["Expires"] = "0";

            return Ok("D�connexion r�ussie.");
        }




        [HttpGet("getCountryByEmail")]
        public async Task<IActionResult> GetCountryByEmail([FromQuery] string email)
        {
            // Rechercher l'utilisateur par email
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                return NotFound("Utilisateur non trouv�.");
            }

            // Retourner un message avec le pays de l'utilisateur
            return Ok($"L'utilisateur avec l'email {email} est enregistr� dans le pays : {user.Country}");
        }




        [HttpGet("getCountryID")]
        public async Task<IActionResult> GetCountryByIDl([FromQuery] int id)
        {
            // Rechercher l'utilisateur par email
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound("Utilisateur non trouv�.");
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




        // M�thode de demande de r�initialisation de mot de passe
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
        {
            // Trouver le jeton dans la base de donn�es
            var resetToken = await _context.ResetPasswordTokens
                .Include(rt => rt.User)
                .FirstOrDefaultAsync(rt => rt.Token == resetPasswordDto.Token);

            if (resetToken == null || resetToken.ExpiresAt < DateTime.UtcNow)
            {
                return BadRequest("Le lien de r�initialisation est invalide ou a expir�.");
            }

            // Trouver l'utilisateur associ� au jeton
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == resetToken.UserId);
            if (user == null)
            {
                return BadRequest("Utilisateur non trouv�.");
            }

            // Mettre � jour le mot de passe de l'utilisateur
            user.Password = BCrypt.Net.BCrypt.HashPassword(resetPasswordDto.NewPassword);
            _context.Users.Update(user);

            // Supprimer le jeton apr�s utilisation
            _context.ResetPasswordTokens.Remove(resetToken);

            // Enregistrer les modifications
            await _context.SaveChangesAsync();

            return Ok("Le mot de passe a �t� r�initialis� avec succ�s.");
        }


        [HttpPost("request-reset-password")]
        public async Task<IActionResult> RequestResetPassword([FromBody] ResetPasswordRequestDto requestDto)
        {
            // V�rifiez si l'utilisateur avec l'email existe
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == requestDto.Email);
            if (user == null)
            {
                // Pour des raisons de s�curit�, ne r�v�lez pas si l'utilisateur n'existe pas
                return BadRequest("Si un compte evc cet email exsite , vous reveverez un lien de r�initialisation");
            }

            // G�n�rez un jeton de r�initialisation
            var resetToken = Guid.NewGuid().ToString();
            var resetPasswordToken = new ResetPasswordToken
            {
                UserId = user.Id,
                Token = resetToken,
                ExpiresAt = DateTime.UtcNow.AddHours(1) // Expiration dans 1 heure
            };

            // Enregistrez le jeton dans la base de donn�es
            _context.ResetPasswordTokens.Add(resetPasswordToken);
            await _context.SaveChangesAsync();

            // Envoyez un email avec le lien de r�initialisation
            await SendResetPasswordEmail(user.Email, resetToken);

            return Ok("Un email de r�initialisation de mot de passe a �t� envoy�.");
        }




        private async Task SendResetPasswordEmail(string email, string resetToken)
        {
            try
            {
                var resetLink = $"http://localhost:5173/reset-password/{resetToken}?email={email}";
                var emailBody = $"Veuillez cliquer sur le lien suivant pour r�initialiser votre mot de passe : {resetLink}";

                using (var client = new SmtpClient("smtp.gmail.com"))
                {
                    client.Port = 587;
                    client.Credentials = new NetworkCredential("your-email@gmail.com", "password-specifique a l app et assurer d avoir la validation en deux facteurs activ�e"); // Utilisez un mot de passe sp�cifique � l'application
                    client.EnableSsl = true;

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress("nadia.azam.2002@gmail.com"),
                        Subject = "R�initialisation de votre mot de passe",
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
