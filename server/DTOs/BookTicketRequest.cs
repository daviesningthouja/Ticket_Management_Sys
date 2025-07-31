namespace server.DTOs
{
    public class BookTicketRequest
    {
        public int UserId { get; set; }
        public int EventId { get; set; }
        public List<int>? SeatIds { get; set; }
    }
}