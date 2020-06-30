using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Practice.Api.Data.Repositories;
using Practice.Api.Data;
using MongoDB.Driver;
using Microsoft.CodeAnalysis.Differencing;

namespace Practice.Api.Controllers
{
    [Route("Survey")]
    [ApiController]
    public class SurveyController : ControllerBase
    {

        private readonly IRepository<Survey> _surveys;


        public SurveyController(IRepository<Survey> surveys)
        {
            _surveys = surveys;
        }

        [EnableCors]
        [HttpGet("getAllSurvey")]
        public ActionResult<IEnumerable<Survey>> GetSurveys()
        {
            var temp = _surveys.GetAll();
            if (temp == null) return NotFound();
            return temp;
        }


        [EnableCors]
        [HttpGet("getSurvey/{id}")]
        public ActionResult<Survey> GetSurveyById(int id)
        {

            var survey = _surveys.FindOne(s => s.SurveyId == id);
            if (survey == null) return NotFound();
            return survey;
        }


        [EnableCors]
        [HttpPost("createSurvey")]
        public void CreateSurvey(Survey survey)
        {
            _surveys.Insert(survey);
        }

        [EnableCors]
        [HttpDelete("deleteSurvey/{id}")]
        public void DeleteSurvey(int id)
        {
            _surveys.Delete(s => s.SurveyId == id);
        }

        [EnableCors]
        [HttpPatch("editSurvey/{id}")]
        public void EditSurvey(Survey survey,int id)
        {
            _surveys.Delete(s=> s.SurveyId == id);
            _surveys.Insert(survey);
        }

        [EnableCors]
        [HttpPost("sendAnswer/S{SurveyId}P{PageNumber}Q{QuestionId}")]
        public void SendAnswer(Answer answer, int SurveyId,int PageNumber, int QuestionId)
        {
            var temp =_surveys.FindOne(s => s.SurveyId == SurveyId);
            temp.Pages.Find(p => p.PageNumber == PageNumber).Questions.Find(q => q.QuestionId == QuestionId).Answers.Add(answer);
            EditSurvey(temp, SurveyId);
        }

    }

}
