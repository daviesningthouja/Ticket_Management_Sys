using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Models;
using server.DTOs;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
namespace server.Controllers
{
    [ApiController]
    [Route("api/ticket")]
    public class TicketController : Controller
    {
        private readonly IMapper _mapper;
        private readonly TmsContext _context;

        public TicketController(TmsContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
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
        public async Task<ActionResult<TicketDto>> BookTicket([FromBody] BookTicketRequest request)
        {
            var user = await _context.Users.FindAsync(request.UserId);
            var eventItem = await _context.Events.FindAsync(request.EventId);
            if (user == null || eventItem == null)
                return NotFound("User or Event not found");

            var ticket = _mapper.Map<Ticket>(request);
            ticket.BookingTime = DateTime.Now;
            ticket.TicketNo = GenerateTicketNumber();

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();
            var ticketDto = _mapper.Map<TicketDto>(ticket); 
         
            return Ok(ticketDto);

        }

        [Route("user/{userId}")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TicketDto>>> GetUserTickets([FromRoute] int userId)
        {
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

        /*_________________________________________*/
        //ROLE: Organizer
        /*_________________________________________*/

        [Route("event/{eventId}")]
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
            var tickets =  await _context.Tickets
                .Include(t => t.User)
                .Include(t => t.Event)
                .ToListAsync();
            var ticketDtos = _mapper.Map<IEnumerable<TicketDto>>(tickets);
            
            return Ok(ticketDtos);
        }

        [Route("{id}")]
        [HttpDelete]
        public async Task<ActionResult> DeleteTicket ([FromRoute] int id)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
            {
            return NotFound(new { message = "Ticket not found" });
            }
            _context.Tickets.Remove(ticket);
            
            return Ok(new { message = "Ticket deleted successfully" });
        }




    }
}
