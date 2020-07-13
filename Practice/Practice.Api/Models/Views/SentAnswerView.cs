using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Practice.Api.Data;

namespace Practice.Api.Models.Views
{
    public class SentAnswerView
    {
        public int SurveyId { get; set; }
        public int CompletedCounter { get; set; }
        public int LeftCounter { get; set; }
        public List<SentPersonalData_Answers> Answers { get; set; }
    }
}
