using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Practice.Api.Data
{
    public class SentAnswer: Document
    {
        public int SurveyId { get; set; }
        public int CompletedCounter { get; set; }
        public int LeftCounter { get; set; }
        public List<SentPersonalData_Answers> Answers { get; set; }
    }
}
