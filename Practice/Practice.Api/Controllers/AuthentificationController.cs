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
//using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Practice.Api.Helpers;

namespace Practice.Api.Controllers
{
    [Route("Authentification")]
    [ApiController]
    public class AuthentificationController : ControllerBase
    {
        
        private readonly AppSettings _appSettings;

        /*
        public AuthentificationController(IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings.Value;
        }
        */

        private readonly IRepository<User> users;

        public AuthentificationController(IRepository<User> temp_users, IOptions<AppSettings> appSettings)
        {
            users = temp_users;
            _appSettings = appSettings.Value;

        }

        [EnableCors]
        [HttpPost("UserLogin")]
        public ActionResult<AuthenticateResponse> UserLogin(User login_user)
        //public void UserLogin(User login_user)
        {
            //return new BadRequestResult();
            
            
            if ((users.FindOne(variable => variable.UserName == login_user.UserName)) == null)
            {
                //return "Username not found";
                //return null;
                return new BadRequestResult();
            }
            else
            {
                if ((users.FindOne(variable => variable.Password == login_user.Password)) == null)
                {
                    //return "Password incorrect";
                    //return null;
                    return new BadRequestResult();
                }
                else
                {
                    //return "Succesfully logged in";
                    var token = generateJwtToken(login_user);

                    return new AuthenticateResponse(login_user, token);
                    //return new OkObjectResult(token);
                    //return 1;

                }
            }
            
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
