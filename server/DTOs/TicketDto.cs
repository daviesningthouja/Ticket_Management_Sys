namespace server.DTOs
{
    public class TicketDto
    {
        public int Id { get; set; }
        public string? TicketNumber { get; set; }
        public int UserId { get; set; }
        public int EventId { get; set; }
        public DateTime BookingTime { get; set; }
        public string? UserName { get; set; }
        public string? EventTitle { get; set; }
        public decimal? TotalPrice { get; set; }
        public int? Quantity { get; set; }
    }
}