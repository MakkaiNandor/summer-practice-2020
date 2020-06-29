using MongoDB.Bson;
using MongoDB.Driver;
using Practice.Api.Data;
using Practice.Api.Models;
    
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Practice.Api.Data.Repositories
{
    public interface IRepository<T> where T : Document
    {
        T FindById(string id);
        void Edit(T survey);
        void Delete(T survey);
        T Insert(T survey);
        public List<T> GetAll();

    }

    public class Repository<T> : IRepository<T> where T : Document
    {
        private readonly IMongoCollection<T> _collection;

        public Repository(DatabaseSettings settings, string CollectionName)
        {

            var database = new MongoClient(settings.ConnectionString).GetDatabase(settings.DatabaseName);
            //_collection = database.GetCollection<TDocument>(GetCollectionName(typeof(TDocument)));
            _collection = database.GetCollection<T>(CollectionName);
        }

        private protected string GetCollectionName(Type documentType)
        {
            return ((BsonCollectionAttribute)documentType.GetCustomAttributes(
                    typeof(BsonCollectionAttribute),
                    true)
                .FirstOrDefault())?.CollectionName;
        }


        T IRepository<T>.Insert(T survey)
        {
            _collection.InsertOne(survey);
            return survey;
        }

        T IRepository<T>.FindById(string id)
        {
            var objectId = new ObjectId(id);
            var filter = Builders<T>.Filter.Eq(doc => doc.id, objectId);
            return _collection.Find(filter).SingleOrDefault();
        }

        void IRepository<T>.Edit(T document)
        {
            var filter = Builders<T>.Filter.Eq(doc => doc.id, document.id);
            _collection.FindOneAndReplace(filter, document);
        }
        void IRepository<T>.Delete(T document)
        {
            var filter = Builders<T>.Filter.Eq(doc => doc.id, document.id);
            _collection.FindOneAndDelete(filter);
        }

        public List<T> GetAll() =>
            _collection.Find(document => true).ToList();



    }
}
