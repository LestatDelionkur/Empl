using Empl.Models;

namespace Empl.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<Empl.Models.ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
        }

        protected override void Seed(Empl.Models.ApplicationDbContext context)
        {
            context.EmployeeTypes.AddOrUpdate(
              p => p.Title,
              new EmployeeType { Title = "Разработчик" },
              new EmployeeType { Title = "Тестировщик" },
              new EmployeeType { Title = "Менеджер" }
            );
            
        }
    }
}
