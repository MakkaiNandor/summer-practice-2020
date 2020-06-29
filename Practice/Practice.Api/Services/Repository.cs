using Microsoft.VisualBasic;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Threading.Tasks;

namespace Practice.Api.Models
{
    public class Repository<TDocument> : IRepository<TDocument> where TDocument : Document
    {
        private readonly IMongoCollection<TDocument> _collection;

        public Repository(DatabaseSettings settings,string CollectionName)
        {
            
            var database = new MongoClient(settings.ConnectionString).GetDatabase(settings.DatabaseName);
            //_collection = database.GetCollection<TDocument>(GetCollectionName(typeof(TDocument)));
            _collection = database.GetCollection<TDocument>(CollectionName);
        }

        private protected string GetCollectionName(Type documentType)
        {
            return ((BsonCollectionAttribute)documentType.GetCustomAttributes(
                    typeof(BsonCollectionAttribute),
                    true)
                .FirstOrDefault())?.CollectionName;
        }


        TDocument IRepository<TDocument>.Insert(TDocument survey)
        {
            _collection.InsertOne(survey);
            return survey;
        }

        TDocument IRepository<TDocument>.FindById(string id)
        {
            var objectId = new ObjectId(id);
            var filter = Builders<TDocument>.Filter.Eq(doc => doc.id, objectId);
            return _collection.Find(filter).SingleOrDefault();
        }

        void IRepository<TDocument>.Edit(TDocument document)
        {
            var filter = Builders<TDocument>.Filter.Eq(doc => doc.id, document.id);
            _collection.FindOneAndReplace(filter, document);
        }
        void IRepository<TDocument>.Delete(TDocument document)
        {
            var filter = Builders<TDocument>.Filter.Eq(doc => doc.id, document.id);
            _collection.FindOneAndDelete(filter);
        }

        public List<TDocument> GetAll() =>
            _collection.Find(document => true).ToList();



    }

    public interface IRepository<TDocument> where TDocument : Document
    {
        TDocument FindById(string id);
        void Edit(TDocument survey);
        void Delete(TDocument survey);
        TDocument Insert(TDocument survey);
        public List<TDocument> GetAll();

    }
}