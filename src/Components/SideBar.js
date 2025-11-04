import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, Lock } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import lock from './lock.png';

const styles = {
  sidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '310px',
    height: '100vh',
    backgroundColor: 'white',
    color: '#a6a8ab',
    padding: '20px',
    overflowY: 'auto',
    zIndex: 1000,
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '30px',
    paddingBottom: '15px',
    borderBottom: '1px solid #f0f0f0',
    color: '#ee3f65',
  },
  menuList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  menuItem: {
    marginBottom: '8px',
  },
  menuButton: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '12px 15px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#a6a8ab',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'all 0.2s',
    textDecoration: 'none',
  },
  activeMenuButton: {
    backgroundColor: '#ffedf1',
    color: '#ee3f65',
  },
  chevron: {
    marginLeft: 'auto',
    color: '#a6a8ab',
  },
  subMenu: {
    listStyle: 'none',
    padding: '8px 0 8px 46px',
    margin: 0,
  },
  nestedSubMenu: {
    listStyle: 'none',
    padding: '8px 0 8px 20px',
    margin: 0,
  },
  subMenuItem: {
    margin: '8px 0',
  },
  link: {
    color: '#a6a8ab',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 0',
    transition: 'color 0.2s',
    width: '100%',
  },
  lockIcon: {
    width: '16px',
    height: '16px',
    opacity: 0.8,
    marginLeft: '8px',
  },
  warningButton: {
    color: '#dc2626',
  }
};



