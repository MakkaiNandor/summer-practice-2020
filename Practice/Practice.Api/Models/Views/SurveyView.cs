using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Practice.Api.Data;

namespace Practice.Api.Models
{
    public class SurveyView
    {
        public int SurveyId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Ending { get; set; }
        public DateTime ExpirationDate { get; set; }
        public string Status { get; set; }
        public List<Page> Pages { get; set; }
    }
}
