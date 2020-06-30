using MongoDB.Bson;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;
using Practice.Api.Data;
using Practice.Api.Models;
    
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Practice.Api.Data.Repositories
{
    public interface IRepository<T> where T : Document
    {
        T FindOne(Expression<Func<T, bool>> filterExpression);
        T FindById(string id);
        void Edit(T document, Expression<Func<T, bool>> filterExpression);
        void Delete(Expression<Func<T, bool>> filterExpression);
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


        public virtual T FindOne(Expression<Func<T, bool>> filterExpression)
        {
            return _collection.Find(filterExpression).FirstOrDefault();
        }

        void IRepository<T>.Edit(T document, Expression<Func<T, bool>> filterExpression)
        {
            _collection.FindOneAndReplace(filterExpression, document);
        }

        void IRepository<T>.Delete(Expression<Func<T, bool>> filterExpression)
        {
            _collection.FindOneAndDelete(filterExpression);
        }

        public List<T> GetAll() =>
            _collection.Find(document => true).ToList();



    }
}