const Sidebar = () => {
  const [expandedModules, setExpandedModules] = useState({});
  const [expandedSubModules, setExpandedSubModules] = useState({});
  let user = useSelector(selectUser); 
  user = user.user;

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const toggleSubModule = (e, moduleId) => {
    e.preventDefault();
    setExpandedSubModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/logout', {
        method: 'POST',
        credentials: 'include', // Ensures cookies are sent with the request
      });
  
      if (!response.ok) {
        throw new Error('Logout failed');
      }
  
      const result = await response.json();
      console.log(result.message); // Logs "Logged out successfully"
  
      // Perform any necessary cleanup (e.g., redirect to login page)
      window.location.href = '/login'; // Redirect to login page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const hasPermission = (permissionModule, permission) => {
    return user && 
           user.permissions && 
           user.permissions[permissionModule] && 
           user.permissions[permissionModule].includes(permission);
  };
  
  // Create a reusable NavLink component to maintain consistent styling
  const NavLink = ({ to, label, permissionModule, permission }) => {
    let hasAccess = hasPermission(permissionModule, permission);
  
    return (
      <Link 
        to={to} 
        style={styles.link}
        onMouseEnter={(e) => e.target.style.color = '#ee3f65'}
        onMouseLeave={(e) => e.target.style.color = '#a6a8ab'}
      >
        <span>{label}</span>
        {!hasAccess && <img src={lock} alt="locked" style={styles.lockIcon} />}
      </Link>
    );
  };

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.title}>Menu</h2>
      <ul style={styles.menuList}>
        {/* ART Banks section */}
        <li style={styles.menuItem}>
          <button
            onClick={() => toggleModule("art-banks")}
            style={{
              ...styles.menuButton,
              ...(expandedModules["art-banks"] ? styles.activeMenuButton : {})
            }}
          >
            Manage ART Banks
            <span style={styles.chevron}>
              {expandedModules["art-banks"] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          </button>
          {expandedModules["art-banks"] && (
            <ul style={styles.subMenu}>
              <li style={styles.subMenuItem}>
                <NavLink 
                  to="/add-art-bank" 
                  label="Add ART Bank"
                  permissionModule="artBankManagement"
                  permission="add art bank"
                />
              </li>
              <li style={styles.subMenuItem}>
                <NavLink 
                  to="/view-art-banks" 
                  label="View ART Bank"
                  permissionModule="artBankManagement"
                  permission="view art bank"
                />
              </li>
            </ul>
          )}
        </li>

        {/* Donor Requirement section */}
        <li style={styles.menuItem}>
          <button
            onClick={() => toggleModule("donor-requirements")}
            style={{
              ...styles.menuButton,
              ...(expandedModules["donor-requirements"] ? styles.activeMenuButton : {})
            }}
          >
            Manage Donor Requirement
            <span style={styles.chevron}>
              {expandedModules["donor-requirements"] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          </button>
          {expandedModules["donor-requirements"] && (
            <ul style={styles.subMenu}>
              <li style={styles.subMenuItem}>
                <button
                  onClick={(e) => toggleSubModule(e, "raise-requisition")}
                  style={{
                    ...styles.link,
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#ee3f65'}
                  onMouseLeave={(e) => e.target.style.color = '#a6a8ab'}
                >
                  <span>Raise Requisition</span>
                  <span style={styles.chevron}>
                    {expandedSubModules["raise-requisition"] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </span>
                </button>
                {expandedSubModules["raise-requisition"] && (
                  <ul style={styles.nestedSubMenu}>
                    <li style={styles.subMenuItem}>
                      <NavLink 
                        to="/raise-requisition/sperm"
                        label="Sperm"
                        permissionModule="requisitionManagement"
                        permission="raise requisition sperm"
                      />
                    </li>
                    <li style={styles.subMenuItem}>
                      <NavLink 
                        to="/raise-requisition/ocyte"
                        label="Oocyte"
                        permissionModule="requisitionManagement"
                        permission="raise requisition oocyte"
                      />
                    </li>
                    <li style={styles.subMenuItem}>
                      <NavLink 
                        to="/raise-requisition/surrogate"
                        label="Surrogate"
                        permissionModule="requisitionManagement"
                        permission="raise requisition surrogate"
                      />
                    </li>
                  </ul>
                )}
              </li>
              <li style={styles.subMenuItem}>
                <NavLink 
                  to="/view-requisitions/sperm" 
                  label="View Sperm Requisitions"
                  permissionModule="requisitionManagement"
                  permission="view sperm requisitions"
                />
              </li>
              <li style={styles.subMenuItem}>
                <NavLink 
                  to="/view-requisitions/ocyte" 
                  label="View Oocyte Requisitions"
                  permissionModule="requisitionManagement"
                  permission="view oocyte requisitions"
                />
              </li>
              <li style={styles.subMenuItem}>
                <NavLink 
                  to="/view-requisitions/surrogate" 
                  label="View Surrogate Requisitions"
                  permissionModule="requisitionManagement"
                  permission="view surrogate requisitions"
                />
              </li>
            </ul>
          )}
        </li>

        {/* Sperm Samples Management */}
        <li style={styles.menuItem}>
          <button
            onClick={() => toggleModule("sperm-samples")}
            style={{
              ...styles.menuButton,
              ...(expandedModules["sperm-samples"] ? styles.activeMenuButton : {})
            }}
          >
            Manage Sperm Samples
            <span style={styles.chevron}>
              {expandedModules["sperm-samples"] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          </button>
          {expandedModules["sperm-samples"] && (
            <ul style={styles.subMenu}>
              <li style={styles.subMenuItem}>
                <NavLink 
                  to="/add-sample/sperm"
                  label="Add Sample"
                  permissionModule="spermSampleManagement"
                  permission="add sperm sample"
                />
              </li>
              <li style={styles.subMenuItem}>
                <NavLink 
                  to="/receive-sample/sperm"
                  label="Receive Sample"
                  permissionModule="spermSampleManagement"
                  permission="receive sperm sample"
                />
              </li>
              <li style={styles.subMenuItem}>
                <NavLink 
                  to="/issue-sample/sperm"
                  label="Issue Sample"
                  permissionModule="spermSampleManagement"
                  permission="issue sperm sample"
                />
              </li>
              <li style={styles.subMenuItem}>
                <NavLink 
                  to="/delete-sperm-sample"
                  label="Delete Sample"
                  permissionModule="spermSampleManagement"
                  permission="delete sperm sample"
                />
              </li>
              <li style={styles.subMenuItem}>
                <button
                  onClick={(e) => toggleSubModule(e, "view-samples")}
                  style={{
                    ...styles.link,
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#ee3f65'}
                  onMouseLeave={(e) => e.target.style.color = '#a6a8ab'}
                >
                  <span>View Samples</span>
                  <span style={styles.chevron}>
                    {expandedSubModules["view-samples"] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </span>
                </button>
                {expandedSubModules["view-samples"] && (
                  <ul style={styles.nestedSubMenu}>
                    <li style={styles.subMenuItem}>
                      <NavLink 
                        to="/view-received-sperm-samples"
                        label="View Received Samples"
                        permissionModule="spermSampleManagement"
                        permission="view received sperm samples"
                      />
                    </li>
                    <li style={styles.subMenuItem}>
                      <NavLink 
                        to="/view-issued-sperm-samples"
                        label="View Issued Samples"
                        permissionModule="spermSampleManagement"
                        permission="view issued sperm samples"
                      />
                    </li>
                    <li style={styles.subMenuItem}>
                      <NavLink 
                        to="/view-collected-sperm-samples"
                        label="View Collected Samples"
                        permissionModule="spermSampleManagement"
                        permission="view collected sperm samples"
                      />
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          )}
        </li>

        {/* Manage Oocyte Donors */}
        <li style={styles.menuItem}>
          <button
            onClick={() => toggleModule("oocyte-donors")}
            style={{
              ...styles.menuButton,
              ...(expandedModules["oocyte-donors"] ? styles.activeMenuButton : {})
            }}
          >
            Manage Oocyte Donors
            <span style={styles.chevron}>
              {expandedModules["oocyte-donors"] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          </button>
          {expandedModules["oocyte-donors"] && (
            <ul style={styles.subMenu}>
              <li style={styles.subMenuItem}>
                <NavLink 
                  to="/recruit-donor/oocyte"
                  label="Recruit Donor"
                  permissionModule="oocyteDonorManagement"
                  permission="recruit oocyte donor"
                />
              </li>
              <li style={styles.subMenuItem}>
                <NavLink 
                  to="/receive-donor/oocyte"
                  label="Receive Donor"
                  permissionModule="oocyteDonorManagement"
                  permission="receive oocyte donor"
                />
              </li>
              <li style={styles.subMenuItem}>
                <NavLink 
                  to="/allocate-donor/oocyte"
                  label="Allocate Donor"
                  permissionModule="oocyteDonorManagement"
                  permission="allocate oocyte donor"
                />
              </li>
              <li style={styles.subMenuItem}>
                <NavLink 
                  to="/delete-oocyte-donor"
                  label="Delete Oocyte Donor"
                  permissionModule="oocyteDonorManagement"
                  permission="delete oocyte donor"
                />
              </li>
              <li style={styles.subMenuItem}>
                <button
                  onClick={(e) => toggleSubModule(e, "view-donors")}
                  style={{
                    ...styles.link,
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#ee3f65'}
                  onMouseLeave={(e) => e.target.style.color = '#a6a8ab'}
                >
                  <span>View Donors</span>
                  <span style={styles.chevron}>
                    {expandedSubModules["view-donors"] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </span>
                </button>
                {expandedSubModules["view-donors"] && (
                  <ul style={styles.nestedSubMenu}>
                    <li style={styles.subMenuItem}>
                      <NavLink 
                        to="/view-received-oocyte-donors"
                        label="View Received Donors"
                        permissionModule="oocyteDonorManagement"
                        permission="view received oocyte donors"
                      />
                    </li>
                    <li style={styles.subMenuItem}>
                      <NavLink 
                        to="/view-recruited-oocyte-donors"
                        label="View Recruited Donors"
                        permissionModule="oocyteDonorManagement"
                        permission="view recruited oocyte donors"
                      />
                    </li>
                    <li style={styles.subMenuItem}>
                      <NavLink 
                        to="/view-allocated-oocyte-donors"
                        label="View Allocated Donors"
                        permissionModule="oocyteDonorManagement"
                        permission="view allocated oocyte donors"
                      />
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          )}
        </li>
        
        {/* Manage Surrogates */}
        <li style={styles.menuItem}>
          <button
            onClick={() => toggleModule("surrogates")}
            style={{
              ...styles.menuButton,
              ...(expandedModules["surrogates"] ? styles.activeMenuButton : {})
            }}
          >
            Manage Surrogates
            <span style={styles.chevron}>
              {expandedModules["surrogates"] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          </button>
          {expandedModules["surrogates"] && (
            <ul style={styles.subMenu}>
              <li style={styles.subMenuItem}>
                <NavLink 
                  to="/recruit-surrogate"
                  label="Recruit Surrogate"
                  permissionModule="surrogateManagement"
                  permission="recruit surrogate"
                />
              </li>
              <li style={styles.subMenuItem}>
                <NavLink 
                  to="/receive-surrogate"
                  label="Receive Surrogate"
                  permissionModule="surrogateManagement"
                  permission="receive surrogate"
                />
              </li>
              <li style={styles.subMenuItem}>
                <NavLink 
                  to="/allocate-surrogate"
                  label="Allocate Surrogate"
                  permissionModule="surrogateManagement"
                  permission="allocate surrogate"
                />
              </li>
              <li style={styles.subMenuItem}>
                <NavLink 
                  to="/delete-surrogate"
                  label="Delete Surrogate"
                  permissionModule="surrogateManagement"
                  permission="delete surrogate"
                />
              </li>
              <li style={styles.subMenuItem}>
                <button
                  onClick={(e) => toggleSubModule(e, "view-surrogates")}
                  style={{
                    ...styles.link,
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#ee3f65'}
                  onMouseLeave={(e) => e.target.style.color = '#a6a8ab'}
                >
                  <span>View Surrogates</span>
                  <span style={styles.chevron}>
                    {expandedSubModules["view-surrogates"] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </span>
                </button>
                {expandedSubModules["view-surrogates"] && (
                  <ul style={styles.nestedSubMenu}>
                    <li style={styles.subMenuItem}>
                      <NavLink 
                        to="/view-received-surrogates"
                        label="View Received Surrogates"
                        permissionModule="surrogateManagement"
                        permission="view received surrogates"
                      />
                    </li>
                    <li style={styles.subMenuItem}>
                      <NavLink 
                        to="/view-recruited-surrogates"
                        label="View Recruited Surrogates"
                        permissionModule="surrogateManagement"
                        permission="view recruited surrogates"
                      />
                    </li>
                    <li style={styles.subMenuItem}>
                      <NavLink 
                        to="/view-allocated-surrogates"
                        label="View Allocated Surrogates"
                        permissionModule="surrogateManagement"
                        permission="view allocated surrogates"
                      />
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          )}
        </li>

        {/* Reports */}
        {/* <li style={styles.menuItem}>
          <button 
            style={styles.menuButton}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#ffedf1';
              e.target.style.color = '#ee3f65';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#a6a8ab';
            }}
          >
            Reports
          </button>
        </li> */}
        
        {/* Manage Users */}
        <li style={styles.menuItem}>
          <button
            onClick={() => toggleModule("manage-users")}
            style={{
              ...styles.menuButton,
              ...(expandedModules["manage-users"] ? styles.activeMenuButton : {})
            }}
          >
            Manage Users
            <span style={styles.chevron}>
              {expandedModules["manage-users"] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          </button>
          {expandedModules["manage-users"] && (
            <ul style={styles.subMenu}>
              <li style={styles.subMenuItem}>
                <NavLink 
                  to="/manage-users"
                  label="Manage Users"
                  permissionModule="manageUsers"
                  permission="view users"
                />
              </li>
              <li style={styles.subMenuItem}>
                <NavLink 
                  to="/create-user"
                  label="Create User"
                  permissionModule="manageUsers"
                  permission="add user"
                />
              </li>
            </ul>
          )}
        </li>
        
        {/* Logout */}
        <li style={styles.menuItem}>
          <button 
            onClick={handleLogout}
            style={styles.menuButton}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#ffedf1';
              e.target.style.color = '#ee3f65';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#a6a8ab';
            }}
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;