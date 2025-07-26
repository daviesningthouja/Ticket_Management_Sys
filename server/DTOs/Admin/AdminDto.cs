namespace server.DTOs.Admin
{ 
    public class OrganizerRevenueDto
    {
        public string? OrganizerName { get; set; }
        public string? EventName { get; set; }
        public int TicketsSold { get; set; }
        public decimal Revenue { get; set; }
    }

    public class AdminRevenueSummaryDto
    {
        public int TotalTicketsSold { get; set; }
        public decimal TotalRevenue { get; set; }
        public List<OrganizerRevenueDto>? OrganizerRevenues { get; set; }
    }

}