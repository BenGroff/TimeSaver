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
//
//        3C ** Creates 'userList' records
//        3D ** Deletes 'userList' records
//        3E ** Calls edit 'userList' from manage page
//        3F ** Edits 'userList' records
//        3G ** Sets Default 'userList' records
//
//        3H ** Creates 'currentTimesheet'
//        3I ** Creates 'editTimesheet' or 'viewTimesheet
//        3J ** Deletes 'editTimesheet' and 'viewTimesheet
//        3K ** Creates 'timesheetList' record
//        3L ** Sets Default 'timesheetList' records
//        3M ** Calls Approval or Denial
//
//    FUNC 4 ** Display / Fill Tables
//        4A ** Creates Table Headings
//        4B ** Fills User List Table
//        4C ** Creates and Fills Time Table
//        4D ** Tooltip for icons
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
    
    //makes sure local storage is supported
    if (typeof(Storage) == "undefined") {
        alert("Your browser does not support HTML5 local storage. Try upgrading.");
    }
    else {
        
        //validates login information
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
    
    if (confirm('Are you want to log out?')){
        
        //deletes current user obj and any view / edit timesheet obj
        deleteCurrUser();
        deleteTime();

        //alerts successful
        alert("Successfully Logged Out.");
        
        return true;
    }
    else {
        return false;
    }
    
        
}



//--------------------------------------------------------
//  1D
//  Page Access Control
//--------------------------------------------------------

