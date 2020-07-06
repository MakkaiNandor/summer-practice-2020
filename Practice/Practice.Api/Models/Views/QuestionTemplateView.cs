using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Practice.Api.Data;

namespace Practice.Api.Models.Views
{
    public class QuestionTemplateView
    {
        public int QuestionTemplateId { get; set; }
        public string Label { get; set; }
        public string Type { get; set; }
        public DateTime CreateDate { get; set; }
        public List<Answer> Answers { get; set; }
    }
}
