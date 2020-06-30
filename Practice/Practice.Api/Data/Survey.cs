using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Practice.Api.Data
{
    public class Survey : Document
    {
        public int SurveyId { get; set; }
        public int CompletedCounter { get; set; }
        public int LeftCounter { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Ending { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime ExpirationDate { get; set; }
        public string Status { get; set; }
        public User Creator { get; set; }
        public List<Page> Pages { get; set; }
    }
}
