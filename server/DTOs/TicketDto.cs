namespace server.DTOs
{
    public class TicketDto
    {
        public int Id { get; set; }
        public string? TicketNumber { get; set; }
        public string CategoryName { get; set; } = null!;
        public List<string> SeatNumbers { get; set; } = null!;
        public int UserId { get; set; }
        public string? UserName { get; set; }
        public int EventId { get; set; }
        public string? EventTitle { get; set; }
        public DateTime BookingTime { get; set; }
        public decimal? TotalPrice { get; set; }
        public string? Status { get; set; }
    }
}