using AutoMapper;
using server.Models;
using server.DTOs;

namespace server.Profiles
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDto>();
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
