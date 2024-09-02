namespace Projet_Sqli.Entities
{
    public class ResetPasswordToken
    {
        public int Id { get; set; } // L'identifiant unique du jeton
        public int UserId { get; set; } // L'identifiant de l'utilisateur auquel ce jeton est associé
        public User User { get; set; } // Une relation vers l'entité utilisateur

        public string Token { get; set; } // Le jeton de réinitialisation (GUID ou autre chaîne unique)
        public DateTime ExpiresAt { get; set; } // La date et l'heure d'expiration du jeton
    }
}
