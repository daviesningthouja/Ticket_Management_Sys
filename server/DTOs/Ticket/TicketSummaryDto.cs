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
    public class TicketCategoryDto
    {
        public int Id { get; set; }
        public int EventId { get; set; }
        public string Name { get; set; } = null!;
        public decimal Price { get; set; }

        // Optional: Include Seats if needed
        public List<SeatDto>? Seats { get; set; }
    }
    public class SeatDto
    {
        public int Id { get; set; }
        public int CategoryId { get; set; }
        public string SeatNumber { get; set; } = null!;
        public bool IsBooked { get; set; }
        public int RowNumber { get; set; }
        public int ColumnNumber { get; set; }

        // Optional for UI clarity
        public string? CategoryName { get; set; }
        public decimal? Price { get; set; }
    }

    public class CreateTicketCategoryRequest
    {
        public int EventId { get; set; }
        public string Name { get; set; } = null!;
        public decimal Price { get; set; }
    }

    public class CreateSeatsRequest
    {
        public int CategoryId { get; set; }
        public int RowNumber { get; set; }
        public int ColumnNumber { get; set; }
    }

    public class UpdateTicketCategoryRequest
    {
        public string? Name { get; set; }
        public decimal? Price { get; set; }
    }
    
     public class UpdateSeatRequest
    {
        public string? SeatNumber { get; set; }
        public int? RowNumber { get; set; }
        public int? ColumnNumber { get; set; }
        public bool? IsBooked { get; set; }
    }
}