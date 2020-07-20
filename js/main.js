//--------------------------------------------------------
//--------------------------------------------------------
//    
//    TABLE OF CONTENTS:
//    TIMESAVER MAIN LOGIC
//    
//    FUNC 1 ** Log in & Log out
//        1A ** Log In Main
//        1B ** Validates username and password
//        1C ** Log Out
//        1D ** Page Access Control
//
//    FUNC 2 ** User Name and Title & Menu Directory
//        2A ** User Name / Title
//        2B ** Main Menu Buttons
//        2C ** Admin Menu
//        2D ** User Menu
//        2E ** Manager Menu
//        2F ** Creates Buttons
//
//    FUNC 3 ** Create / Edit / Delete Objects
//        3A ** Creates 'currentUser'
//        3B ** Deletes 'currentUser'
//        3C ** Creates 'userList' records
//        3D ** Deletes 'userList' records
//        3E ** Sets Default 'userList' records
//
//
//--------------------------------------------------------
//--------------------------------------------------------




//--------------------------------------------------------
//--------------------------------------------------------
//  FUNC 1
//  Log In & Log Out
//--------------------------------------------------------
//--------------------------------------------------------



//--------------------------------------------------------
//  1A
//  Log In Main
//--------------------------------------------------------

//  On log in form submit
function logInValidation() {
    //value of true if username and 
    //var loginSuccess = valUserName();
    
    if (typeof(Storage) == "undefined") {
        alert("Your browser does not support HTML5 local storage. Try upgrading.");
    }
    else {
//        if (document.getElementById("logUser").value == "Admin" && document.getElementById("logPass").value == "1234") {
//            
//            //creates current user object
//            createCurrUser();
//            
//        }
        if (valNamePass($('#logOrg').val(), $('#logUser').val(), $('#logPass').val())) {
            alert("Successfully logged in.");   
        }
        else {
            alert("Incorrect Username or Password, please try again");
            document.getElementById("logPass").value = "";
            return false;
        }
    }
}



//--------------------------------------------------------
//  1B
//  Validates Username and Password
//--------------------------------------------------------

//called by the main
function valNamePass(organization, username, password) {
    
    var userList = JSON.parse(localStorage.getItem("userList"));
    
    for (var i = 0; i < userList.length; i++) {
        var user = userList[i];
        if (user.organization == organization && user.username == username && user.password == password){
            createCurrUser(user);
            return true;
        }
    }
    
}


//--------------------------------------------------------
//  1C
//  Log Out
//--------------------------------------------------------

//nav logout button
function logOut() {
    
    deleteCurrUser();
    
    //alerts successful
    alert("Successfully Logged Out.");
}



//--------------------------------------------------------
//  1D
//  Page Access Control
//--------------------------------------------------------

//checks page access privileges
function checkPrivilege(filename) {
    
    //loads current user from local storage
    var user = JSON.parse(localStorage.getItem("currentUser"));
    
    //if no user, denies access
    if (user == null) {
        location.href = 'access-denied.html';
    }
    
    //improper privilege for admin pages
    else if ((filename == "create.html" || filename == "edit.html" || filename == "manage.html") && user.privilege != "admin") {
        location.href = 'access-denied.html';
    }
    
    //improper privilege for manager pages
    else if ((filename == "employees.html" || filename == "employee-timesheets.html" || filename == "timesheet-approval.html") && user.privilege != "manager") {
        location.href = 'access-denied.html';
    }
    
    //improper privilege for user pages
    else if ((filename == "timesheet-history.html" || filename == "timesheet.html" || filename == "user-info.html") && (user.privilege != "user" || user.privilege != "manager")) {
        location.href = 'access-denied.html';
    }
}






//--------------------------------------------------------
//--------------------------------------------------------
//  FUNC 2
//  User Name and Title & Main Menu Buttons
//--------------------------------------------------------
//--------------------------------------------------------



//--------------------------------------------------------
//  2A
//  Load User Name / Title
//--------------------------------------------------------

function loadUserNT() {
    
    //loads current user from local storage
    var user = JSON.parse(localStorage.getItem("currentUser"));
    
    //insert name and title
    document.write('<h3 class="mt-3 mb-0">' + user.name + '</h3>');
    document.write('<h3>' + user.title +'</h3>');
}



//--------------------------------------------------------
//  2B
//  Main Menu Buttons
//--------------------------------------------------------

function loadMenuButtons() {
    
    //loads current user from local storage
    var user = JSON.parse(localStorage.getItem("currentUser"));
    
    var links, pageName;
    
    //--------------------------------------------------------
    //  2C
    //  Load Amin Menu
    //--------------------------------------------------------
    
    //if admin creates admin menu
    if (user.privilege == "admin") {
        
        //admin buttons
        //list of links and names for admin buttons
        links = ["admin/manage.html", "admin/create.html", "admin/edit.html"];
        pageName = ["Manage Users", "New User", "Edit User"];
        
        //creates buttons
        createButtons(links, pageName); 
    }
    
    
    //--------------------------------------------------------
    //  2D
    //  Load User Menu
    //--------------------------------------------------------
    
    //if user creates user menu
    else if (user.privilege == "user") {
        
        //user buttons
        //list of links and names for buttons
        links = ["user/timesheet.html", "user/timesheet-history.html", "user/user-info.html"];
        pageName = ["Timesheet", "Timesheet History", "User Information"];
        
        //creates buttons
        createButtons(links, pageName); 
    }
    
    
    //--------------------------------------------------------
    //  2E
    //  Load Manager Menu
    //--------------------------------------------------------
    
    //if manager creates manager menu
    else if (user.privilege == "manager") {
        
        //manager specific buttons
        //list of links and names for buttons
        links = ["manager/employees.html", "manager/employee-timesheets.html", "manager/timesheet-approval.html"];
        pageName = ["Employees", "Employee Timesheets", "Timesheet Approval"];
        
        //creates buttons
        createButtons(links, pageName); 
        
        //same as user buttons
        //allows the manager to clock their time and see their info
        //list of links and names forbuttons
        links = ["user/timesheet.html", "user/timesheet-history.html", "user/user-info.html"];
        pageName = ["Timesheet", "Timesheet History", "User Information"];
        
        //creates buttons
        createButtons(links, pageName); 
    }
}


