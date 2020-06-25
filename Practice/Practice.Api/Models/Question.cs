using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Practice.Api.Models
{
    public class Question
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public int QuestionId {get; set;}
        public string Label { get; set; }
        public string Type { get; set; }
        public List<Answer> Answers { get; set; }
    }
}
