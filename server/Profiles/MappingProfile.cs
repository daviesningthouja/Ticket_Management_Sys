using AutoMapper;
using server.Models;
using server.DTOs;
using server.DTOs.Events;
using server.DTOs.Auths;
using server.DTOs.Cart;
using server.DTOs.Ticket;
namespace server.Profiles
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // User mappings
            CreateMap<User, UserDto>();
            CreateMap<RegisterRequest, User>()
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role))
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore());

            CreateMap<User, AuthResponse>()
                .ForMember(dest => dest.Token, opt => opt.Ignore());

            CreateMap<User, OrganizerDto>();

            // Event mappings
            CreateMap<CreateEventRequest, Event>();
            CreateMap<TicketCategoryRequest, TicketCategory>();

            CreateMap<Event, EventDto>()
                .ForMember(dest => dest.OrganizerName, opt => opt.MapFrom(src => src.Organizer.Name));

            CreateMap<Event, AdminDto>()
                .ForMember(dest => dest.OrganizerName, opt => opt.MapFrom(src => src.Organizer.Name))
                .ForMember(dest => dest.TotalRevenue, opt => opt.MapFrom(src => src.Tickets.Sum(t => t.TotalPrice ?? 0)))
                .ForMember(dest => dest.TotalTicketsSold, opt => opt.MapFrom(src => src.Tickets.Count));

            // Ticket mappings
            CreateMap<Ticket, TicketDto>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.Name))
                .ForMember(dest => dest.EventTitle, opt => opt.MapFrom(src => src.Event.Title))
                .ForMember(dest => dest.TicketNumber, opt => opt.MapFrom(src => src.TicketNo))
                .ForMember(dest => dest.BookingTime, opt => opt.MapFrom(
                    src => src.BookingTime.HasValue ? src.BookingTime.Value.ToUniversalTime() : DateTime.MinValue))
                .ForMember(dest => dest.SeatNumbers, opt => opt.MapFrom(src => new List<string> { src.Seat.SeatNumber }))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status));

             // ✅ TicketCategory mappings
            CreateMap<TicketCategory, TicketCategoryDto>();
            CreateMap<CreateTicketCategoryRequest, TicketCategory>();
            CreateMap<UpdateTicketCategoryRequest, TicketCategory>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // ✅ Seat mappings
            CreateMap<Seat, SeatDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Category.Price));
            CreateMap<CreateSeatsRequest, Seat>();
            CreateMap<UpdateSeatRequest, Seat>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // ✅ Cart mappings
            CreateMap<Cart, CartDto>()
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.CartItems));

            
            
            // ✅ CartItem mappings
            CreateMap<CartItem, CartItemDto>()
                .ForMember(dest => dest.SeatNumber, opt => opt.MapFrom(src => src.Seat.SeatNumber))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Seat.Category.Name))
                .ForMember(dest => dest.EventTitle, opt => opt.MapFrom(src => src.Seat.Category.Event.Title))
                .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Seat.Category.Price));

            CreateMap<CreateCartItemRequest, CartItem>();
            CreateMap<UpdateCartItemRequest, CartItem>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));



        }
    }
}