//--------------------------------------------------------
//  2F
//  Creates Buttons
//--------------------------------------------------------

function createButtons(links, pageName) {
    
    //creates row and column for buttons
    document.write('<div class="row">');
    document.write('<div class="col-10 mx-auto py-5 border-top border-2 border-black">');
    
    for (var i = 0; i < links.length; i++) {
        if (i == 2) {
            document.write('<a class="btn menu-btn btn-primary text-center py-2" href="' + links[i] + '">' + pageName[i] + '</a><br>');    
        }
        else {
            document.write('<a class="btn menu-btn btn-primary text-center py-2 mb-3" href="' + links[i] + '">' + pageName[i] + '</a><br>');
        }
    }
    
    //closes row and column divs
    document.write('</div>');
    document.write('</div>'); 
}






//--------------------------------------------------------
//--------------------------------------------------------
//  FUNC 3
//  Create / Edit / Delete Objects
//--------------------------------------------------------
//--------------------------------------------------------


//--------------------------------------------------------
//  3A
//  Creates Current User
//--------------------------------------------------------


function createCurrUser(user) {
    
    //try to set current user
    try {
        
        //sets current user in storage
        localStorage.setItem("currentUser", JSON.stringify(user));
    }
    
    //local storage error check
    catch(e) {
        if (window.navigator.vendor == "Google Inc.") {
            if (e == DOMException.QUOTA_EXCEEDED_ERR) {
                alert("Error: Local Storage Limit Exceeded.");
            }
        }
        else if (e == QUOTA_EXCEEDED_ERR){
            alert("Error: Saving to local storage.");        
        }
        console.log(e);
    }
}


//--------------------------------------------------------
//  3B
//  Delete Current User
//--------------------------------------------------------


function deleteCurrUser() {
    
    //remove current user from storage
    localStorage.removeItem("currentUser");
    
}


//--------------------------------------------------------
//  3C
//  Creates User Record
//--------------------------------------------------------


function createUser(organization, employeeID, managerID, name, department, title, privilege, username, password) {
    
    //creates user object
    var user = {
        "organization" : organization,
        "employeeID" : employeeID,
        "managerID" : managerID,
        "name" : name,
        "department" : department,
        "title" : title,
        "privilege" : privilege,
        "username" : username,
        "password" : password
    };
    
    try {
        
        //gets user list from storage
        var userList = JSON.parse(localStorage.getItem("userList"));
        
        //if userlist is empty, initilizes as array
        if (userList == null) {
            userList = [];
        }
        
        //adds to array
        userList.push(user);
        
        //sets local storage item
        localStorage.setItem("userList", JSON.stringify(userList));
    }
    
    //local storage error check
    catch(e) {
        if (window.navigator.vendor == "Google Inc.") {
            if (e == DOMException.QUOTA_EXCEEDED_ERR) {
                alert("Error: Local Storage Limit Exceeded.");
            }
        }
        else if (e == QUOTA_EXCEEDED_ERR){
            alert("Error: Saving to local storage.");        
        }
        console.log(e);
    }
}


//--------------------------------------------------------
//  3D
//  Deletes User Record
//--------------------------------------------------------


function deleteUser() {
    
}


//--------------------------------------------------------
//  3C
//  Creates Default User Records
//--------------------------------------------------------

//calls on js load
createDefaultUsers();

function createDefaultUsers() {
    
    //gets userlist records
    var userList = JSON.parse(localStorage.getItem("userList"));
    
    //if no records exist, create default records
    if (userList == null) {
        
        //list of organizations
        var orgList = ["brenntagna", "libertyuniversity", "truckerspapertrail"];
        var empIDList = ["111111", "234567", "345678", "456789", "567890"];
        var manIDList = ["", "234567", "234567", "234567", "678901"];
        var nameList = ["Administrator", "Jane Doe", "Billy Joel", "Mariah Carry", "Ben Groff"];
        var depList = ["IT", "Software Engineering", "Software Engineering", "Software Engineering", "Accounting"];
        var titleList = ["System Administrator", "Software Engineer Manager", "Software Engineer", "Software Engineer", "Accountant"];
        var privList = ["admin", "manager", "user", "user", "user"];
        var userNamList = ["Admin", "Manager", "User1", "User2", "User3"];
        var passList = "1234";
        
        //loop to create records
        for (var i = 0; i < orgList.length; i++) {              //for each organization
                for (var a = 0; a < empIDList.length; a++) {    //for each record
                    createUser(orgList[i], empIDList[a], manIDList[a], nameList[a], depList[a], titleList[a], privList[a], userNamList[a], passList);
                }
        }
    }
}