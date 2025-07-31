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

        [Route("book")]
        [HttpPost]
        public async Task<ActionResult<List<TicketDto>>> BookTicket([FromBody] BookTicketRequest request)
{
    int userId = _currentUser.GetUserId();

    var user = await _context.Users.FindAsync(userId);
    var eventItem = await _context.Events.FindAsync(request.EventId);

    if (user == null || eventItem == null)
        return NotFound("User or Event not found");

    if (request.SeatIds == null || !request.SeatIds.Any())
        return BadRequest("No seats selected.");

    var seats = await _context.Seats
        .Include(s => s.Category)
        .Where(s => request.SeatIds.Contains(s.Id))
        .ToListAsync();

    var alreadyBooked = seats.Where(s => s.IsBooked == true).ToList();
    if (alreadyBooked.Any())
    {
        var bookedSeats = string.Join(", ", alreadyBooked.Select(s => s.SeatNumber));
        return BadRequest($"Seats already booked: {bookedSeats}");
    }

    List<Ticket> tickets = new();

    foreach (var seat in seats)
    {
        var ticket = new Ticket
        {
            UserId = userId,
            EventId = eventItem.Id,
            SeatId = seat.Id,
            CategoryId =seat.CategoryId,
            BookingTime = DateTime.UtcNow,
            TicketNo = GenerateTicketNumber(),
            TotalPrice = seat.Category.Price,
            Status = "Valid"
        };

        seat.IsBooked = true;
        tickets.Add(ticket);
        _context.Tickets.Add(ticket);
    }

    await _context.SaveChangesAsync();

    var ticketDtos = _mapper.Map<List<TicketDto>>(tickets);
    return Ok(ticketDtos);
}


        //this for org need for user 
        [Route("MyTicket")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TicketDto>>> GetMyTickets()
        {
            var uID = _currentUser.GetUserId();

            var u = await _context.Users.FindAsync(uID);
            if (u == null)
                return NotFound(new { message = "User not found" });

            var t = await _context.Tickets
                .Where(t => t.UserId == uID)
                .Include(t => t.Event)
                .ToListAsync();
            var ticketDtos = _mapper.Map<IEnumerable<TicketDto>>(t);
            return Ok(ticketDtos);

        }

        /*_________________________________________*/
        //ROLE: Organizer
        /*_________________________________________*/


        [Route("user/{userId}")]
        [Authorize(Roles = "Admin,Organiner")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TicketDto>>> GetUserTickets([FromRoute] int userId)
        {
            var u = await _context.Users.FindAsync(userId);
            if (u == null)
                return NotFound(new { message = "User not found" });

            var t = await _context.Tickets
                .Where(t => t.UserId == userId)
                .Include(t => t.Event)
                .Select(t => new TicketDto
                {
                    Id = t.Id,
                    TicketNumber = t.TicketNo,
                    UserId = t.UserId,
                    EventId = t.EventId,
                    BookingTime = t.BookingTime.HasValue ? t.BookingTime.Value.ToLocalTime() : DateTime.MinValue,
                    UserName = t.User.Name,
                    EventTitle = t.Event.Title,
                 
                    TotalPrice = t.TotalPrice,
                    Status = t.Status
                })
                .ToListAsync();
            //var ticketDtos = _mapper.Map<IEnumerable<TicketDto>>(t);
            return Ok(t);

        }

        [Route("event/{eventId}")]
        [Authorize(Roles = "Admin,Organiner")]

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TicketDto>>> GetEventTickets([FromRoute] int eventId)
        {
            var e = await _context.Events.FindAsync(eventId);
            if (e == null)
                return NotFound(new { message = "Event not found" });

            var tickets = await _context.Tickets
                .Where(t => t.EventId == eventId)
                .Include(t => t.User)
                .ToListAsync();

            var ticketDtos = _mapper.Map<IEnumerable<TicketDto>>(tickets);

            return Ok(ticketDtos);
        }


        /*_________________________________________*/
        //ROLE: Admin
        /*_________________________________________*/

        [Route("list")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TicketDto>>> GetTickets()
        {
            if (!_currentUser.IsAdmin())
                return Unauthorized("Needs to be Admin");
            var tickets = await _context.Tickets
                .Include(t => t.User)
                .Include(t => t.Event)
                .ToListAsync();
            var ticketDtos = _mapper.Map<IEnumerable<TicketDto>>(tickets);

            return Ok(ticketDtos);
        }

        [Route("{id}")]
        [HttpDelete]
        public async Task<ActionResult> DeleteTicket([FromRoute] int id)
        {
            if (!_currentUser.IsAdmin())
                return Unauthorized("Needs to be Organizer or Admin");
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
            {
                return NotFound(new { message = "Ticket not found" });
            }
            _context.Tickets.Remove(ticket);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Ticket deleted successfully" });
        }


        [HttpGet("revenue/summary")]
public async Task<IActionResult> GetRevenueSummary([FromQuery] string range = "30days")
{
    DateTime startDate = range switch
    {
        "7d" => DateTime.Now.AddDays(-7),
        "30d" => DateTime.Now.AddDays(-30),
        "1y" => new DateTime(DateTime.Now.Year, 1, 1),
        "all" or _ => new DateTime(1753, 1, 1) // ✅ use SQL-safe minimum date
    };

    var filteredTickets = await _context.Tickets
        .Include(t => t.Event)
            .ThenInclude(e => e.Organizer)
        .Where(t => t.Event.EventDate >= startDate )
        .ToListAsync();

    var totalRevenue = filteredTickets.Sum(t => t.TotalPrice);
    int totalTicketsSold = filteredTickets.Count;

    var organizerRevenues = filteredTickets
        .GroupBy(t => new { t.Event.Organizer.Name, t.Event.Title })
        .Select(g => new
        {
            organizerName = g.Key.Name,
            eventName = g.Key.Title,
            ticketsSold = g.Count(),
            revenue = g.Sum(t => t.TotalPrice)
        })
        .ToList();

    return Ok(new
    {
        totalRevenue,
        totalTicketsSold,
        organizerRevenues
    });
}


    }
}
