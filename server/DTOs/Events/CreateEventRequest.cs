 namespace server.DTOs.Events
{
    public class CreateEventRequest
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Location { get; set; }
        public DateTime EventDate { get; set; }
        public string? Status { get; set; }
        public decimal Price { get; set; }
        public IFormFile? ImageFile { get; set; }
        //public string? ImageUrl { get; set; }
        public int OrganizerId { get; set; }
       // public string OrganizerName { get; set; } = null!;
    }
}
