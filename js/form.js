(function(){
  document.addEventListener("DOMContentLoaded", function(event) { 
    document.addEventListener("click", function(e){
      if (e.target.className.includes("add-field")) {
        addFieldHandler(e.target)
      } else if (e.target.className.includes("add-company")) {
        addCompanyHandler(e.target)
      } else if (e.target.className.includes("add-qualification")) {
        addQualificationHandler(e.target)
      } else if (e.target.className.includes("generate")) {
        generatePdf();
      }
    });
  });

  function addFieldHandler(addMoreBtn) {
    let newElement = addMoreBtn.previousElementSibling.cloneNode();
    newElement.value = "";
    addMoreBtn.before(newElement);
  }

  function addCompanyHandler(addMoreBtn) {
    const companyTemplate = `<div class="field-wrap">
      <label class="label">Company Name</label>
      <div>
        <input type="text" class="company" placeholder="Company Name" />
      </div>
    </div>
    <div class="field-wrap">
      <label class="label">Job Title/Designation</label>
      <div>
        <input type="text" class="role" placeholder="Job Title/Designation/Role" />
      </div>
    </div>
    <div class="field-wrap">
      <label class="label">Duration</label>
      <div>
        <input type="text" class="duration" placeholder="e.g. May, 2017 - Present" />
      </div>
    </div>
    <div class="field-wrap multi-input">
      <label class="label">Responsibilities</label>
      <div>
        <input type="text" class="responsibility" placeholder="e.g. Building the architechture of the product" />
        <span class="add-more add-field">+</span>
      </div>
    </div>
    <div class="field-wrap">
      <label class="label">Technologies</label>
      <div>
        <input type="text" class="technology" placeholder="e.g. ReactJS, Redux, MongoDB" />
      </div>
    </div>
    <div class="field-wrap multi-input">
      <label class="label">Key Projects</label>
      <div>
        <input type="text" class="project" placeholder="e.g. CMS powered website" />
        <span class="add-more add-field">+</span>
      </div>
    </div>`;

    let companyElement = document.createElement('section');
    companyElement.className = "company-section";
    companyElement.innerHTML = companyTemplate;
    addMoreBtn.parentNode.before(companyElement);
  }

  function addQualificationHandler(addMoreBtn) {
    const qualificationTemplate = `<div class="field-wrap">
      <label class="label">Year</label>
      <div>
        <input type="text" class="year" placeholder="e.g. 2010" />
      </div>
    </div>
    <div class="field-wrap">
      <label class="label">Degree/Course & Specialization</label>
      <div>
        <input type="text" class="degree" placeholder="e.g Bachelor of Technology - Computer Science & Engineering" />
      </div>
    </div>
    <div class="field-wrap">
      <label class="label">University/College</label>
      <div>
        <input type="text" class="uni" placeholder="e.g. IIT Delhi" />
      </div>
    </div>`;

    let qualificationElement = document.createElement('section');
    qualificationElement.className = "qualification-section";
    qualificationElement.innerHTML = qualificationTemplate;
    addMoreBtn.parentNode.before(qualificationElement);
  }

  function valueById(id) {
    return document.getElementById(id).value;
  }

  function generatePdf() {
    let data = {};

    const ids = ["name", "email", "mobile", "linkedin", "goal", "techs", "frameworks", "misc", "ide", "os", "dob", "maritalStatus", "nationality", "passport", "currentEmployer", "currentProfile", "languages"];
    ids.forEach(id => { 
      data[id] = document.getElementById(id).value
    });

    data.companies = [];
    const companies = document.getElementsByClassName("company-section");
    Array.prototype.forEach.call(companies, company => {
      data.companies.push(getCompanyData(company));
    });

    data.qualifications = [];
    const qualifications = document.getElementsByClassName("qualification-section");
    Array.prototype.forEach.call(qualifications, qualification => {
      data.qualifications.push({
        year: qualification.querySelector(".year").value,
        degree: qualification.querySelector(".degree").value,
        uni: qualification.querySelector(".uni").value
      });
    });    

    ajax({
      method: "POST",
      url: "/getCV",
      jsonContent: true,
      data: {cvData: data},
      success: function(response) {
        window.open(window.location.origin+"/pdfDownload/"+response, "_blank");
      }
    });
  }

  function getCompanyData(company) {
    return {
      company: company.querySelector(".company").value,
      role: company.querySelector(".role").value,
      duration: company.querySelector(".duration").value,
      technology: company.querySelector(".technology").value,
      responsibilities: Array.prototype.map.call(company.querySelectorAll(".responsibility"), res => res.value),
      projects: Array.prototype.map.call(company.querySelectorAll(".project"), prj => prj.value)
    };
  }

  function ajax(options) {
    let xhr = new XMLHttpRequest();
    xhr.open(options.method, options.url);
    if (options.jsonContent) {
      xhr.setRequestHeader('Content-Type', 'application/json');
    }
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          options.success(xhr.responseText);
        } else {
          // options.error();
          // console.log('There was a problem with the request.');
        }
      }
    };
    if (options.jsonContent) {
      xhr.send(JSON.stringify(options.data));
    } else {
      xhr.send();
    }
    return xhr;
  }
})();