//checks page access privileges
function checkPrivilege(priv) {
    
    //loads current user from local storage
    var user = JSON.parse(localStorage.getItem("currentUser"));
    
    //if no user, denies access
    if (user == null) {
        location.href = '/access-denied.html';
    }
    
    //improper privilege for admin pages
    else if (priv == "admin" && user.privilege != "admin") {
        location.href = '../access-denied.html';
    }
    
    //improper privilege for manager pages
    else if (priv == "manager" && user.privilege != "manager") {
        location.href = '../access-denied.html';
    }
    
    //improper privilege for user pages
    else if (priv == "user" && (user.privilege != "user" && user.privilege != "manager")) {
        location.href = '../access-denied.html';
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

function loadUserNT(page) {
    
    //loads current user from local storage
    var user = JSON.parse(localStorage.getItem("currentUser"));
    
    //insert name and title
    if (page == "menu") {
        document.write('<h3 class="mt-3 mb-0">' + user.name + '</h3>' +
                      '<h3 class="mb-0">' + user.title +'</h3>' +
                      '<h3>ID: ' + user.employeeID +'</h3>');
    }
    else if (page == "time") {
        document.write('<h5 class="text-left">' + user.name + '</h5>' +
                       '<h5 class="text-left">' + user.department +'</h5>' +
                       '<h5 class="text-left">' + user.title +'</h5>' +
                       '<h5 class="text-left">' + user.employeeID +'</h5>');    
    }
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
        
        //if userlist is empty, initializes as array
        if (userList == null) {
            userList = [];
        }
        
        //checks for unique employee ID
        for (var i = 0; i < userList.length; i++) {
            var rec = userList[i];
            if (rec.organization == user.organization && user.employeeID == rec.employeeID){
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
            
            return true;
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


function callNewUser() {
    
    //trys to create user, if successful
    if (createNewUser(document.getElementById('createOrg').value, document.getElementById('createEmpID').value, document.getElementById('createManID').value, document.getElementById('createName').value, document.getElementById('createDep').value, document.getElementById('createTitle').value, document.getElementById('createPriv').value, document.getElementById('createUser').value, document.getElementById('createPass').value)) {
        
        //gives confirmation
        alert("User created successfully.");
    }
    
    //if unsuccessful
    else {
        return false;
    }
}


//--------------------------------------------------------
//  3D
//  Deletes User Record
//--------------------------------------------------------


function deleteUser(index) {
    try {
        if (confirm('Are you sure you want to permanentely delete this record?')){
            //gets userList object
            var userList = JSON.parse(localStorage.getItem("userList"));
            
            //deletes indexed record
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


//shows delete button on edit if not original admin
function isAdmin(employeeID) {
    if (employeeID != 'XXXXXX') {
        $('#deleteEdit').removeClass('d-none');
    }
}


function callDeleteUser() {
    
    //gets userlist
    var userList = JSON.parse(localStorage.getItem("userList"));
    
    var index;
    var org = document.getElementById("editOrg").value;
    var emp = document.getElementById("editEmpID").value;
    
    //finds the index of specified user
    for (var i = 0; i < userList.length; i++) {
        var rec = userList[i];
        if (org == rec.organization && emp == rec.employeeID) {
            index = i;
            break;
        }
    }
    
    //deletes user
    deleteUser(index);
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


function showUserForm(type) {
    
    //removes edit user if coming from manage page
    localStorage.removeItem("editUser");
    
    //gets value of user select
    var selection = document.getElementById("userSelect").value;
    
    //if they select a user
    if (selection != "") {
        $("#editUserForm").removeClass("d-none");
        $("#userSelect").removeClass("mb-5");
        if (type == null) {
            fillUserForm();
        }
        else if (type == "manager") {
            fillUserForm("manager");
        }
        else {
            empTimesheetTable();
        }
    }
    else {
        $("#editUserForm").addClass("d-none");
        $("#userSelect").addClass("mb-5");
    }
}


function fillUserForm(type) {
    
    //gets current user and userlist from storage
    var userList = JSON.parse(localStorage.getItem("userList"));
    var user = JSON.parse(localStorage.getItem("currentUser"));
    
    if (type == "manager") {
        var selection = document.getElementById("userSelect").value; 
    }
    
    //finds the user from userList and sets their info to rec variable
    for (var i = 0; i < userList.length; i++) {
        var rec = userList[i];
        if (user.privilege == "admin") {
            if (rec.organization == user.organization && document.getElementById("userSelect").value == rec.employeeID){
                break;
            }
        }
        else if (user.privilege == "user" || user.privilege == "manager") {
            if (rec.organization == user.organization && user.employeeID == rec.employeeID && type == null){
                break;
            }
            else if (rec.organization == user.organization && selection == rec.employeeID && type == "manager") {
                break;
            }
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
    
    if (type == null) {
        document.getElementById("editUser").value = rec.username;
        document.getElementById("editPass").value = rec.password;
    }
    
    if (user.privilege == "admin") {
        
        //hides delete button if original admin
        if (rec.employeeID == "XXXXXX") {
            $('#deleteEdit').addClass('d-none');
        }
        else {
            $('#deleteEdit').removeClass('d-none');
        }
    }
    
}


function cancelChanges(form) {
    
    var editTime = JSON.parse(localStorage.getItem("editTimesheet"));
    var viewTime = JSON.parse(localStorage.getItem("viewTimesheet"));
    
    //if navigating back to menu from form
    if (form == "menu" || form == "editMenu" || form == "vMenu") {
        if ((form == "editMenu" && $("#editUserForm").hasClass("d-none")) || form == "vMenu") {
            return true;
        }
        else {
            if (confirm('Are you sure you want to go to the menu? Any unsaved changes will be lost.')){
                if (editTime != null || viewTime != null) {
                    deleteTime();
                }
                return true;
            }
            else {
                return false;
            }
        }
    }
    else {
        
        //if viewing form
        if (form == 'view') {
            history.go(-1);
        }
        
        //if the user cancels save confirm request
        else if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')){

            //if called from edit form
            if (form == "edit") {
                if (editTime != null || viewTime != null) {
                    deleteTime();
                    location.href = "timesheet-history.html";
                }
                else {
                    location.reload();
                }
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
    var user = JSON.parse(localStorage.getItem("currentUser"));
    
    //finds the user from userList and sets their info to rec variable
    for (var i = 0; i < userList.length; i++) {
        var rec = userList[i];
        var index = i;
        if (user.privilege == "admin") {
            if (rec.organization == user.organization && document.getElementById("editEmpID").value == rec.employeeID){
                break;
            }
        }
        else if (user.privilege == "user") {
            if (rec.organization == user.organization && user.employeeID == rec.employeeID){
                break;
            }
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
        var orgList = ["Sample Company", "Example LLC", "Testing Company"];
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
                    createNewUser(orgList[i], empIDList[a], manIDList[a], nameList[a], depList[a], titleList[a], privList[a], userNamList[a], passList);
                }
        }
        console.log("User list data loaded successfully.");
    }
}


//--------------------------------------------------------
//  3H
//  Creates 'currentTimesheet'
//--------------------------------------------------------


function saveTimeSheet(type) {
    
    var totalHours = 0;
    
    //gets user record
    var user = JSON.parse(localStorage.getItem("currentUser"));
    
    //first day of week, needed to make record unique
    var timeStart = document.getElementById("day0").innerHTML;
    
    //timeSheet object
    var timeSheet = {
        "organization" : user.organization,
        "employeeID" : user.employeeID,
        "managerID" : user.managerID,
        "weekstart" : timeStart,
        "hours" : [],
        "totalhours" : 0,
        "approved" : "IP"
        
    }
    
    //pushes timesheet info into object
    for (var i = 0; i < 7; i++) {
        var timeInID = "timeIn" + i.toString();
        var lunchInID = "lunchOut" + i.toString();
        var lunchOutID = "LunchIn" + i.toString();
        var timeOutID = "timeOut" + i.toString();
        var totalID = "total" + i.toString();
        
        //totals the hours
        var h = parseFloat(document.getElementById(totalID).innerHTML);
        totalHours = totalHours + h;
        
        timeSheet.hours.push({
            "day" : getWeekDay(i),
            "timein" : document.getElementById(timeInID).value,
            "lunchout" : document.getElementById(lunchOutID).value,
            "lunchin" : document.getElementById(lunchInID).value,
            "timeout" : document.getElementById(timeOutID).value,
            "total" : document.getElementById(totalID).innerHTML
        });
    }
    
    //inserts total hours into obj
    timeSheet.totalhours = totalHours;
    
    //saves it to local storage
    localStorage.setItem("currentTimesheet", JSON.stringify(timeSheet));
    
    if (type != 'submit') {
        alert("Timesheet saved.");    
    }
    
}


//--------------------------------------------------------
//  3I
//  Creates 'editTimesheet' or 'viewTimesheet
//--------------------------------------------------------


function callTime(index, type) {
    
    //gets timesheet masterlist
    var timesheetList = JSON.parse(localStorage.getItem("timesheetList"));
    
    //gets specific timesheet
    var timesheet = timesheetList[index];
    
    if (type == "view") {
        //creates viewtimesheet obj
        localStorage.setItem("viewTimesheet", JSON.stringify(timesheet));
    }
    else if (type == "edit") {
        //creates edittimesheet obj
        localStorage.setItem("editTimesheet", JSON.stringify(timesheet));
    }
}


//--------------------------------------------------------
//  3J
//  Deletes 'editTimesheet and 'viewTimesheet
//--------------------------------------------------------


function deleteTime() {
    
    //deletes temp timesheets from storage
    localStorage.removeItem("editTimesheet")
    localStorage.removeItem("viewTimesheet")
}


//--------------------------------------------------------
//  3K
//  Creates 'timesheetList' record
//--------------------------------------------------------


function submitTimesheet() {
    
    //user confirmation of submission
    if (confirm('Are you sure you want to submit this timesheet?')){

        //gets current timesheet and checks for edit timesheet
        var editTime = JSON.parse(localStorage.getItem("editTimesheet"));
        
        //if not editing record, saves current timesheet
        if (editTime == null) {
            saveTimeSheet('submit');
            var currTime = JSON.parse(localStorage.getItem("currentTimesheet"));
        }
        
        //gets user
        var user = JSON.parse(localStorage.getItem("currentUser"));

        //runs through the days of the week
        for (var i = 0; i < 7; i++) {

            //document input ID's
            var timeInID = "timeIn" + i.toString();
            var lunchInID = "lunchOut" + i.toString();
            var lunchOutID = "LunchIn" + i.toString();
            var timeOutID = "timeOut" + i.toString();
            var totalID = "total" + i.toString();


            //validates submission
            if (validateTimes(i, 'submit')) {
                console.log("Line is valid.");
            }
            else {
                return false;
            }
        }

        //gets timesheetList
        var timesheetList = JSON.parse(localStorage.getItem("timesheetList"));

        //if submitting current timesheet
        if (editTime == null) {
            currTime.approved = "AA";
            timesheetList.push(currTime);    
        }
        
        //if editing timesheet
        else {
            var totalHours = 0;
            
            //deletes old record and pushes new one
            for (var i = 0; i < timesheetList.length; i++) {
                if (timesheetList[i].employeeID == user.employeeID && timesheetList[i].organization == user.organization && timesheetList[i].weekstart == editTime.weekstart) {
                    timesheetList.splice(i, 1);
                    break;
                }
            }
            
            //updates timesheet information
            for (var i = 0; i < 7; i++) {
                var timeInID = "timeIn" + i.toString();
                var lunchInID = "lunchOut" + i.toString();
                var lunchOutID = "LunchIn" + i.toString();
                var timeOutID = "timeOut" + i.toString();
                var totalID = "total" + i.toString();

                //totals the hours
                var h = parseFloat(document.getElementById(totalID).innerHTML);
                totalHours = totalHours + h;
                
                editTime.hours[i].timein = document.getElementById(timeInID).value;
                editTime.hours[i].lunchout = document.getElementById(lunchOutID).value;
                editTime.hours[i].lunchin = document.getElementById(lunchInID).value;
                editTime.hours[i].timeout = document.getElementById(timeOutID).value;
                editTime.hours[i].total = document.getElementById(totalID).innerHTML;
            }
            
            editTime.totalhours = totalHours;
            editTime.approved = "AA";
            
            //pushes updated timesheet into timesheetlist
            timesheetList.push(editTime);
        }
        
        //sets timesheetList
        localStorage.setItem("timesheetList", JSON.stringify(timesheetList));
        deleteTime();
        return true;
        
    }
    else {
        return false;
    }
    
}


function validateTimes(index, type) {
    
    //document input ID's
    var timeInID = "timeIn" + index.toString();
    var lunchInID = "lunchOut" + index.toString();
    var lunchOutID = "LunchIn" + index.toString();
    var timeOutID = "timeOut" + index.toString();
    var totalID = "total" + index.toString();
    
    //if there are no entries for that day
    if (document.getElementById(timeOutID).value != "" && document.getElementById(timeInID).value != "" && document.getElementById(lunchOutID).value != "" && document.getElementById(lunchInID).value != "") {
        return true;
    }
    
    //gets times from table
    var lunchOutTime = Date.parse("01 Jan 1970 " + document.getElementById(lunchOutID).value);
    var lunchInTime = Date.parse("01 Jan 1970 " + document.getElementById(lunchInID).value);
    var clockInTime = Date.parse("01 Jan 1970 " + document.getElementById(timeInID).value);
    var clockOutTime = Date.parse("01 Jan 1970 " + document.getElementById(timeOutID).value);
    
    //validation process
    if (clockInTime > clockOutTime) {
        alert("Time In cannot be greater than Time Out.");
        return false;
    }
    else if ((document.getElementById(lunchInID).value != "" && document.getElementById(lunchOutID).value != "") && (lunchOutTime > lunchInTime)) {
        alert("Lunch out time cannot be greater than lunch in time.");
        return false;     
    }
    else if ((document.getElementById(lunchInID).value != "" && document.getElementById(lunchOutID).value != "") && (lunchOutTime > clockOutTime || lunchOutTime < clockInTime || lunchInTime > clockOutTime || lunchInTime < clockInTime)) {
        alert("Lunch times must be within your Time in and Time out hours.");
        return false;     
    }
    else if (type == 'submit') {
        if (document.getElementById(timeInID).value == "" && document.getElementById(timeOutID).value != "") {
            alert("You must be clocked in if you want to clock out.");
            return false;
        }
        else if (document.getElementById(timeInID).value != "" && document.getElementById(timeOutID).value == "") {
            alert("You must clock out if you are clocked in.");
            return false;    
        }
        else if ((document.getElementById(timeInID).value == "" && document.getElementById(timeOutID).value == "") && (document.getElementById(lunchInID).value != "" || document.getElementById(lunchOutID).value != "")) {
            alert("You cannot take a lunch break if you are not clocked in.");
            return false;    
        }
        else if (document.getElementById(lunchInID).value != "" && document.getElementById(lunchOutID).value == "") {
            alert("You must clock out for lunch if you are clocking in from lunch.");
            return false;    
        }
        else if (document.getElementById(lunchInID).value == "" && document.getElementById(lunchOutID).value != "") {
            alert("You must clock in from lunch if you clocked out for lunch.");
            return false;    
        }
        else {
            return true;
        }
    }
    else {
        return true;
    }
    
}


//--------------------------------------------------------
//  3L
//  Sets Default 'timesheetList' records
//--------------------------------------------------------


//calls on js load
createDefaultTimesheets();


function createDefaultTimesheets() {
    var timesheetList = JSON.parse(localStorage.getItem("timesheetList"));
    
    //if there are no time sheets
    if (timesheetList == null) {
        
        //intializes list as an array
        timesheetList = [];
        
        //list of data to insert
        var orgList = ["Sample Company", "Example LLC", "Testing Company"];
        var empIDList = ["234567", "345678"];
        var manIDList = "234567";
        var weekList = ["7/19/2020", "7/12/2020", "7/5/2020"];
        var approvalList = ["AA", "Y", "N"];
        var dayList = [["08:00", "12:00", "12:30", "16:30", "8"], ["07:00", "12:00", "12:30", "17:30", "10"], ["08:00", "12:00", "12:30", "16:30", "8"], ["07:00", "12:00", "12:30", "17:30", "10"], ["08:00", "12:00", "12:30", "16:30", "8"], ["07:00", "12:00", "12:30", "17:30", "10"], ["08:00", "12:00", "12:30", "16:30", "8"]]
        
        //for each org
        for (var i = 0; i < orgList.length; i++) {
            
            //for the employees listed
            for (var a = 0; a < empIDList.length; a++) {
            
                //for the three example weeks
                for (var j = 0; j < weekList.length; j++) {

                    //timeSheet object
                    var timeSheet = {
                        "organization" : orgList[i],
                        "employeeID" : empIDList[a],
                        "managerID" : manIDList,
                        "weekstart" : weekList[j],
                        "hours" : [],
                        "totalhours" : 62,
                        "approved" : approvalList[j]
                    }
                    
                    //for each day in the week
                    for (var x = 0; x < 7; x++) {
                        var day = dayList[x];
                        timeSheet.hours.push({
                            "day" : getWeekDay(x),
                            "timein" : day[0],
                            "lunchout" : day[1],
                            "lunchin" : day[2],
                            "timeout" : day[3],
                            "total" : day[4]
                        });
                    }
                    
                    //compiles in an array
                    timesheetList.push(timeSheet);
                    
                }
            }
        }
        
        //saves to local storage
        localStorage.setItem("timesheetList", JSON.stringify(timesheetList));
        console.log("Time sheet data loaded successfully.");
        
    }
}


//--------------------------------------------------------
//  3M
//  Calls Approval or Denial of timesheet
//--------------------------------------------------------


function callApproval(index, type) {
    
    //if approved
    if (type == "approve") {
        
        //gets confirmation
        if (confirm("Are you sure your want to approve this timesheet?")) {
            
            //updates the timesheet and saves it
            var timesheetList = JSON.parse(localStorage.getItem("timesheetList"));
            timesheetList[index].approved = "Y";
            localStorage.setItem("timesheetList", JSON.stringify(timesheetList));
        }
    }
    
    //if denied
    else {
        
        //gets confirmation
        if (confirm("Are you sure your want to deny this timesheet?")) {
            
            //updates the timesheet and saves it
            var timesheetList = JSON.parse(localStorage.getItem("timesheetList"));
            timesheetList[index].approved = "N";
            localStorage.setItem("timesheetList", JSON.stringify(timesheetList));
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
        headings = ['Emp ID', 'Man ID', 'Name', 'Title', '<span class="oi" data-glyph="pencil"></span>', '<span class="oi" data-glyph="trash"></span>'];
    }
    else if (type == "TimeSheet") {
        headings = ['Date', 'Time In', 'Lunch', 'Time Out', 'Total'];
    }
    else if (type == "TimeHistory") {
        headings = ['Week of', 'Employee ID', 'Total Hours', 'Status', '<span class="oi" data-glyph="eye"></span>', '<span class="oi" data-glyph="pencil"></span>'];
    }
    else if (type == "ManTimeHist") {
        headings = ['Week of', 'Employee ID', 'Total Hours', 'Status', '<span class="oi" data-glyph="eye"></span>'];
    }
    else if (type == "Approval") {
        headings = ['Week of', 'Employee ID', 'Total Hours', 'Status', '<span class="oi" data-glyph="eye"></span>', '<span class="oi" data-glyph="check"></span>', '<span class="oi" data-glyph="x"></span>'];
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
                           '<td><a href="edit.html" data-toggle="tooltip" data-placement="bottom" title="Edit" onclick="callEditUser('+i+');"><span class="oi oi-blue" data-glyph="pencil"></span></a></td>');
            if (rec.employeeID == "XXXXXX") {
                document.write('<td></td></tr>');    
            }
            else {
                document.write('<td><a href="" data-toggle="tooltip" data-placement="bottom" title="Delete"             onclick="deleteUser('+i+');"><span class="oi oi-blue" data-glyph="trash"></span></a></td>' +
                               '</tr>');
            }
        }
    }
}


function totalHours(i) {
    
    //document input ID's
    var timeInID = "timeIn" + i.toString();
    var lunchInID = "lunchOut" + i.toString();
    var lunchOutID = "LunchIn" + i.toString();
    var timeOutID = "timeOut" + i.toString();
    var totalID = "total" + i.toString();

    //if user is clocked in and out, and either clocked out and in for lunch or did not take lunch, get hours
    if ((document.getElementById(timeInID).value != "" && document.getElementById(timeOutID).value != "") && ((document.getElementById(lunchInID).value != "" && document.getElementById(lunchOutID).value != "") || (document.getElementById(lunchInID).value == "" && document.getElementById(lunchOutID).value == ""))) {
        
        //validates, if valid gets hours
        if (validateTimes(i, 'hours')) {
            
            //calculates hours
            var lunchTime = Date.parse("01 Jan 1970 " + document.getElementById(lunchInID).value) - Date.parse("01 Jan 1970 " + document.getElementById(lunchOutID).value);
            var totalTime = (Date.parse("01 Jan 1970 " + document.getElementById(timeOutID).value) - Date.parse("01 Jan 1970 " + document.getElementById(timeInID).value)) - lunchTime;
        
            //converts to hours, then rounds to nearest quarter hour
            var hours = (totalTime / (1000 * 60 * 60)).toFixed(3);
            var rHours = (Math.round(hours * 4) / 4).toFixed(2);
            
            //sets value in table
            document.getElementById(totalID).innerHTML = rHours;
       }
    }
}


//--------------------------------------------------------
//  4C
//  Creates Time Table, fills if necessary
//--------------------------------------------------------


//creates the timesheet table
function timeTable() {
    for (var i = 0; i < 7; i++) {
        var day = getWeekDay(i);
        var date = new Date();
        var dayID = "day" + i.toString();
        var timeInID = "timeIn" + i.toString();
        var lunchInID = "lunchOut" + i.toString();
        var lunchOutID = "LunchIn" + i.toString();
        var timeOutID = "timeOut" + i.toString();
        var totalID = "total" + i.toString();
        document.write('<div class="form-group">' +
                       '<tr class="text-center">' +
                       '<th>' + day + ', <span id="' + dayID + '"> </span></th>' +
                       '<td><input type="time" id="' + timeInID + '" onchange="totalHours(' + i + ')"></td>' +
                       '<td><input type="time" id="' + lunchOutID + '" onchange="totalHours(' + i + ')"> - <input type="time" id="' + lunchInID + '" onchange="totalHours(' + i + ')"></td>' +
                       '<td><input type="time" id="' + timeOutID + '" onchange="totalHours(' + i + ')"></td>' +
                       '<td id="' + totalID + '">0</td>' +
                       '</tr>' +
                       '</div>');
    }
}


//fills the timesheet table
function fillTimeTable(type) {
    
    var dateVals, m, d, y, timeDate, vecTime;
    
    //gets current timesheet or edit timesheet
    var currTime = JSON.parse(localStorage.getItem("currentTimesheet"));
    var editTime = JSON.parse(localStorage.getItem("editTimesheet"));
    var viewTime = JSON.parse(localStorage.getItem("viewTimesheet"));
    
    //gets week start depending on timesheet
    if (editTime != null) {
        vecTime = editTime;
    }
    else if (viewTime != null) {
        vecTime = viewTime;
    }
    else if (currTime != null) {
        vecTime = currTime;
    }
    
    //if user is trying to edit / view /  use a current timesheet
    if (vecTime != null) {
        
        //gets week start
        datVals = vecTime.weekstart.split("/");
        
        //gets date values and creates a date
        m = parseInt(datVals[0]) - 1;
        d = datVals[1];
        y = datVals[2];
        timeDate = new Date(y, m, d);
    }
    
    //if current timesheet only
    if (currTime != null && editTime == null && viewTime == null) {
        
        //first day of the week, tests to see if it is the same as current week timesheet
        var fTest = timeDate.getDate() - timeDate.getDay();
        var dayTest = new Date(timeDate.setDate(fTest));
        var mTest = dayTest.getMonth();
        var dTest = dayTest.getDate();
        var yTest = dayTest.getFullYear();
        dayTest = new Date(yTest, mTest, dTest);
        
        //if old timesheet, alerts user
        if (dayTest > timeDate) {
            alert("This is a timesheet from a previous week. To get to the current week, please submit the timesheet for approval.");
        }
        
    }
    
    //if loading a new, unedited timesheet
    else {
        timeDate = new Date();
    }
    
    
    //fills table
    for (var i = 0; i < 7; i++) {
        
        //ids for table
        var dayID = "day" + i.toString();
        var timeInID = "timeIn" + i.toString();
        var lunchInID = "lunchOut" + i.toString();
        var lunchOutID = "LunchIn" + i.toString();
        var timeOutID = "timeOut" + i.toString();
        var totalID = "total" + i.toString();
        
        //first day of the week, increments through the week
        var first = timeDate.getDate() - timeDate.getDay() + i ;
        var day = new Date(timeDate.setDate(first));
        
        //date variables
        var month = day.getMonth() + 1;
        var date = day.getDate();
        var year = day.getFullYear();
        
        //date format
        var dayForm = month + "/" + date + "/" + year;
        
        //writes date into table
        document.getElementById(dayID).innerHTML = dayForm;
        
        //if the user is editing a previous timesheet
        if (editTime != null || viewTime != null || currTime != null) {
            document.getElementById(timeInID).value = vecTime.hours[i].timein;
            document.getElementById(lunchOutID).value = vecTime.hours[i].lunchout;
            document.getElementById(lunchInID).value = vecTime.hours[i].lunchin;
            document.getElementById(timeOutID).value = vecTime.hours[i].timeout;
            document.getElementById(totalID).innerHTML = vecTime.hours[i].total;
        }
        
        //if viewing timesheet, disables all input
        if (viewTime != null) {
            document.getElementById(timeInID).setAttribute('disabled', true);
            document.getElementById(lunchOutID).setAttribute('disabled', true);
            document.getElementById(lunchInID).setAttribute('disabled', true);
            document.getElementById(timeOutID).setAttribute('disabled', true);
        }
        
    }
}


//gets the abbreviate for the day of the week
function getWeekDay(index) {
    if (index == 0) {
        return "Sun";
    }
    else if (index == 1) {
        return "Mon";
    }
    else if (index == 2) {
        return "Tue";
    }
    else if (index == 3) {
        return "Wed";
    }
    else if (index == 4) {
        return "Thu";
    }
    else if (index == 5) {
        return "Fri";
    }
    else if (index == 6) {
        return "Sat";
    }
}


//--------------------------------------------------------
//  4D
//  Tooltip
//--------------------------------------------------------


//Tooltip information on hover
$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip({'delay': { show: 1000, hide: 100 }});
});


//--------------------------------------------------------
//  4E
//  Fills Time Sheet List Table
//--------------------------------------------------------


function timesheetListTable(type) {
    
    //gets current user and timesheet list
    var timesheets = JSON.parse(localStorage.getItem("timesheetList"));
    var user = JSON.parse(localStorage.getItem("currentUser"));
    
    //loops through list of all users
    for (var i = 0; i < timesheets.length; i++) {
        var rec = timesheets[i];
        
        //if the user belongs to admin's org, write record
        if ((rec.organization == user.organization && rec.employeeID == user.employeeID && type == "user") || (rec.organization == user.organization && rec.managerID == user.employeeID && type == "manager" && rec.approved == "AA")) {
            document.write('<tr class="text-center">' +
                           '<td>' + rec.weekstart + '</td>' +
                           '<td>' + rec.employeeID + '</td>' +
                           '<td>' + rec.totalhours + '</td>');
            if (rec.approved == "Y") {
                document.write('<td><a href="" data-toggle="tooltip" data-placement="bottom" title="Approved" style="cursor:default;"><span class="oi oi-green" data-glyph="check"></span></a></td>');
            }
            else if (rec.approved == "N") {
                document.write('<td><a href="" data-toggle="tooltip" data-placement="bottom" title="Denied" style="cursor:default;"><span class="oi oi-red" data-glyph="x"></span></a></td>');
            }
            else if (rec.approved == "AA") {
                document.write('<td><a href="" data-toggle="tooltip" data-placement="bottom" title="Awaiting Review" style="cursor:default;"><span class="oi oi-blue" data-glyph="aperture"></span></a></td>');
            }
            if (type == "user") {
                document.write('<td><a href="timesheet.html" data-toggle="tooltip" data-placement="bottom" title="View Timesheet" onclick="callTime('+i+',  ' + "'view'" + ');"><span class="oi oi-blue" data-glyph="eye"></span></a></td><td><a href="timesheet.html" data-toggle="tooltip" data-placement="bottom" title="Edit" onclick="callTime('+i+', ' + "'edit'" + ');"><span class="oi oi-blue" data-glyph="pencil"></span></a></td></tr>');
            }
            else {
                document.write('<td><a href="../user/timesheet.html" data-toggle="tooltip" data-placement="bottom" title="View Timesheet" onclick="callTime('+i+', ' + "'view'" + ');"><span class="oi oi-blue" data-glyph="eye"></span></a></td><td><a href="timesheet-approval.html" data-toggle="tooltip" data-placement="bottom" title="Approve Timesheet" onclick="callApproval('+i+', ' + "'approve'" + ');"><span class="oi oi-green" data-glyph="check"></span></a></td><td><a href="timesheet-approval.html" data-toggle="tooltip" data-placement="bottom" title="Deny Timesheet" onclick="callApproval('+i+', ' + "'deny'" + ');"><span class="oi oi-red" data-glyph="x"></span></a></td></tr>');
            }
        }
    }
}


function empTimesheetTable() {
    
    //gets current user and timesheet list
    var timesheets = JSON.parse(localStorage.getItem("timesheetList"));
    var user = JSON.parse(localStorage.getItem("currentUser"));
    
    var selection = document.getElementById("userSelect").value;
    var table = document.getElementById("empTime");
    table.innerHTML = "";
    var rowContent;
    
    //loops through list of all timesheets
    for (var i = 0; i < timesheets.length; i++) {
        var rec = timesheets[i];
        
        //if the user belongs to admin's org, write record
        if (rec.organization == user.organization && selection == rec.employeeID) {
            rowContent = '<tr class="text-center">' +
                           '<td>' + rec.weekstart + '</td>' +
                           '<td>' + rec.employeeID + '</td>' +
                           '<td>' + rec.totalhours + '</td>';
            if (rec.approved == "Y") {
                rowContent += '<td><a data-toggle="tooltip" data-placement="bottom" title="Approved" style="cursor:default;"><span class="oi oi-green" data-glyph="check"></span></a></td>';
            }
            else if (rec.approved == "N") {
                rowContent += '<td><a data-toggle="tooltip" data-placement="bottom" title="Denied" style="cursor:default;"><span class="oi oi-red" data-glyph="x"></span></a></td>';
            }
            else if (rec.approved == "AA") {
                rowContent += '<td><a data-toggle="tooltip" data-placement="bottom" title="Awaiting Review" style="cursor:default;"><span class="oi oi-blue" data-glyph="aperture"></span></a></td>';
            }
            rowContent += '<td><a href="../user/timesheet.html" data-toggle="tooltip" data-placement="bottom" title="View Timesheet" onclick="callTime('+i+', ' + "'view'" + ');"><span class="oi oi-blue" data-glyph="eye"></span></a></td></tr>';
            table.innerHTML += rowContent;
        }
    }
    
    if (rowContent == null) {
        table.innerHTML = '<tr class="text-center"><td colspan="5"><strong>There are no timesheets on record for this employee.</strong></td></tr>';
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


function editUserSelect(type) {
    
    //gets user list, current user, and edit user
    var userList = JSON.parse(localStorage.getItem("userList"));
    var user = JSON.parse(localStorage.getItem("currentUser"));
    var editUserRecord = JSON.parse(localStorage.getItem("editUser"));
    
    //loops through list of all users
    for (var i = 0; i < userList.length; i++) {
        var rec = userList[i];
        
        //if the user's belong to admin's org, write record
        if (rec.organization == user.organization && type == null) {
            
            //if edit user record exists, set it as selected
            if (editUserRecord != null && rec.employeeID == editUserRecord.employeeID) {
                document.write('<option value="' + rec.employeeID + '" selected>' + rec.name + '</option>');    
            }
            else {
                document.write('<option value="' + rec.employeeID + '">' + rec.name + '</option>');
            }
        }
        else if (rec.organization == user.organization && type == "manager" && user.employeeID == rec.managerID) {
            document.write('<option value="' + rec.employeeID + '">' + rec.name + '</option>');
        }
    }
}

