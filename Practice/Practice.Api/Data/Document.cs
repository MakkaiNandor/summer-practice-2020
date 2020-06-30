using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Practice.Api.Data
{
    public abstract class Document
    {

        public BsonObjectId id { get; set; }
        
    }
}
