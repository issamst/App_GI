
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Asp_Net_Good_idea.Models.UserModel
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string TEID { get; set; }
        public string Badge_id { get; set; }
        public string FullName { get; set; }
        public string Phone { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
        public string DepartementID { get; set; }
        public string PlantID { get; set; }
        public int RoleID { get; set; }
        public User_Role Name_Role { get; set; }
       
        public int TitleID { get; set; }
        public  User_Title Name_Title { get; set; }
        public string Status { get; set; }
        public string RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }
        public string ResetPasswordToken { get; set; }
        public DateTime ResetPasswordExpiryTime { get; set; }
        public DateTime RegisterTime { get; set; }

        public string Request { get; set; }
         public string CommenterDelete { get; set; }
      
    }
}


