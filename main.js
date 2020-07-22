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
//        3E ** Calls edit 'userList' from manage page
//        3F ** Edits 'userList' records
//        3G ** Sets Default 'userList' records
//
//    FUNC 4 ** Display / Fill Tables
//        4A ** Creates Table Headings
//        4B ** Fills User List Table
//
//    FUNC 5 ** Select Box Fills
//        5A ** Admin - Edit User Select Box
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
    document.write('<h3 class="mt-3 mb-0">' + user.name + '</h3>' +
                  '<h3 class="mb-0">' + user.title +'</h3>' +
                  '<h3>ID: ' + user.employeeID +'</h3>');
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
    document.write('<div class="row">' +
                  '<div class="col-10 mx-auto py-5 border-top border-2 border-black">');
    
    for (var i = 0; i < links.length; i++) {
        if (i == 2) {
            document.write('<a class="btn menu-btn btn-primary text-center py-2" href="' + links[i] + '">' + pageName[i] + '</a><br>');    
        }
        else {
            document.write('<a class="btn menu-btn btn-primary text-center py-2 mb-3" href="' + links[i] + '">' + pageName[i] + '</a><br>');
        }
    }
    
    //closes row and column divs
    document.write('</div>' +
                  '</div>');
}


//--------------------------------------------------------
//--------------------------------------------------------






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


