﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Practice.Api.Data
{
    public class SurveyTemplate : Document
    {
        public int SurveyTemplateId { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Ending { get; set; }
        public string CreateDate { get; set; }
        public User Creator { get; set; }
        public List<Page> Pages { get; set; }
    }
}
