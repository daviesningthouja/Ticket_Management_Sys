using AutoMapper;
using server.Models;
using server.DTOs;
using server.DTOs.Auths;
namespace server.Profiles
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDto>();
            CreateMap<RegisterRequest, User>()
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role))
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore());

            CreateMap<User, AuthResponse>()
            .ForMember(dest => dest.Token, opt => opt.Ignore()); // Token will be added manually

            //CreateMap<CreateUserRequest, User>();
            CreateMap<Event, EventDto>();
            CreateMap<User, OrganizerDto>();
            CreateMap<CreateEventRequest, Event>();
            CreateMap<Ticket, TicketDto>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.Name))
                .ForMember(dest => dest.EventTitle, opt => opt.MapFrom(src => src.Event.Title))
                .ForMember(dest => dest.TicketNumber, opt => opt.MapFrom(src => src.TicketNo));
            CreateMap<BookTicketRequest, Ticket>();
        }
    }
}
