import React from 'react'

const Navbar = () => {
    return ( 
      <nav className="navbar navbar-expand-lg bg-white">
        <div className="container-fluid">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="container text-center">
            <div className="row justify-content-md-center">
              <div className="col">
                <a href="/"><img src="/images/porousway_logo.png" height="70em"/></a>
              </div>
              <div className="col">
                <a href="/EmployeeList" className="text-decoration-none nav-item">Employees</a>
              </div>
              <div className="col">
                <a href="" className="text-decoration-none nav-item">Claims</a>
              </div>
              <div className="col">
                <a href="/Leaves" className="text-decoration-none nav-item">Leaves</a>
              </div>
              <div className="col">
                <a href="" className="text-decoration-none nav-item">Payroll</a>
              </div>
              <div className="col">
                <a className="downdown-toggle nav-item text-decoration-none" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Expiry
                </a>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="/CorporateExpiry">Company Document</a></li>
                  <li><a className="dropdown-item" href="/StaffExpiry">Staff-Related</a></li>
                  <li><a className="dropdown-item" href="#">Worker License</a></li>
                </ul>
              </div>
              <div className="col">
                <img src="/images/login.png" height="60em"/>
              </div>
            </div>
          </div>
        </div>
      </nav>
     );
}
 
export default Navbar;
