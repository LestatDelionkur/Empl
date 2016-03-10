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
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            context.EmployeeTypes.AddOrUpdate(
              p => p.Title,
              new EmployeeType { Title = "Разработчик" },
              new EmployeeType { Title = "Тестировщик" },
              new EmployeeType { Title = "Менеджер" }
            );
            //
        }
    }
}
