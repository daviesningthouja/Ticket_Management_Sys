namespace server.DTOs.Events
{
    public class EventDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public string? Location { get; set; }
        public DateTime EventDate { get; set; }
        public string? ImageUrl { get; set; }
        public decimal Price { get; set; }
        public string? Status { get; set; }
        public int OrganizerId { get; set; }
        public string OrganizerName { get; set; } = null!;
      
        public int AvailableTickets { get; set; }
        public decimal? StartingPrice { get; set; }
    
    }
}
