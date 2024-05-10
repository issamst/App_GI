using System;
using System.Threading.Tasks;
using Asp_Net_Good_idea.Context;
using Asp_Net_Good_idea.Models.UserModel;
using Microsoft.EntityFrameworkCore;

namespace Asp_Net_Good_idea.Service.UserService
{
    public class UserTitleService
    {
        private readonly AppDbContext _dbContext;

        public UserTitleService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<User_Title> AddTitle(User_Title title)
        {
           
            _dbContext.User_Title.Add(title);
            await _dbContext.SaveChangesAsync();
            return title;
        }

        
    }
}
