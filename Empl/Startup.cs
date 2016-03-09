using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Empl.Startup))]
namespace Empl
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
