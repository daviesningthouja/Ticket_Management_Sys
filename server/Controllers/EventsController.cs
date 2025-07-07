using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Controllers
{
    [ApiController]
    [Route("api")]
    public class EventsController : Controller
    {
        private readonly TmsContext _context;

        public EventsController(TmsContext context)
        {
            _context = context;
        }

        // GET: Events
        [Route("events")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Event>>> GetEvents()
        {
            var events = await _context.Events
                .Include(e => e.Organizer)
                .ToListAsync();
            return Ok(events);
        }

        [Route("event/{id}")]
        [HttpGet]
        public async Task<ActionResult<Event>> GetEvent(int id)
        {
            if (!EventExists(id))
                return NotFound();
            var eventItem = await _context.Events
                .Include(e => e.Organizer)
                .FirstOrDefaultAsync(e => e.Id == id);
            return Ok(eventItem);  
        }

        /*_________________________________________*/
        //ROLE: Organizer
        /*_________________________________________*/


        [Route("event/create")]
        [HttpPost]
        public async Task<ActionResult<Event>> CreateEvent([FromBody] Event eventItem)
        {
            var organizer = await _context.Users.FindAsync(eventItem.OrganizerId);
            if (organizer == null)
                return BadRequest("Organizer not found");
            if (eventItem == null)
                return BadRequest("Event data is null");

            _context.Events.Add(eventItem);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetEvent), new { id = eventItem.Id }, eventItem);
        }
        private bool EventExists(int id)
        {
            return _context.Events.Any(e => e.Id == id);
        }
    }
}
