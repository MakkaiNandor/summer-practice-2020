using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Practice.Api.Models;
using Microsoft.EntityFrameworkCore;
using Practice.Api.Data.Repositories;
using Practice.Api.Data;

namespace Practice.Api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton(resolver => resolver.GetRequiredService<IOptions<DatabaseSettings>>().Value);
            var settings=Configuration.GetSection("DatabaseSettings").Get<DatabaseSettings>();
            services.AddTransient<IRepository<User>>(provider => new Repository<User>(settings,"UserCollection"));
            services.AddTransient<IRepository<SurveyTemplate>>(provider => new Repository<SurveyTemplate>(settings, "SurveyTemplateCollection"));
            services.AddTransient<IRepository<Survey>>(provider => new Repository<Survey>(settings, "SurveyCollection"));
            services.AddTransient<IRepository<QuestionTemplate>>(provider => new Repository<QuestionTemplate>(settings, "QuestionTemplateCollection"));
            services.AddControllers();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
