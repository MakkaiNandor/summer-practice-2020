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
using Practice.Api.Models;
using Practice.Api.Models.Views;

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
        public ActionResult<IEnumerable<SurveyView>> GetSurveys()
        {

            var surveys = _surveys.GetAll();
            if (surveys == null) return NotFound();

            var views = ToViews(surveys);
            return views;
        }


        [EnableCors]
        [HttpGet("getSurvey/{id}")]
        public ActionResult<SurveyView> GetSurveyById(int id)
        {
            
            var survey = _surveys.FindOne(s => s.SurveyId == id);
            if (survey == null) return NotFound();
            return ToSurveyView(survey);
        }

        [EnableCors]
        [HttpPost("createSurvey")]
        public void CreateSurvey(Survey NewSurvey)
        {
            Random RandomID = new Random();

            while(true)
            {
                NewSurvey.SurveyId = RandomID.Next(1, 1000);
                if (_surveys.FindOne(survey => survey.SurveyId == NewSurvey.SurveyId) == null) break;
            }
             _surveys.Insert(NewSurvey);
        }

        [EnableCors]
        [HttpDelete("deleteSurvey/{id}")]
        public void DeleteSurvey(int id)
        {
            _surveys.Delete(s => s.SurveyId == id);
        }

        [EnableCors]
        [HttpPatch("editSurvey/{id}")]
        public void EditSurvey(SurveyView view, int id)
        {
            var oldSurvey = _surveys.FindOne(variable => variable.SurveyId == id);
            if (oldSurvey == null) return;
            _surveys.Delete(s => s.SurveyId == id);
            var newSurvey = SurveyViewToSurvey(view, oldSurvey);
            _surveys.Insert(newSurvey);
        }

        

        // PRIVATE FUNCTIONS -- NOT ENDPOINTS
        private List<SurveyView> ToViews(List<Survey> surveys)
        {
            List<SurveyView> list = new List<SurveyView>();
            foreach (var survey in surveys)
            {
                
                list.Add(ToSurveyView(survey));
            }
            return list;
        }

        private SurveyView ToSurveyView(Survey survey)
        {
            var view = new SurveyView()
            {
                SurveyId = survey.SurveyId,
                Title = survey.Title,
                Description = survey.Description,
                Ending = survey.Ending,
                CreateDate=survey.CreateDate,
                ExpirationDate = survey.ExpirationDate,
                Status = survey.Status,
                PersonalData = survey.PersonalData,
                Pages = survey.Pages
            };
            return view;
        }

        private Survey SurveyViewToSurvey (SurveyView view, Survey oldSurvey)
        {
            oldSurvey.Title = view.Title;
            oldSurvey.Description = view.Description;
            oldSurvey.Ending = view.Ending;
            oldSurvey.ExpirationDate = view.ExpirationDate;
            oldSurvey.Status = view.Status;
            oldSurvey.Pages = view.Pages;
            return oldSurvey;
        }
    }

}
