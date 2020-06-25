using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Practice.Api.Data
{
    public class Answer : Document
    {
        public int AnswerId { get; set; }
        public string Value { get; set; }
        public bool Selected { get; set; }
    }
}
