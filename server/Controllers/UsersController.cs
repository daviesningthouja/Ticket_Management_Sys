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
    [Route("api")]
    [ApiController]
    public class UsersController : Controller
    {
        private readonly TmsContext _context;

        public UsersController(TmsContext context)
        {
            _context = context;
        }
        [Route("users")]
        [HttpGet]
        public async Task<IEnumerable<User>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }
        [Route("search/{id}")]
        [HttpGet]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users
                .FindAsync(id);

            if (user == null)
                return NotFound();

            return user;
        }

        [Route("register")]
        [HttpPost]
        public async Task<ActionResult<User>> CreateUser([FromBody] User user)
        {
            // TODO: Add validation and password hashing later
            if (user == null)
                return BadRequest();

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

    }
}
