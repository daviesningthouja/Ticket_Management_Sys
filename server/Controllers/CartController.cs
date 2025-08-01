using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using server.DTOs.Cart;
using server.DTOs.Events;
using Microsoft.AspNetCore.Authorization;
using server.Services;
using System.Security.Cryptography;
using server.DTOs.Ticket;
using server.DTOs.Admin;
using Microsoft.AspNetCore.Components;
using RouteAttribute = Microsoft.AspNetCore.Mvc.RouteAttribute;
namespace server.Controllers
{
    [Authorize]
    [Route("api/cart")]
    public class CartController : Controller
    {
        private readonly TmsContext _context;
        private readonly IMapper _mapper;
        private readonly ICurrentUserService _currentUser;
        public CartController(TmsContext context, IMapper mapper, ICurrentUserService currentUser)
        {
            _context = context;
            _mapper = mapper;
            _currentUser = currentUser;
        }


        [Route("create")]
        [HttpPost]
        public async Task<ActionResult<CartDto>> CreateCart()
        {
            int userId = _currentUser.GetUserId();

            var existingCart = await _context.Carts
                .Include(c => c.CartItems)
                .ThenInclude(i => i.Seat)
                .ThenInclude(s => s.Category)
                .ThenInclude(c => c.Event)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (existingCart != null)
            {
                return Ok(_mapper.Map<CartDto>(existingCart)); // or BadRequest("Cart already exists")
            }

            var cart = new Cart
            {
                UserId = userId,
                CreatedAt = DateTime.UtcNow // if you have timestamp
            };
            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();

            return Ok(_mapper.Map<CartDto>(cart));
        }

        [Route("user")]
        [HttpGet]
        public async Task<ActionResult<CartDto>> GetCart()
        {
            int userId = _currentUser.GetUserId();

            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .ThenInclude(i => i.Seat)
                .ThenInclude(s => s.Category)
                .ThenInclude(c => c.Event)
                .FirstOrDefaultAsync(c => c.UserId == userId);
            Console.WriteLine($"Loaded {cart.CartItems.Count} cart items for user {userId}");
            if (cart == null)
                return NotFound("Cart not found.");
            var cartDto = _mapper.Map<CartDto>(cart);
            return Ok(cartDto);
        }



        [HttpPost("items")]
        public async Task<ActionResult<CartItemDto>> AddItemToCart(CreateCartItemRequest request)
        {
            var seat = await _context.Seats
                .Include(s => s.Category)
                .ThenInclude(c => c.Event)
                .FirstOrDefaultAsync(s => s.Id == request.SeatId);

            if (seat == null || seat.IsBooked == true)
                return BadRequest("Seat is invalid or already booked.");

            var item = _mapper.Map<CartItem>(request);
            _context.CartItems.Add(item);
            await _context.SaveChangesAsync();

            var cartItemDto = _mapper.Map<CartItemDto>(item);
            cartItemDto.SeatNumber = seat.SeatNumber;
            cartItemDto.Price = seat.Category.Price;
            cartItemDto.CategoryName = seat.Category.Name;
            cartItemDto.EventTitle = seat.Category.Event.Title;

            return Ok(cartItemDto);
        }

        [HttpPut("items/{id}")]
        public async Task<ActionResult<CartItemDto>> UpdateCartItem(int id, UpdateCartItemRequest request)
        {
            var item = await _context.CartItems.Include(i => i.Seat).FirstOrDefaultAsync(i => i.Id == id);
            if (item == null) return NotFound();

            _mapper.Map(request, item); // Only maps non-null properties

            await _context.SaveChangesAsync();
            var cartItemDto = _mapper.Map<CartItemDto>(item);
            return Ok(cartItemDto);
        }

        // ✅ Delete item from cart
        [HttpDelete("items/{itemId}")]
        public async Task<IActionResult> RemoveItem(int itemId)
        {
            var item = await _context.CartItems.FindAsync(itemId);
            if (item == null)
                return NotFound();

            _context.CartItems.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ✅ Clear all items
        [HttpDelete("clear")]
        public async Task<IActionResult> ClearCart()
        {
            int userId = _currentUser.GetUserId();

            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
                return NotFound();

            _context.CartItems.RemoveRange(cart.CartItems);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetCartSummary()
        {
            int userId = _currentUser.GetUserId();
            var items = await _context.CartItems
                .Include(i => i.Seat)
                .ThenInclude(s => s.Category)
                .Where(i => i.Cart.UserId == userId)
                .ToListAsync();

            var total = items.Sum(i => i.Seat.Category.Price);
            return Ok(new { count = items.Count, total });
        }


    }
}