using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Practice.Api.Data.Repositories;
using Practice.Api.Data;

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

        [HttpGet("getSurvey/{id}")]
        public ActionResult<Survey> GetSurveyById(int id)
        {
            var survey = _surveys.FindOne(s => s.SurveyId == id);
            if (survey == null) return NotFound();
            Survey view = new Survey()
            {
                SurveyId = survey.SurveyId,
                Title = survey.Title,
                Description = survey.Description,
                Ending = survey.Ending,
                ExpirationDate = survey.ExpirationDate,
                Status = survey.Status,
                Pages = survey.Pages
            };
            return view;
        }


        //[EnableCors]
        //[HttpGet("getAllSurvey")]
        /*[HttpGet("getMessage")]
        public string kiir()
        {
            return "{\"message\":\"Hello rofi\"}";
        }*/

        //[EnableCors]
        //[HttpGet("getSurvey/{id}")]

        //[EnableCors]
        //[HttpDelete("deleteSurvey/{id}")]

        //[EnableCors]
        //[HttpPatch("editSurvey/{id}")]

        //[EnableCors]
        //[HttpPost("createSurvey")]


    }

}
