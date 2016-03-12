using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using System.Web;
using System.Web.Mvc;
using Empl.Models;

namespace Empl.Controllers
{
    public class EmployeesController : Controller
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: Employees
        public ActionResult Index()
        {
            return View();
        }

        public async Task<ActionResult> EmployeeList(){

            var employees = await db.Employees.Include(e => e.EmployeeType).ToListAsync();
            return Json(employees, JsonRequestBehavior.AllowGet);
        }

        public async Task<ActionResult> EmployeeTypeList()
        {
            var employeeTypes = db.EmployeeTypes;
            var list = await employeeTypes.ToListAsync();
            return Json(list, JsonRequestBehavior.AllowGet);
        }

 
        [HttpPost]
        public async Task<ActionResult> Edit([Bind(Include = "EmployeeId,Name,Date,EmployeeTypeId")] Employee employee)
        {
            if (ModelState.IsValid)
            {
                if (employee.EmployeeId != 0)
                {
                    db.Entry(employee).State = EntityState.Modified;
                }
                else
                {
                    db.Employees.Add(employee);
                }
                await db.SaveChangesAsync();
                Employee result = await db.Employees.Include(X=>X.EmployeeType).FirstOrDefaultAsync(X=>X.EmployeeId==employee.EmployeeId);
                if (result == null)
                {
                    return HttpNotFound();
                }
                return Json(result, JsonRequestBehavior.AllowGet);
            }
          
            return HttpNotFound();
        }

      
        public async Task<ActionResult> Delete(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Employee employee = await db.Employees.FindAsync(id);
            if (employee == null)
            {
                return HttpNotFound();
            }
            return View(employee);
        }


        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
