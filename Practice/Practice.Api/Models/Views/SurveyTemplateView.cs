using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Practice.Api.Data;

namespace Practice.Api.Models.Views
{
    public class SurveyTemplateView
    {
        public int SurveyTemplateId { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Ending { get; set; }
        public List<Page> Pages { get; set; }
    }
}
