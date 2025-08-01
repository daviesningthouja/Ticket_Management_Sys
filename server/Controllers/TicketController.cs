using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Models;
using server.DTOs;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using server.DTOs.Auths;
using server.Services;
namespace server.Controllers
{
    [ApiController]
    [Route("api/ticket")]
    [Authorize]
    public class TicketController : Controller
    {
        private readonly IMapper _mapper;
        private readonly TmsContext _context;
        private readonly ICurrentUserService _currentUser;

        public TicketController(TmsContext context, IMapper mapper, ICurrentUserService currentUser)
        {
            _context = context;
            _mapper = mapper;
            _currentUser = currentUser;
        }

        private string GenerateTicketNumber()
        {
            var random = new Random();
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var randomPart = new string(Enumerable.Repeat(chars, 8)
                .Select(s => s[random.Next(s.Length)]).ToArray());

            var ticketNumber = $"TKT-{DateTime.Now:yyyyMMdd}-{randomPart}";
            return $"TKT-{DateTime.Now:yyyyMMdd}-{randomPart}";
        }

        private TicketDto MapTicketToDto(Ticket ticket)
        {
            return new TicketDto
            {
                Id = ticket.Id,
                TicketNumber = ticket.TicketNo,
                CategoryName = ticket.Category?.Name ?? "",
                SeatNumbers = ticket.Seat != null ? new List<string> { ticket.Seat.SeatNumber } : new List<string>(),
                UserId = ticket.UserId,
                UserName = ticket.User?.Name,
                EventId = ticket.EventId,
                EventTitle = ticket.Event?.Title,
                BookingTime = ticket.BookingTime ?? DateTime.MinValue,
                TotalPrice = ticket.TotalPrice,
                Status = ticket.Status
            };
        }

        [HttpPost("checkout")]
        public async Task<ActionResult<List<TicketDto>>> Checkout([FromBody] BookTicketRequest request)
        {
            int userId = _currentUser.GetUserId();

            if (request.SeatIds == null || !request.SeatIds.Any())
                return BadRequest("No seats selected.");

            var eventItem = await _context.Events.FindAsync(request.EventId);
            if (eventItem == null) return NotFound("Event not found.");

            var seats = await _context.Seats
                .Include(s => s.Category)
                .Where(s => request.SeatIds.Contains(s.Id))
                .ToListAsync();

            var alreadyBooked = seats.Where(s => s.IsBooked == true).ToList();
            if (alreadyBooked.Any())
                return Conflict($"Seats already booked: {string.Join(", ", alreadyBooked.Select(s => s.SeatNumber))}");

            List<Ticket> tickets = new();

            foreach (var seat in seats)
            {
                seat.IsBooked = true;
                tickets.Add(new Ticket
                {
                    UserId = userId,
                    EventId = eventItem.Id,
                    SeatId = seat.Id,
                    CategoryId = seat.CategoryId,
                    BookingTime = DateTime.UtcNow,
                    TicketNo = GenerateTicketNumber(),
                    TotalPrice = seat.Category.Price,
                    Status = "Valid"
                });
            }

            await _context.Tickets.AddRangeAsync(tickets);
            await _context.SaveChangesAsync();

            var result = tickets.Select(MapTicketToDto).ToList();
            return Ok(result);
        }

        [HttpGet("my")]
        public async Task<ActionResult<IEnumerable<TicketDto>>> GetMyTickets()
        {
            int userId = _currentUser.GetUserId();

            var tickets = await _context.Tickets
                .Where(t => t.UserId == userId)
                .Include(t => t.Event)
                .Include(t => t.Seat)
                .Include(t => t.Category)
                .Include(t => t.User)
                .ToListAsync();

            return Ok(tickets.Select(MapTicketToDto));
        }

        [HttpGet("user/{userId}")]
        [Authorize(Roles = "Admin,Organizer")]
        public async Task<ActionResult<IEnumerable<TicketDto>>> GetUserTickets(int userId)
        {
            var tickets = await _context.Tickets
                .Where(t => t.UserId == userId)
                .Include(t => t.Event)
                .Include(t => t.Seat)
                .Include(t => t.Category)
                .Include(t => t.User)
                .ToListAsync();

            return Ok(tickets.Select(MapTicketToDto));
        }

        [HttpGet("event/{eventId}")]
        [Authorize(Roles = "Admin,Organizer")]
        public async Task<ActionResult<IEnumerable<TicketDto>>> GetEventTickets(int eventId)
        {
            var tickets = await _context.Tickets
                .Where(t => t.EventId == eventId)
                .Include(t => t.Event)
                .Include(t => t.Seat)
                .Include(t => t.Category)
                .Include(t => t.User)
                .ToListAsync();

            return Ok(tickets.Select(MapTicketToDto));
        }

        [HttpGet("list")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<TicketDto>>> GetAllTickets()
        {
            var tickets = await _context.Tickets
                .Include(t => t.User)
                .Include(t => t.Event)
                .Include(t => t.Seat)
                .Include(t => t.Category)
                .ToListAsync();

            return Ok(tickets.Select(MapTicketToDto));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteTicket(int id)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
                return NotFound("Ticket not found.");

            _context.Tickets.Remove(ticket);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Ticket deleted successfully" });
        }

        [HttpGet("revenue/summary")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetRevenueSummary([FromQuery] string range = "30d")
        {
            DateTime startDate = range switch
            {
                "7d" => DateTime.Now.AddDays(-7),
                "30d" => DateTime.Now.AddDays(-30),
                "1y" => new DateTime(DateTime.Now.Year, 1, 1),
                _ => new DateTime(1753, 1, 1)
            };

            var tickets = await _context.Tickets
                .Include(t => t.Event)
                .ThenInclude(e => e.Organizer)
                .Where(t => t.Event.EventDate >= startDate)
                .ToListAsync();

            var totalRevenue = tickets.Sum(t => t.TotalPrice);
            var totalTicketsSold = tickets.Count;

            var organizerRevenues = tickets
                .GroupBy(t => new { t.Event.Organizer.Name, t.Event.Title })
                .Select(g => new
                {
                    organizerName = g.Key.Name,
                    eventName = g.Key.Title,
                    ticketsSold = g.Count(),
                    revenue = g.Sum(t => t.TotalPrice)
                })
                .ToList();

            return Ok(new { totalRevenue, totalTicketsSold, organizerRevenues });
        }

    }
}
