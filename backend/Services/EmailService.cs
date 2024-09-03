namespace Projet_Sqli.Services
{
    public class EmailService
    {
        public static async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            // Vous pouvez remplacer la logique ici par l'utilisation d'un client SMTP réel ou d'un service d'email tiers.
            Console.WriteLine($"Envoi d'un e-mail à {toEmail}: Sujet: {subject}, Corps: {body}");
            await Task.CompletedTask; // Cette ligne est juste pour illustrer l'appel asynchrone, remplacez-la par une implémentation réelle.
        }
    }
}
