using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Practice.Api.Models;

namespace Practice.Api.Controllers
{
    [Route("teszt")]
    [ApiController]
    public class TesztController : ControllerBase
    {
        private readonly IRepository<Document> _documentRepository;
        public TesztController (IRepository<Document> documentRepository)
        {
            _documentRepository = documentRepository;
        }

        [HttpPost("insert")]
        public void insert(Document item)
        {
            _documentRepository.Insert(item);

        //return CreatedAtAction("GetTodoItem", new { id = todoItem.product_id }, todoItem);
            //return CreatedAtAction(nameof(GetProduct), new { id = item.id }, item);
        }
    }

    
}
