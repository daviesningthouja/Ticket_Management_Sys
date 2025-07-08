namespace server.DTOs
{
    public class OrganizerDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Email { get; set; }
        // Add any other fields you want to expose here
    }
}
