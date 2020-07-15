using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Practice.Api.Data;
using Practice.Api.Data.Repositories;
using Practice.Api.Models;
using System.Security.Claims;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Practice.Api.Helpers;
using Microsoft.AspNetCore.Authorization;
using System.Security.Cryptography;
using System.Security.Policy;

namespace Practice.Api.Controllers
{
    [Authorize]
    [Route("Authentification")]
    [ApiController]
    public class AuthentificationController : ControllerBase
    {
        
        private readonly AppSettings _appSettings;
        private readonly IRepository<User> users;

        public AuthentificationController(IRepository<User> temp_users, IOptions<AppSettings> appSettings)
        {
            users = temp_users;
            _appSettings = appSettings.Value;

        }

        [AllowAnonymous]
        [EnableCors]
        [HttpPost("UserLogin")]
        public ActionResult<AuthenticateResponse> UserLogin(User login_user)
        {
            var hashed_password = hashPassword(login_user.Password);
            login_user.Password = hashed_password;

            

            if ((users.FindOne(variable => variable.UserName == login_user.UserName && variable.Password==login_user.Password)) == null)
            {
                return new BadRequestResult();
            }
            else
            {
                    //return "Succesfully logged in";
                    var token = generateJwtToken(login_user);

                    return new AuthenticateResponse(login_user, token);
            }

            
            
            
        }

        [AllowAnonymous]
        [EnableCors]
        [HttpPost("PasswordHasher/{pass}")]
        public string PasswordHasher(string pass)
        {
            return hashPassword(pass);
            
        }

            public static string hashPassword(string password)
        {
            SHA1CryptoServiceProvider sha1 = new SHA1CryptoServiceProvider();

            byte[] password_bytes = Encoding.ASCII.GetBytes(password);
            byte[] encrypted_byte = sha1.ComputeHash(password_bytes);

            return Convert.ToBase64String(encrypted_byte);
        }





        private string generateJwtToken(User user)
        {
            // generate token that is valid for x time
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret.ToString());

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.UserName.ToString())
                }),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        

    }
}
