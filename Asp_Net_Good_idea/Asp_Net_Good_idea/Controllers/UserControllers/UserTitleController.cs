using Asp_Net_Good_idea.Context;
using Asp_Net_Good_idea.Models.UserModel;
using Asp_Net_Good_idea.UtilityService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Asp_Net_Good_idea.Controllers.UserControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserTitleController : ControllerBase
    {
        private readonly AppDbContext _authContext;

        public UserTitleController(AppDbContext appDbContext)
        {
            _authContext = appDbContext;


        }


      
        [HttpGet]

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User_Title>>> GetAllTitle()
        {
            var titles = await _authContext.User_Title
                
                .ToListAsync();

            return Ok(titles);
        }




        [HttpGet]
        [Route("{id:int}")]
        public async Task<ActionResult<User_Title>> GetTitle([FromRoute] int id)
        {
            var title = await _authContext.User_Title.FirstOrDefaultAsync(x => x.Id == id);
            if (title != null)
            {
                return Ok(title);
            }
            return NotFound("Title Not found");
        }



        [HttpPost]
        public async Task<ActionResult<User_Title>> AddTitle([FromBody] User_Title title)
        {
            await _authContext.User_Title.AddAsync(title);
            await _authContext.SaveChangesAsync();
            return Ok(new
            {
                Message = "done !!"
            });

        }


        [HttpPut]
        [Route("{id:int}")]
        public async Task<ActionResult<User_Title>> UpdateTitle([FromRoute] int id, [FromBody] User_Title title)
        {
            var existingtitle = await _authContext.User_Title.FirstOrDefaultAsync(x => x.Id == id);
            if (existingtitle != null)
            {
                existingtitle.Name_Title = title.Name_Title;
                
                await _authContext.SaveChangesAsync();
                return Ok(existingtitle);
            }
            return NotFound("Title Not found");
        }





        [HttpDelete("TitleUser/{id}/{commenter}")]
        public async Task<ActionResult<User_Title>> DeleteTitle([FromRoute] int id, string commenter)
        {
            var existingTitle = await _authContext.User_Title.FirstOrDefaultAsync(x => x.Id == id);
            if (existingTitle != null)
            {
                existingTitle.CommenterDelete = commenter;
                _authContext.User_Title.Update(existingTitle); // Update User_Title entity
                await _authContext.SaveChangesAsync();

                return Ok(new { Message = "Done delete !!!" });
            }
            return NotFound("Title Not found");
        }




    }
}
