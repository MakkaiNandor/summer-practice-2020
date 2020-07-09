using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Practice.Api.Data;
using Practice.Api.Data.Repositories;
using Practice.Api.Models.Views;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;

namespace Practice.Api.Controllers
{
    [Route("SurveyTemplate")]
    [ApiController]
    public class SurveyTemplateController : ControllerBase
    {
        private readonly IRepository<SurveyTemplate> _SurveyTemplates;

        public SurveyTemplateController(IRepository<SurveyTemplate> SurveyTemplates)
        {
            _SurveyTemplates = SurveyTemplates;
        }

        [EnableCors]
        [HttpGet("getAllSurveyTemplates")]
        public ActionResult<IEnumerable<SurveyTemplateView>> GetAllSurveyTemplate()
        {
            var templates=_SurveyTemplates.GetAll();
            if (templates == null) return NotFound();
            return ToViews(templates);
        }

        [EnableCors]
        [HttpGet("getSurveyTemplateById/{id}")]
        public ActionResult<SurveyTemplateView> GetSurveyTemplateById(int id)
        {
            var template = _SurveyTemplates.FindOne(template => template.SurveyTemplateId == id);
            if (template == null) return NotFound();
            return ToSurveyTemplateView(template);
        }

        [EnableCors]
        [HttpGet("getSurveyTemplateByName/{name}")]
        public ActionResult<IEnumerable<SurveyTemplateView>> GetSurveyTemplateByName(string name)
        {
            var pattern = name + "(.)*";
            var templates = _SurveyTemplates.GetAll();
            List<SurveyTemplate> matches = new List<SurveyTemplate>();
            foreach(var template in templates)
            {
                if (Regex.Replace(template.Name, pattern, String.Empty)=="")
                {
                    matches.Add(template);
                }
            }
            return ToViews(matches);
        }

        [EnableCors]
        [HttpDelete("deleteSurveyTemplate/{id}")]
        public void DeleteSurveyTemplate(int id)
        {
            _SurveyTemplates.Delete(template => template.SurveyTemplateId == id);
        }

        [EnableCors]
        [HttpPatch("editSurveyTemplate/{id}")]
        public void EditSurveyTemplate(SurveyTemplateView view, int id)
        {
            SurveyTemplate oldTemplate=_SurveyTemplates.FindOne(template => template.SurveyTemplateId == id);
            oldTemplate.Name = view.Name;
            oldTemplate.Title = view.Title;
            oldTemplate.Description = view.Description;
            oldTemplate.Ending = view.Ending;
            oldTemplate.Pages = view.Pages;
            _SurveyTemplates.Delete(template => template.SurveyTemplateId == id);
            _SurveyTemplates.Insert(oldTemplate);
        }

        [EnableCors]
        [HttpPost("createSurveyTemplate")]
        public void CreatesurveyTemplate (Survey survey)
        {
            Random RandomID = new Random();
            SurveyTemplate template = SurveyToSurveyTemplate(survey);
            while (true)
            {
                template.SurveyTemplateId = RandomID.Next(1, 1000);
                if (_SurveyTemplates.FindOne(element => element.SurveyTemplateId == template.SurveyTemplateId)==null) break;
            }
            _SurveyTemplates.Insert(template);
        }


        // PRIVATE FUNCTIONS -- NOT ENDPOINTS
        private List<SurveyTemplateView> ToViews(List<SurveyTemplate> templates)
        {
            List<SurveyTemplateView> list = new List<SurveyTemplateView>();
            foreach (var template in templates)
            {
                list.Add(ToSurveyTemplateView(template));
            }
            return list;
        }

        

        private SurveyTemplateView ToSurveyTemplateView(SurveyTemplate template)
        {
            var view = new SurveyTemplateView()
            {
                SurveyTemplateId = template.SurveyTemplateId,
                CreatedSurveys=template.CreatedSurveys,
                Name = template.Name,
                Used =template.Used,
                Title = template.Title,
                Description = template.Description,
                Ending = template.Ending,
                CreateDate=template.CreateDate,
                Pages = template.Pages
            };
            return view;
        }

        private SurveyTemplate SurveyToSurveyTemplate(Survey survey)
        {
            SurveyTemplate template = new SurveyTemplate()
            {
                SurveyTemplateId = survey.SurveyId,
                CreatedSurveys = new List<int>(),
                Title = survey.Title,
                Name = "Untitled",
                Used=0,
                Description = survey.Description,
                Ending = survey.Ending,
                Pages = survey.Pages,
                CreateDate = DateTime.Now.ToString(),
                Creator = survey.Creator
            };
            return template;
        }
    }
}
