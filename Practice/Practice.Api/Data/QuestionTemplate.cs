using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Practice.Api.Data
{
    public class QuestionTemplate : Document
    {
        public int QuestionTemplateId { get; set; }
        public string Label { get; set; }
        public string Type { get; set; }
        public DateTime CreateDate { get; set; }
        public User Creator { get; set; }
        public List<Answer> Answers { get; set; }
    }
}
