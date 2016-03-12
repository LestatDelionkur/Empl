using System.Web;
using System.Web.Optimization;

namespace Empl
{
    public class BundleConfig
    {
        //Дополнительные сведения об объединении см. по адресу: http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Используйте версию Modernizr для разработчиков, чтобы учиться работать. Когда вы будете готовы перейти к работе,
            // используйте средство сборки на сайте http://modernizr.com, чтобы выбрать только нужные тесты.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                 "~/Scripts/angular.js", "~/Scripts/i18n/angular-locale_ru-ru.js"));

            bundles.Add(new ScriptBundle("~/bundles/controllers")
                .Include("~/Scripts/ng/controllers.js"));

            bundles.Add(new ScriptBundle("~/bundles/angularui").Include(
//  "~/Scripts/angular-ui/ui-bootstrap.js",
"~/Scripts/angular-animate.js",
"~/Scripts/angular-ui/ui-bootstrap-tpls.js",
                    "~/Scripts/smart-table.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/ui-bootstrap-csp.css",
                      "~/Content/site.css"));
        }
    }
}
