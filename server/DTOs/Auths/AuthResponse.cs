namespace server.DTOs.Auths
{
    public class AuthResponse
    {
        public string Id { get; set; } = null!;
        public string Token { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Role { get; set;} = null!; // "user" or "organizer"
    }
    
}