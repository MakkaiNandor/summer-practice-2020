using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Practice.Api.Data
{
    public class PersonalData
    {
        public NameAgeEmail Name { get; set; }
        public NameAgeEmail Age { get; set; }
        public NameAgeEmail Email { get; set; }
        public Gender Gender { get; set; }
    }
}
