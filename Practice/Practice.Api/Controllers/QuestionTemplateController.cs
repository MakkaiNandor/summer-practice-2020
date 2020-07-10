using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Practice.Api.Data;
using Practice.Api.Data.Repositories;
using Microsoft.Data.SqlClient.DataClassification;
using Practice.Api.Models.Views;

namespace Practice.Api.Controllers
{
    [Route("QuestionTemplate")]
    [ApiController]
    public class QuestionTemplateController : ControllerBase
    {
        private readonly IRepository<QuestionTemplate> _templates;

        public QuestionTemplateController(IRepository<QuestionTemplate> templates)
        {
            _templates = templates;
        }

        [EnableCors]
        [HttpGet("getAllQuestionTemplates")]
        public ActionResult<IEnumerable<QuestionTemplateView>> GetAllQuestionTemplate()
        {
            return ToViews(_templates.GetAll());
        }

        [EnableCors]
        [HttpGet("getQuestionTemplateById/{id}")]
        public ActionResult<QuestionTemplateView> GetQuestionTemplateById(int id)
        {
            return ToQuestionTemplateView(_templates.FindOne(template => template.QuestionTemplateId == id));
        }

        [EnableCors]
        [HttpDelete("deleteQuestionTemplate/{id}")]
        public void DeleteQuestionTemplate(int id)
        {   
            _templates.Delete(template => template.QuestionTemplateId == id);
        }

        [EnableCors]
        [HttpPatch("editQuestionTemplate/{id}")]
        public void EditQuestionTemplate(QuestionTemplateView view, int id)
        {
            QuestionTemplate oldTemplate = _templates.FindOne(template => template.QuestionTemplateId == id);
            if (oldTemplate == null) return;
            oldTemplate.Label = view.Label;
            oldTemplate.Type = view.Type;
            oldTemplate.Answers = view.Answers;

            _templates.Delete(template => template.QuestionTemplateId == id);
            _templates.Insert(oldTemplate);
        }

        [EnableCors]
        [HttpPost("createQuestionTemplate")]
        public void CreateQuestionTemplate(Question question)
        {
            QuestionTemplate template = new QuestionTemplate()
            {
                QuestionTemplateId = GenerateTemplateId(),
                Used = 0,
                Label = question.Label,
                Type = question.Type,
                CreateDate = DateTime.Now.ToString(),
                Answers = question.Answers
            };
            Random RandomID = new Random();
            while (true)
            {
                template.QuestionTemplateId = RandomID.Next(1, 1000);
                if (_templates.FindOne(item => item.QuestionTemplateId == template.QuestionTemplateId) == null) break;
            }

            _templates.Insert(template);
        }

        //PRIVATE FUNCTIONS
        private List<QuestionTemplateView> ToViews(List<QuestionTemplate> templates)
        {
            List<QuestionTemplateView> list = new List<QuestionTemplateView>();
            foreach (var template in templates)
            {
                list.Add(ToQuestionTemplateView(template));
            }
            return list;
        }

        private QuestionTemplateView ToQuestionTemplateView(QuestionTemplate template)
        {
            QuestionTemplateView view = new QuestionTemplateView()
            {
                QuestionTemplateId = template.QuestionTemplateId,
                Used = template.Used,
                Label = template.Label,
                Type = template.Type,
                CreateDate = template.CreateDate,
                Answers = template.Answers
            };
            return view;
        }

        private int GenerateTemplateId()
        {
            if (_templates.GetAll()== null  ) return 1;
            int max = 0;
            foreach (var template in _templates.GetAll())
            {
                if (template.QuestionTemplateId > max) max = template.QuestionTemplateId;
            }
            return max + 1;
        }
        
    }
}
