using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Practice.Api.Data
{
    public class Page : Document
    {
        public int PageNumber { get; set; }
        public List<Question> Questions { get; set; }
    }
}
