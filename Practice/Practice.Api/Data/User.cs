using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace Practice.Api.Data
{
    public class User : Document
    {
        public string UserName { get; set; }
        public string Email { get; set; }

        public string Password { get; set; }
    }
}
