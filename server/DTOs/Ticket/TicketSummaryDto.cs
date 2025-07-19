namespace server.DTOs.Ticket
{ 
   public class LatestTicketSummaryDto
    {
        public int UserId { get; set; }
        public string? UserName { get; set; }
        public int Quantity { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime LatestBookingTime { get; set; }
    }
}