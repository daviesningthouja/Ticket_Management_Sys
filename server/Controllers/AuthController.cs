using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using server.Data;
using server.DTOs.Auths;
using server.DTOs;
using server.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using server.Services;

namespace server.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly TmsContext _context;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly PasswordHasher<User> _passwordHasher;
        private readonly ICurrentUserService _currentUser;

        public AuthController(TmsContext context, IMapper mapper, IConfiguration configuration, ICurrentUserService currentUser)
        {
            _context = context;
            _mapper = mapper;
            _configuration = configuration;
            _passwordHasher = new PasswordHasher<User>();
            _currentUser = currentUser;
        }

        [Authorize]
        [HttpPut("change-password")]
        public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordReq req)
        {
            var uID = _currentUser.GetUserId();
            var u = await _context.Users.FindAsync(uID);
            if (u == null)
                return BadRequest("no user found");

            var unHashedps = req.CurrentPassword;
            if (unHashedps == u.PasswordHash)
            {
                if (req.NewPassword != req.ConfirmPassword)
                    return BadRequest("Not Match Password");
                    
                if (req.NewPassword.Length < 6)
                    return BadRequest("Password length should be six digit");

                u.PasswordHash = _passwordHasher.HashPassword(u, req.NewPassword);
                _context.Users.Update(u);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Password changed successfully" });
            }
            //verify the hash pass field 
            var result = _passwordHasher.VerifyHashedPassword(u, u.PasswordHash, req.CurrentPassword);

            if (result == PasswordVerificationResult.Failed)
                return BadRequest("Current password is incorrent");
            //check if the con and new pass is same
            if (req.NewPassword != req.ConfirmPassword)
                return BadRequest("Not Match Password");
            //define to make the pass 6 digit
            if (req.NewPassword.Length < 6)
                return BadRequest("Password length should be six digit");
            u.PasswordHash = _passwordHasher.HashPassword(u, req.NewPassword);
            _context.Users.Update(u);
            await _context.SaveChangesAsync();  
            return Ok(new { message = "Password changed successfully" });                      
        }

        [HttpPost("register")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Register([FromForm] RegisterRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest("Email already registered.");
            }
            if (request.Password != request.ConfirmPassword)
            {
                return BadRequest("Passwords do not match.");
            }
            if (request.Password == null)
                return BadRequest("Password field is null");
            if (request.Password.Length < 6)
                return BadRequest("Password length should be six digit");

            //profile pfp
            var pfpUrl = "";
            if (request.PfpUrl != null && request.PfpUrl.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "pfp");
                Directory.CreateDirectory(uploadsFolder);

                var unqFileName = $"{Guid.NewGuid()}{Path.GetExtension(request.PfpUrl?.FileName)}";
                var filePath = Path.Combine(uploadsFolder, unqFileName);
                using var stream = new FileStream(filePath, FileMode.Create);
                if (request.PfpUrl != null)
                {
                    await request.PfpUrl.CopyToAsync(stream);
                }
                pfpUrl = $"/pfp/{unqFileName}";
            }

            // if role field is null fill it "User"    
            request.Role ??= "User";


            var user = _mapper.Map<User>(request);
            user.PasswordHash = _passwordHasher.HashPassword(user, request.Password ?? "");
            //add directly to the profile
            user.PfpUrl = pfpUrl;
        
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok(new { Message = "User registered successfully." });

        }
        
        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginRequest request)
        {
            var u = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);
            if (u == null)
                return Unauthorized("Invalid email.");
            
            var ps = u.PasswordHash;

            if (ps ==  request.Password)
            {
                var token = GenerateJwtToken(u);
                var authResponse = _mapper.Map<AuthResponse>(u);
                authResponse.Token = token;
                return Ok(authResponse);
            }else {

            var result = _passwordHasher.VerifyHashedPassword(u, u.PasswordHash, request.Password ?? "");
            if (result == PasswordVerificationResult.Failed)
                return Unauthorized("Invalid password.");
            
            var token = GenerateJwtToken(u);

            var authResponse = _mapper.Map<AuthResponse>(u);
            authResponse.Token = token;
            return Ok(authResponse);
            }
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };
        
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? ""));      
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}