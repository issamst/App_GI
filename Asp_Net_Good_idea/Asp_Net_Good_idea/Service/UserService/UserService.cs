using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Asp_Net_Good_idea.Models;
using Asp_Net_Good_idea.Context;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Http;
using Asp_Net_Good_idea.Entity;
using AutoMapper;
using Asp_Net_Good_idea.Dto.Jwt;
using Asp_Net_Good_idea.Dto.UserDto;
using Asp_Net_Good_idea.Dto.Email;
using Asp_Net_Good_idea.Helpers.Email;
using Asp_Net_Good_idea.Helpers.UserHelpers;
using Asp_Net_Good_idea.Models.UserModel;
using Asp_Net_Good_idea.UtilityService.EmailService;
using Asp_Net_Good_idea.Models.EmailModel;


namespace Asp_Net_Good_idea.UtilityService.UserService
{
    public class UserService
    {
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        private readonly AppDbContext _authContext;
        private readonly UserServiceHelpers _userServiceHelpers;

        public UserService(AppDbContext authContext, IConfiguration configuration, IEmailService emailService, IMapper mapper)
        {
            _configuration = configuration;
            _emailService = emailService;
            _authContext = authContext;
            _mapper = mapper;
            _userServiceHelpers = new UserServiceHelpers(authContext); // Initialize UserServiceHelpers
        }

        public async Task<(string newAccessToken, string newRefreshToken)> Authenticate(Authenticate authenticate)
        {
            if (authenticate == null)
            {
                throw new ArgumentNullException(nameof(authenticate), "Authenticate object is null.");
            }

            var user = await _authContext.Users
                .Include(u => u.Name_Role)
                .FirstOrDefaultAsync(u => u.TEID == authenticate.TEID);

            if (user == null)
            {
                throw new Exception("User Not Found!");
            }

            if (string.IsNullOrEmpty(user.Password))
            {
                throw new Exception("User password is null or empty");
            }

            if (string.IsNullOrEmpty(authenticate.Password))
            {
                throw new Exception("Password is null or empty");
            }

            if (!PasswordHasher.VerifyPassword(authenticate.Password, user.Password))
            {
                throw new Exception("Password is Incorrect");
            }

            var userRole = _mapper.Map<User_Role>(user);
            var roleName = userRole != null ? userRole.Name_Role : "";
            var jwtData = new CreateJwt
            {
                FulltName = user.FullName,
                Role = roleName
            };

            user.Token = _userServiceHelpers.CreateJwt(jwtData);
            user.RefreshTokenExpiryTime = DateTime.Now;
            await _authContext.SaveChangesAsync();
            return (user.Token, _userServiceHelpers.CreateRefreshToken());
        }


        public async Task<IActionResult> Register(Register register)
        {
            if (register == null)
            {
                throw new ArgumentNullException(nameof(register));
            }

            if (await _userServiceHelpers.CheckUserTEIDAsync(register.TEID))
            {
                throw new Exception("TE ID already exists");
            }

            if (string.IsNullOrEmpty(register.Email))
            {
                var email_admin = "issam.serbout09@gmail.com";
                var emailModel = new EmailModel(email_admin, "New Operateur", NewEmployee.NewBodyEmployee(register.TEID, register.FullName, register.Phone));
                _emailService.SendEmail(emailModel);
            }
            else
            {
                if (await _userServiceHelpers.CheckUserEMAILAsync(register.Email))
                    throw new Exception("Email already exists");
                var emailModel = new EmailModel(register.Email, "Welcome", NewEmployee.NewBodyEmployee(register.TEID, register.FullName, register.Phone));
                _emailService.SendEmail(emailModel);
            }

            var newUser = _mapper.Map<User>(register);
            newUser.Password = PasswordHasher.hashPassword(register.Password);
            
            if (newUser.RoleID != null)
            {
        
                newUser.RoleID = 1;
            }

            // Check if Status is null or empty
            if (string.IsNullOrEmpty(newUser.Status))
            {
                newUser.Status = "pending";
            }


            newUser.RegisterTime = DateTime.Now;

            await _authContext.Users.AddAsync(newUser);
            await _authContext.SaveChangesAsync();

            return new OkObjectResult(new
            {
                Message = "User Registered!"
            });

        }
        public async Task<IActionResult> Addnew(Register register)
        {
            if (register == null)
            {
                throw new ArgumentNullException(nameof(register));
            }

            if (await _userServiceHelpers.CheckUserTEIDAsync(register.TEID))
            {
                throw new Exception("TE ID already exists");
            }

            if (string.IsNullOrEmpty(register.Email))
            {
                var email_admin = "issam.serbout09@gmail.com";
                var emailModel = new EmailModel(email_admin, "New Operateur", NewEmployee.NewBodyEmployee(register.TEID, register.FullName, register.Phone));
                _emailService.SendEmail(emailModel);
            }
            else
            {
                if (await _userServiceHelpers.CheckUserEMAILAsync(register.Email))
                    throw new Exception("Email already exists");
                var emailModel = new EmailModel(register.Email, "Welcome", NewEmployee.NewBodyEmployee(register.TEID, register.FullName, register.Phone));
                _emailService.SendEmail(emailModel);
            }

            var newUser = _mapper.Map<User>(register);
            newUser.Password = PasswordHasher.hashPassword(register.Password);

            if (newUser.RoleID != null)
            {

                newUser.RoleID = 1;
            }

            // Check if Status is null or empty
            if (string.IsNullOrEmpty(newUser.Status))
            {
                newUser.Status = "pending";
            }


            newUser.RegisterTime = DateTime.Now;

            await _authContext.Users.AddAsync(newUser);
            await _authContext.SaveChangesAsync();

            return new OkObjectResult(new
            {
                Message = "User Registered!"
            });

        }

