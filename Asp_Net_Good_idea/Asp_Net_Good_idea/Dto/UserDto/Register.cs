using System.ComponentModel.DataAnnotations;

namespace Asp_Net_Good_idea.Entity
{
    public class Register
    {
        [Key]
        public int Id { get; set; }
        public string TEID { get; set; }
        public string Badge_id { get; set; }
        public string FullName { get; set; }
        public string Phone { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string DepartementID { get; set; }
        public string PlantID { get; set; }
        public int TitleID { get; set; }
        public int RoleID { get; set; } 
        public string Status { get; set; }
        public DateTime RegisterTime { get; set; }

    }
}
