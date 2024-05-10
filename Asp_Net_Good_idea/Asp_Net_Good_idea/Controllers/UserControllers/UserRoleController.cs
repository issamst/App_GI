using Asp_Net_Good_idea.Context;
using Asp_Net_Good_idea.Models.UserModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Asp_Net_Good_idea.Controllers.UserControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserRoleController : ControllerBase
    {
        private readonly AppDbContext _authContext;

        public UserRoleController(AppDbContext appDbContext)
        {
            _authContext = appDbContext;
        }

        // Get all roles
        [HttpGet]
        public async Task<ActionResult<User_Role>> GetAllRoles()
        {
            return Ok(await _authContext.User_Role.ToListAsync());
        }

        // Get single role by id
        [HttpGet("{id:int}")]
        public async Task<ActionResult<User_Role>> GetRole(int id)
        {
            var role = await _authContext.User_Role.FirstOrDefaultAsync(x => x.Id == id);
            if (role != null)
            {
                return Ok(role);
            }
            return NotFound("Role not found");
        }

        // Add a new role
        [HttpPost]
        public async Task<ActionResult<User_Role>> AddRole([FromBody] User_Role role)
        {
            await _authContext.User_Role.AddAsync(role);
            await _authContext.SaveChangesAsync();
            return Ok(new
            {
                Message = "Role added successfully"
            });
        }

        // Update a role
        [HttpPut("{id:int}")]
        public async Task<ActionResult<User_Role>> UpdateRole(int id, [FromBody] User_Role role)
        {
            var existingRole = await _authContext.User_Role.FirstOrDefaultAsync(x => x.Id == id);
            if (existingRole != null)
            {
                existingRole.Name_Role = role.Name_Role;
                await _authContext.SaveChangesAsync();
                return Ok(existingRole);
            }
            return NotFound("Role not found");
        }

        // Delete a role
        [HttpDelete("RoleUser/{id}/{commenter}")]
        public async Task<ActionResult<User_Role>> DeleteRole([FromRoute] int id, string commenter)
        {
            var existingRole = await _authContext.User_Role.FirstOrDefaultAsync(x => x.Id == id);
            if (existingRole != null)
            {
                existingRole.CommenterDelete = commenter;
                _authContext.User_Role.Update(existingRole); // Update User_Role entity

                await _authContext.SaveChangesAsync();
                return Ok(new { Message = "Done delete !!!" });
            }
            return NotFound("Role not found");
        }


    }
}
