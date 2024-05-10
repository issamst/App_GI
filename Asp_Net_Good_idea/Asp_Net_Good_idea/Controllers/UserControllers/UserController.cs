using Asp_Net_Good_idea.Context;
using Asp_Net_Good_idea.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Text.RegularExpressions;
using System;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using System.Security.Cryptography;
using Asp_Net_Good_idea.Entity;
using System.Numerics;
using System.Data;
using System.Drawing;
using Asp_Net_Good_idea.Dto.UserDto;
using Asp_Net_Good_idea.Dto.Jwt;
using Asp_Net_Good_idea.Dto.Email;
using Asp_Net_Good_idea.Models.UserModel;
using Asp_Net_Good_idea.UtilityService.UserService;
using System.IO.Ports;
using Microsoft.Win32;
using Asp_Net_Good_idea.Helpers.UserHelpers;
namespace Asp_Net_Good_idea.Controllers.UserControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _authContext;


        private readonly SerialPort _serialPort;
        private readonly UserService _userService;
        public UserController(AppDbContext appDbContext, UserService userService)
        {
            _authContext = appDbContext;

            _userService = userService;
           
            

        }

        private string scannedData; // Variable to store the scanned data

        [HttpGet("startScanner")]
        public IActionResult GetScannerPortName()
        {
            try
            {
                // Initialize a new SerialPort object
                SerialPort serialPort = new SerialPort();

                // Set the serial port properties
                serialPort.PortName = "COM3"; // Change this to the appropriate port name
                serialPort.BaudRate = 9600;
                serialPort.Parity = Parity.None;
                serialPort.StopBits = StopBits.One;
                serialPort.DataBits = 8;
                serialPort.Handshake = Handshake.None;
                serialPort.DtrEnable = true;

                // Open the serial port
                serialPort.Open();

                String scannedID = "";
                // Read the scanned ID from the serial port with a timeout
                DateTime startTime = DateTime.Now;
                while (String.IsNullOrEmpty(scannedID))
                {
                    if ((DateTime.Now - startTime).TotalSeconds > 100) // Timeout after 5 seconds
                        break;

                    if (serialPort.BytesToRead > 0)
                    {
                        scannedID = serialPort.ReadLine();
                    }
                }

                // Close the serial port
                serialPort.Close();

                if (!String.IsNullOrEmpty(scannedID))
                {
                    // Return the scanned ID to the frontend
                    return Ok(new { Message = scannedID });
                }
                else
                {
                    return BadRequest(new { Message = "Timeout occurred while reading from the serial port" });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        private void SerialPort_DataReceived(object sender, SerialDataReceivedEventArgs e)
            {
                try
                {
                    SerialPort serialPort = (SerialPort)sender;
                    string receivedData = serialPort.ReadLine();

                    // Handle the received data, for example, log it or process it further
                    Console.WriteLine($"Received data: {receivedData}");

                    // You can process the received data further as needed
                }
                catch (Exception ex)
                {
                    // Log or handle the exception
                    Console.WriteLine($"Error reading data: {ex.Message}");
                }
            }



        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] Authenticate authenticate)
        {
            try
            {
                if (authenticate == null)
                {
                    return BadRequest(new { Message = "Authenticate object is null." });
                }

                var result = await _userService.Authenticate(authenticate);
                return Ok(new TokenApiDto()
                {
                    AccessToken = result.newAccessToken,
                    RefreshToken = result.newRefreshToken
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { ex.Message });
            }
        }


        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] Register register)
        {


            try
            {
                var result = await _userService.Register(register);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { ex.Message });
            }

        }

        [HttpPost("AddNew")]
        public async Task<IActionResult> Addnew([FromBody] Register register)
        {


            try
            {
                var result = await _userService.Addnew(register);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { ex.Message });
            }

        }



        [HttpGet("getUserbyid/{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            try
            {
                var user = await _authContext.Users
                    .Include(u => u.Name_Role)
                    .Include(u => u.Name_Title)
                    .FirstOrDefaultAsync(u => u.Id == id);

                if (user == null)
                {
                    return NotFound(new { Message = "User not found" });
                }

                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(new { ex.Message });
            }
        }

        [HttpPut("updateUser/{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] Register updateUserDto)
        {
            try
            {
                var user = await _authContext.Users.FirstOrDefaultAsync(u => u.Id == id);
                if (user == null)
                {
                    return NotFound(new { Message = "User not found" });
                }

                user.TEID = updateUserDto.TEID;
                user.FullName = updateUserDto.FullName;
                user.Phone = updateUserDto.Phone;
                user.Email = updateUserDto.Email;
               
                user.Phone=updateUserDto.Phone;
                user.Email=updateUserDto.Email;
                user.TitleID=updateUserDto.TitleID;
                user.RoleID=updateUserDto.RoleID;
                user.Status = updateUserDto.Status;

                _authContext.Users.Update(user);
                await _authContext.SaveChangesAsync();

                return Ok(new { Message = "User updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { ex.Message });
            }
        }

        //[HttpDelete("deleteUser/{id}")]
        //public async Task<IActionResult> DeleteUser(int id)
        //{
        //    try
        //    {
        //        var user = await _authContext.Users.FirstOrDefaultAsync(u => u.Id == id);
        //        if (user == null)
        //        {
        //            return NotFound(new { Message = "User not found" });
        //        }

        //        _authContext.Users.Remove(user);
        //        await _authContext.SaveChangesAsync();

        //        return Ok(new { Message = "User deleted successfully" });
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new { ex.Message });
        //    }
        //}
        [HttpDelete("deleteUser/{id}/{commenter}")]
        public async Task<IActionResult> DeleteUser(int id, string commenter)
        {
            try
            {
                var user = await _authContext.Users.FirstOrDefaultAsync(u => u.Id == id);
                if (user == null)
                {
                    return NotFound(new { Message = "User not found" });
                }

                // Update the user entity with the commenter information
                user.CommenterDelete = commenter;
                // _authContext.Users.Remove(user);
                _authContext.Users.Update(user);
                await _authContext.SaveChangesAsync();

                return Ok(new { Message = "Delete that" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { ex.Message });
            }
        }


        [Authorize]
        [HttpGet]
        public IEnumerable<User> GetAllUsers()
        {
            try
            {

                var users = _authContext.Users .Include(u => u.Name_Role).Include(u => u.Name_Title).ToList();
                 return users;
            }
            catch (Exception ex)
            {
                return Enumerable.Empty<User>();
            }
        }

        [HttpGet("request/{id}")]
        public async Task<IActionResult> CreateRequest(int id)
        {
            try
            {
                // Find the user by id
                var user = await _authContext.Users.FirstOrDefaultAsync(u => u.Id == id);
                if (user == null)
                {
                    return NotFound(new { Message = "User not found" });
                }

                // Generate a random string of length 8
                string newPassword = GenerateRandomPassword();

            
               
                user.Password = PasswordHasher.hashPassword(newPassword);
                user.Request = "done";

                // Save changes to the database
                await _authContext.SaveChangesAsync();

                return Ok(new { Message =  newPassword });
            }
            catch (Exception ex)
            {
                return BadRequest(new { ex.Message });
            }
        }

        // Method to generate a random password
        private string GenerateRandomPassword()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, 8)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }


        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] TokenApiDto tokenApiDto)
        {
            try
            {
                var result = await _userService.Refresh(tokenApiDto);
                return Ok(result);

            }
            catch (Exception ex)
            {
                return BadRequest(new { ex.Message });
            }
        }




        [HttpPost("send-reset-email")]
        public async Task<IActionResult> SendEmail([FromBody] SendEmail sendEmail)
        {

            try
            {
                var result = await _userService.SendEmail(sendEmail);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return NotFound(new
                {
                    StatusCode = 200,
                    ex.Message
                });
            }




        }


        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPasword(ResetPasswordDto resetPasswordDto)
        {
            try
            {
                var result = await _userService.ResetPassword(resetPasswordDto);
                return result;
            }
            catch (Exception ex)
            {
                if (ex.Message == "User Doesn't Exist")
                {
                    return NotFound(new
                    {
                        StatusCode = 404,
                        ex.Message
                    });
                }
                else if (ex.Message == "Invalid Reset link")
                {
                    return BadRequest(new
                    {
                        StatusCode = 400,
                        ex.Message
                    });
                }
                else if (ex.Message == "Password Rest Successfully")
                {
                    return BadRequest(new
                    {
                        StatusCode = 200,
                        ex.Message
                    });
                }
                else
                {
                    return StatusCode(500, new
                    {
                        StatusCode = 500,
                        Message = "Internal Server Error"
                    });
                }
            }
        }

    }
}
