
using Asp_Net_Good_idea.Models.UserModel;
using Microsoft.EntityFrameworkCore;

namespace Asp_Net_Good_idea.Context
{
    public class AppDbContext:DbContext
    {     
        
        
        /*ctor*/
        public AppDbContext(DbContextOptions<AppDbContext> options ):base(options)
        {



            
        }

        public DbSet<User> Users { get; set; }
        public DbSet<User_Title> User_Title { get; set; }
        public DbSet<User_Role> User_Role { get; set; }
        public DbSet<BadgeID> BadgeID { get; set; }
       
      


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .ToTable("users")
                .HasOne(u => u.Name_Title)
                .WithMany()
                .HasForeignKey(u => u.TitleID);

            modelBuilder.Entity<User>()
                .ToTable("users")
                .HasOne(u => u.Name_Role)
                .WithMany()
                .HasForeignKey(u => u.RoleID);

           

            


            

        }

    }
}
