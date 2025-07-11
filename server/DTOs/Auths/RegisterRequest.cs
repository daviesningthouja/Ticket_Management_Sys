namespace server.DTOs.Auths
{
    public class RegisterRequest
    {
        public string? Name { get; set; } = null!;
        public string? Email { get; set; } = null!;
        public string? Password { get; set; } = null!;
        public string? ConfirmPassword { get; set; } = null!;
        public string? Role { get; set; } // "user" or "organizer"
    }
}