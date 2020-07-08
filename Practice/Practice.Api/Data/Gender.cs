using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Practice.Api.Data
{
    public class Gender
    {
        public string Type { get; set; }
        public string Label { get; set; }
        public List<Answer> Answer { get; set; }
    }
}
