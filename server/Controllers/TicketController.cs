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
            var user = await _context.Users.FindAsync(request.UserId);
            var eventItem = await _context.Events.FindAsync(request.EventId);

            if (user == null || eventItem == null)
                return NotFound("User or Event not found");

            var tickets = new List<Ticket>();
            decimal pricePerTicket = eventItem.Price;

            for (int i = 0; i < request.Quantity; i++)
            {
                var newTicket = new Ticket
                {
                    UserId = request.UserId,
                    EventId = request.EventId,
                    BookingTime = DateTime.UtcNow,
                    Quantity = 1,
                    TotalPrice = pricePerTicket,
                    TicketNo = GenerateTicketNumber()
                };

                tickets.Add(newTicket);
                _context.Tickets.Add(newTicket);
            }

            await _context.SaveChangesAsync();

            var ticketDtos = tickets.Select(t => _mapper.Map<TicketDto>(t)).ToList();

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
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TicketDto>>> GetUserTickets([FromRoute] int userId)
        {
            if (!_currentUser.IsOrganizer())
                return Unauthorized("Needs to be Organizer");
            var u = await _context.Users.FindAsync(userId);
            if (u == null)
                return NotFound(new { message = "User not found" });

            var t = await _context.Tickets
                .Where(t => t.UserId == userId)
                .Include(t => t.Event)
                .ToListAsync();
            var ticketDtos = _mapper.Map<IEnumerable<TicketDto>>(t);
            return Ok(ticketDtos);

        }

        [Route("event/{eventId}")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TicketDto>>> GetEventTickets([FromRoute] int eventId)
        {
            if (!_currentUser.IsOrganizer())
                return Unauthorized("Needs to be Organizer");
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






    }
}
