using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Practice.Api.Data
{
    public class Question : Document
    {
        public int QuestionId {get; set;}
        public string Label { get; set; }
        public string Type { get; set; }
        public List<Answer> Answers { get; set; }
    }
}
