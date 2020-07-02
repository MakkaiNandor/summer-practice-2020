using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Practice.Api.Data
{
    public class Answers: Document
    {
        public int SurveyId { get; set; }
        public List<PersonalData_Answers> AnswerList {get; set;}
    }
}
