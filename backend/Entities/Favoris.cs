namespace Projet_Sqli.Entities
{
    public class Favoris
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public String VideoId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