function createNewUser(organization, employeeID, managerID, name, department, title, privilege, username, password) {
    
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
        
        //checks for unique employee ID
        for (var i = 0; i < userList.length; i++) {
            var rec = userList[i];
            if (document.getElementById("createEmpID").value != "XXXXXX" && rec.organization == document.getElementById("createOrg").value && document.getElementById("createEmpID").value == rec.employeeID){
                var error = true;
                alert("Employee ID must be a unique number.");
                break;
            }
        }
        
        //if error
        if (error) {
            return false;
        }
        else {
        
            //adds to array
            userList.push(user);

            //sets local storage item
            localStorage.setItem("userList", JSON.stringify(userList));
        }
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


function deleteUser(index) {
    try {
        if (confirm('Are you sure you want to permanentely delete this record?')){
            //gets userList object and cuts out the indexed record
            var userList = JSON.parse(localStorage.getItem("userList"));
            userList.splice(index, 1);

            //if no records left, remove object from storage
            if (userList.length == 0){
                localStorage.removeItem("userList");
            }

            //sets stored obj to updated version
            else {
                localStorage.setItem("userList", JSON.stringify(userList));
            }

            //alerts user and refreshes page
            alert("User Record has been deleted.");
            location.reload();
        }
    }
    
    //catches local storage errors
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
//  3E
//  Call Edit User from manage page
//--------------------------------------------------------


function callEditUser(index) {
    
    //gets userlist records
    var userList = JSON.parse(localStorage.getItem("userList"));
    
    //goes to edit page
    location.href = 'edit.html';
    
    //record chosen to edit
    var rec = userList[index];
    
    //creates edit user object for passing record to edit page
    localStorage.setItem("editUser", JSON.stringify(rec));
}


//--------------------------------------------------------
//  3F
//  Edit User Record
//--------------------------------------------------------


//when document loads, activates change trigger
$(document).ready(function (){
    $("#userSelect").trigger("change");
});


function showUserForm() {
    
    //removes edit user if coming from manage page
    localStorage.removeItem("editUser");
    
    //gets value of user select
    var selection = document.getElementById("userSelect").value;
    
    //if they select a user
    if (selection != "") {
        $("#editUserForm").removeClass("d-none");
        $("#userSelect").removeClass("mb-5");
        fillUserForm();
    }
    else {
        $("#editUserForm").addClass("d-none");
        $("#userSelect").addClass("mb-5");
    }
}


function fillUserForm() {
    
    //gets current user and userlist from storage
    var userList = JSON.parse(localStorage.getItem("userList"));
    var user = JSON.parse(localStorage.getItem("currentUser"));
    
    //finds the user from userList and sets their info to rec variable
    for (var i = 0; i < userList.length; i++) {
        var rec = userList[i];
        if (rec.organization == user.organization && document.getElementById("userSelect").value == rec.employeeID){
            break;
        }
    }
    
    //sets form values to the user's information
    document.getElementById("editOrg").value = rec.organization;
    document.getElementById("editEmpID").value = rec.employeeID;
    document.getElementById("editManID").value = rec.managerID;
    document.getElementById("editName").value = rec.name;
    document.getElementById("editDep").value = rec.department;
    document.getElementById("editTitle").value = rec.title;
    document.getElementById("editPriv").value = rec.privilege;
    document.getElementById("editUser").value = rec.username;
    document.getElementById("editPass").value = rec.password;
    
}


function cancelChanges(form) {
    
    //if navigating back to menu from form
    if (form == "createMenu" || form == "editMenu") {
        if (form == "editMenu" && $("#editUserForm").hasClass("d-none")) {
            return true;
        }
        else {
            if (confirm('Are you sure you want to go to the menu? Any unsaved changes will be lost.')){
                return true;
            }
            else {
                return false;
            }
        }
    }
    else {
        //if the user cancels save confirm request
        if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')){

            //if called from edit form
            if (form == "edit") {
                location.reload();
            }


            //if called from create form
            else {
                history.go(-1);
            }

        }
    }
}


function saveUser () {
    //userlist from storage
    var userList = JSON.parse(localStorage.getItem("userList"));
    
    //finds the user from userList and sets their info to rec variable
    for (var i = 0; i < userList.length; i++) {
        var rec = userList[i];
        var index = i;
        if (rec.organization == document.getElementById("editOrg").value && document.getElementById("editEmpID").value == rec.employeeID){
            break;
        }
    }
    
    //if no changes were made
    if (rec.managerID == document.getElementById("editManID").value &&
        rec.name == document.getElementById("editName").value &&
        rec.department == document.getElementById("editDep").value &&
        rec.title == document.getElementById("editTitle").value &&
        rec.privilege == document.getElementById("editPriv").value &&
        rec.username == document.getElementById("editUser").value &&
        rec.password == document.getElementById("editPass").value) {
        
        //does not submit, and alerts
        alert("No changes were made.")
        return false;
    }
    
    //if changes were made
    else {
        
        //sets record to new values
        rec.managerID = document.getElementById("editManID").value;
        rec.name = document.getElementById("editName").value;
        rec.department = document.getElementById("editDep").value;
        rec.title = document.getElementById("editTitle").value;
        rec.privilege = document.getElementById("editPriv").value;
        rec.username = document.getElementById("editUser").value;
        rec.password = document.getElementById("editPass").value;

        //updates the indexed record and stores it
        userList[index] = rec;
        localStorage.setItem("userList", JSON.stringify(userList));
        
        //alerts changes were saved
        alert("Changes were saved.");
        
    }
    
}


//--------------------------------------------------------
//  3G
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
        var orgList = ["Brenntag NA", "Liberty University", "Truckers Paper Trail"];
        var empIDList = ["XXXXXX", "234567", "345678", "456789", "567890"];
        var manIDList = ["XXXXXX", "234567", "234567", "234567", "678901"];
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


//--------------------------------------------------------
//--------------------------------------------------------






//--------------------------------------------------------
//--------------------------------------------------------
//  FUNC 4
//  Display / Fill Tables
//--------------------------------------------------------
//--------------------------------------------------------


//--------------------------------------------------------
//  4A
//  Creates Table Headings
//--------------------------------------------------------


function tableHeadings(type) {
    var headings;
    
    //if listing users in table
    if (type == "UserList") {
        headings = ['Emp ID', 'Man ID', 'Name', 'Title', '<span class="oi oi-blue" data-glyph="pencil"></span>', '<span class="oi oi-blue" data-glyph="trash"></span>'];
    }
    
    //loop to create table headings
    for (var i = 0; i < headings.length; i++) {
        document.write('<th class="text-center" scope="col">' + headings[i] + '</th>');   
    }
}


//--------------------------------------------------------
//  4B
//  Fills User List Table
//--------------------------------------------------------


function userListTable(type) {
    
    //gets user list, and current user
    var userList = JSON.parse(localStorage.getItem("userList"));
    var user = JSON.parse(localStorage.getItem("currentUser"));
    
    //loops through list of all users
    for (var i = 0; i < userList.length; i++) {
        var rec = userList[i];
        
        //if the user's belong to admin's org, write record
        if ((rec.organization == user.organization && type == "UserList") || (rec.organization == user.organization && rec.managerID == username.employeeID && type == "EmployeeList")) {
            document.write('<tr class="text-center">' +
                           '<td>' + rec.employeeID + '</td>' +
                           '<td>' + rec.managerID + '</td>' +
                           '<td>' + rec.name + '</td>' +
                           '<td>' + rec.title + '</td>' +
                           '<td><a href="edit.html" onclick="callEditUser('+i+');"><span class="oi oi-blue" data-glyph="pencil"></span></a></td>');
            if (rec.employeeID == "XXXXXX") {
                document.write('<td></td></tr>');    
            }
            else {
                document.write('<td><a href="" onclick="deleteUser('+i+');"><span class="oi oi-blue" data-glyph="trash">                    </span></a></td>' +
                               '</tr>');
            }
        }
    }
}


//--------------------------------------------------------
//--------------------------------------------------------






//--------------------------------------------------------
//--------------------------------------------------------
//  FUNC 5
//  Select Box Fills
//--------------------------------------------------------
//--------------------------------------------------------


//--------------------------------------------------------
//  5A
//  Admin - Edit User Select Box
//--------------------------------------------------------


function editUserSelect() {
    
    //gets user list, current user, and edit user
    var userList = JSON.parse(localStorage.getItem("userList"));
    var user = JSON.parse(localStorage.getItem("currentUser"));
    var editUserRecord = JSON.parse(localStorage.getItem("editUser"));
    
    //loops through list of all users
    for (var i = 0; i < userList.length; i++) {
        var rec = userList[i];
        
        //if the user's belong to admin's org, write record
        if (rec.organization == user.organization) {
            
            //if edit user record exists, set it as selected
            if (editUserRecord != null && rec.employeeID == editUserRecord.employeeID) {
                document.write('<option value="' + rec.employeeID + '" selected>' + rec.name + '</option>');    
            }
            else {
                document.write('<option value="' + rec.employeeID + '">' + rec.name + '</option>');
            }
        }
    }
}