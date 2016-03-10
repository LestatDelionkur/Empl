using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Empl.Models
{
    public class Employee
    {
        [Key]
        public long EmployeeId { get; set; }
      
        [Required]
        [Display(Name = "Имя")]
        public string Name { get; set; }

        public DateTime Date { get; set; }
        public long EmployeeTypeId { get; set; }
        public EmployeeType EmployeeType { get; set; }
    }

  
}