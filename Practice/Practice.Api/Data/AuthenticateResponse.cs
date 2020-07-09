using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Practice.Api.Data;

namespace Practice.Api.Models
{
    public class AuthenticateResponse
    {
        public string UserName { get; set; }
        public string Token { get; set; }


        public AuthenticateResponse(User user, string token)
        {
            UserName = user.UserName;
            Token = token;
        }
    }
}