        public async Task<IActionResult> Refresh(TokenApiDto tokenApiDto)
        {
            if (tokenApiDto is null)
                throw new Exception("Invalid Client Request");

            string accessToken = tokenApiDto.AccessToken;
            string refreshToken = tokenApiDto.RefreshToken;

            var principal = _userServiceHelpers.GetPrincipleFromExpiredToken(accessToken);
            var username = principal.Identity.Name;
            var user = await _authContext.Users
                .Include(u => u.Name_Role)
                .FirstOrDefaultAsync(u => u.FullName == username);

            if (user is null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.Now)
                throw new Exception("Invalid Request");

            var roleName = user.Name_Role != null ? user.Name_Role.Name_Role : "";
            var jwtData = new CreateJwt
            {
                FulltName = user.FullName,
                Role = roleName
            };
            var newAccessToken = _userServiceHelpers.CreateJwt(jwtData);
            var newRefreshToken = _userServiceHelpers.CreateRefreshToken();

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = DateTime.Now.AddMinutes(1);
            await _authContext.SaveChangesAsync();

            return new OkObjectResult(new TokenApiDto()
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken,
            });
        }

        public async Task<IActionResult> SendEmail(SendEmail sendEmail)
        {
            var user = await _authContext.Users.FirstOrDefaultAsync(a => a.TEID == sendEmail.TEID);
            if (user is null)
            {
                throw new Exception("TEID Doesn't Exist");
            }

            if (!string.IsNullOrEmpty(sendEmail.Email))
            {
                var email = await _authContext.Users.FirstOrDefaultAsync(a => a.TEID == sendEmail.TEID && a.Email == sendEmail.Email);
                if (email is null)
                {
                    throw new Exception("Email Doesn't Exist");
                }
            }
            else
            {
                sendEmail.Email = "issam.serbout09@gmail.com";
                user.Request = "pending";
            }

            var tokenBytes = RandomNumberGenerator.GetBytes(64);
            var emailToken = Convert.ToBase64String(tokenBytes);

            user.ResetPasswordToken = emailToken;
            user.ResetPasswordExpiryTime = DateTime.Now.AddDays(1);
            string from = _configuration["EmailSettings:From"];
            var emailModel = new EmailModel(sendEmail.Email, "Reset Password !!", EmailBodyPassword.EmailStringBody(sendEmail.TEID, sendEmail.Email, emailToken));
            _emailService.SendEmail(emailModel);

            _authContext.Entry(user).State = EntityState.Modified;
            await _authContext.SaveChangesAsync();

            return new OkObjectResult(new
            {
                StatusCode = 200,
                Message = "Sent!"
            });
        }

        public async Task<IActionResult> ResetPassword(ResetPasswordDto resetPasswordDto)
        {
            var newToken = resetPasswordDto.EmailToken.Replace(" ", "+");
            var user = await _authContext.Users.FirstOrDefaultAsync(a => a.TEID == resetPasswordDto.TEID);
            if (user is null)
            {
                throw new Exception("User Doesn't Exist");
            }

            var tokenCode = user.ResetPasswordToken;
            DateTime emailTokenExpiry = user.ResetPasswordExpiryTime;

            Console.WriteLine("Token Code: " + tokenCode);
            Console.WriteLine("Input Token: " + resetPasswordDto.EmailToken);
            Console.WriteLine("Token Expiry: " + emailTokenExpiry);

            if (tokenCode != resetPasswordDto.EmailToken || emailTokenExpiry < DateTime.Now)
            {
                throw new Exception("Invalid Reset link");
            }

            user.Password = PasswordHasher.hashPassword(resetPasswordDto.NewPassword);
            user.Request = "done";

            _authContext.Entry(user).State = EntityState.Modified;
            await _authContext.SaveChangesAsync();

            return new OkObjectResult(new
            {
                StatusCode = 200,
                Message = "Password Reset Successfully"
            });
        }
    }
}
