namespace server.DTOs.Users
{
    public class EditUserProfile
    {
        public IFormFile? PfpUrl { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }    
    }
}