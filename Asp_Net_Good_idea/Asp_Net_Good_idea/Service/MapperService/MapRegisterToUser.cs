using Asp_Net_Good_idea.Entity;
using Asp_Net_Good_idea.Models.UserModel;
using AutoMapper;

namespace Asp_Net_Good_idea.UtilityService.MapperService
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Register, User>()
                .ForMember(dest => dest.Id, opt => opt.Ignore()) 
                .ForMember(dest => dest.Token, opt => opt.Ignore()) 
                .ForMember(dest => dest.RefreshToken, opt => opt.Ignore()) 
                .ForMember(dest => dest.RefreshTokenExpiryTime, opt => opt.Ignore()); 

            CreateMap<User, User_Role>()
                .ForMember(dest => dest.Name_Role, opt => opt.MapFrom(src => src.Name_Role.Name_Role));
        }
    }
}
