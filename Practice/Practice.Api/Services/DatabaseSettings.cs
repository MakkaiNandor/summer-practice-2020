using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace Practice.Api.Models
{
    public class DatabaseSettings:IDatabaseSettings
    {
        public string QuestionTemplateCollection { get; set; }
        public string SurveyCollection { get; set; }
        public string SurveyTemplateCollection { get; set; }
        public string UserCollection { get; set; }
        public string Document { get; set; }
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }

    public class IDatabaseSettings
    {
        string QuestionTemplateCollection { get; set; }
        
        string SurveyCollection { get; set; }
        string SurveyTemplateCollection { get; set; }
        string UserCollection { get; set; }
        string Document { get; set; }
        string ConnectionString { get; set; }
        string DatabaseName { get; set; }
    }
}
