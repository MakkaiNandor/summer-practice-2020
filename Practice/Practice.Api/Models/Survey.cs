using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Practice.Api.Models
{
    public class Survey
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public int SurveyId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Ending { get; set; }
        public string CreateDate { get; set; }
        public string ExpirationDate { get; set; }
        public string Status { get; set; }
        public User Creator { get; set; }
        public List<Page> Pages { get; set; }
    }
}
