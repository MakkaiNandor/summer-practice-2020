using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Practice.Api.Data.Repositories;
using Practice.Api.Data;
using Microsoft.AspNetCore.Cors;
using Practice.Api.Models.Views;
using System.Runtime.InteropServices.ComTypes;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.Extensions.DependencyInjection;

namespace Practice.Api.Controllers
{
    [Route("Answer")]
    [ApiController]
    public class AnswerController : ControllerBase
    {
        private readonly IRepository<SentAnswer> _answers;

        public AnswerController(IRepository<SentAnswer> answers)
        {
            _answers = answers;
        }


        [EnableCors]
        [HttpPost("sendPersonalData/{id}")]
        public void SendPersonalData(SentPersonalData data, int id)
        {
            
            SentAnswer existingAnswer = _answers.FindOne(ans => ans.SurveyId == id);
            if (existingAnswer == null)
            {
                //Survey not exists
                SentAnswer answer = new SentAnswer()
                {
                    SurveyId = id,
                    CompletedCounter = 0,
                    LeftCounter = 0,
                    Answers = new List<SentPersonalData_Answers>()
                };
                SentPersonalData_Answers PData = new SentPersonalData_Answers()
                {
                    PersonalData = new SentPersonalData()
                    {
                        Age = data.Age,
                        Name = data.Name,
                        Email = data.Email,
                        Gender = data.Gender
                    },
                    Pages = new List<Page>()
                };
                answer.Answers.Add(PData);
                _answers.Insert(answer);
            }
            
            else
            {
                //Survey Exists
                var existingData = existingAnswer.Answers.Find(answer => answer.PersonalData.Email == data.Email);
                if (existingData==null)
                {
                    //Person not exists
                    existingAnswer.Answers.Add(
                          new SentPersonalData_Answers()
                         {
                             PersonalData = new SentPersonalData()
                             {
                                 Age = data.Age,
                                 Name = data.Name,
                                 Email = data.Email,
                                 Gender = data.Gender
                             },
                             Pages = new List<Page>()
                         });
                    _answers.Delete(answer => answer.SurveyId == id);
                    _answers.Insert(existingAnswer);
                }
                else
                {
                    
                    return;
                }
                
            }
        }

        [EnableCors]
        [HttpPost("sendAnswer/{id}")]
        public void SendAnswer(SentPersonalData_Answers Pdata_Answer, int id)
        {
            var existingAnswer = _answers.FindOne(ans => id == ans.SurveyId);
            if (existingAnswer == null)
            {
                //Survey not exists
                return;
            }
            else
            {
                //Survey Exists
                var oldPage = _answers.FindOne(ans => ans.SurveyId == id).Answers.Find(ans => ans.PersonalData.Email == Pdata_Answer.PersonalData.Email).Pages.Find(page => page.PageNumber == Pdata_Answer.Pages[0].PageNumber);
                if (oldPage!=null)
                {
                    //Oldpage Exists
                    List<Page> PageList = existingAnswer.Answers.Find(answer => answer.PersonalData.Email == Pdata_Answer.PersonalData.Email).Pages;
                    foreach( var page in PageList)
                    {
                        if (page.PageNumber== Pdata_Answer.Pages[0].PageNumber)
                        {
                            PageList.Remove(page);
                            break;
                        }
                    }
                    existingAnswer.Answers.Find(answer => answer.PersonalData.Email == Pdata_Answer.PersonalData.Email).Pages = PageList;
                }
                existingAnswer.Answers.Find(answer => answer.PersonalData.Email == Pdata_Answer.PersonalData.Email).Pages.Add(Pdata_Answer.Pages[0]);
                _answers.Delete(answer => answer.SurveyId == id);
                _answers.Insert(existingAnswer);


            }
              
        }

        [EnableCors]
        [HttpGet("getReport/{id}")]
        public ActionResult<ReportView> GetReport(int id)
        {
            var existingAnswer = _answers.FindOne(ans => id == ans.SurveyId);
            if (existingAnswer == null) return new ReportView()
            {
                CompletedCounter = 0,
                LeftCounter = 0
            };
            return new ReportView()
            {
                CompletedCounter = existingAnswer.CompletedCounter,
                LeftCounter = existingAnswer.LeftCounter
            };
        }

        [EnableCors]
        [HttpPatch("setCounters/{id}")]
        public void setCounters(ReportView newCounters,int id)
        {
            var answer=_answers.FindOne(answer => answer.SurveyId == id);
            if (answer == null) return;
            answer.LeftCounter = newCounters.LeftCounter;
            answer.CompletedCounter = newCounters.CompletedCounter;
            _answers.Delete(answer => answer.SurveyId == id);
            _answers.Insert(answer);
        }

        [EnableCors]
        [HttpGet("getAllAnswers")]
        public ActionResult<IEnumerable<SentAnswerView>> GetAllAnswers()
        {
            return ToViews(_answers.GetAll());
        }

        [EnableCors]
        [HttpGet("getAnswerById/{id}")]
        public ActionResult<SentAnswerView> GetAnswerById(int id)
        {
            var answer = _answers.FindOne(ans => ans.SurveyId == id);
            if (answer == null) return null;
            return ToView(answer);
        }


        //PRIVATE FUNCTIONS

        private SentAnswerView ToView(SentAnswer answer)
        {
            var view = new SentAnswerView()
            {
                SurveyId = answer.SurveyId,
                CompletedCounter=answer.CompletedCounter,
                LeftCounter=answer.LeftCounter,
                Answers=answer.Answers
            };

            return view;
        }

        private List<SentAnswerView> ToViews(List<SentAnswer> answers)
        {
            var list = new List<SentAnswerView>();
            foreach(var answer in answers)
            {
                list.Add(ToView(answer));
            }
            return list;
        }
    }
}
