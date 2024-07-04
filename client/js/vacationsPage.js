
window.onload = () => {
    fetch("http://127.0.0.1:8081/api/vacation")
    .then(response => response.json())
    .then(data => fillHeader(data));
}
function fillHeader(data){
    const headerTitle =document.getElementById("selectVacation");
    let header= document.createElement("h1");
    header.innerText= `${data.category}`;
    let addVacationButton = document.createElement('button');
    addVacationButton.classList.add('addVacationButton');
    addVacationButton.innerText="Login / Log";
    addVacationButton.onclick = function () {
        userLog();
    }
    headerTitle.appendChild(header);
    headerTitle.appendChild(addVacationButton);
}
function userLog(){
    let main = document.getElementsByTagName('main')[0];
    main.innerHTML="";
    const form = document.createElement('form');
    form.classList.add('form-container');
    const heading = document.createElement('h1');
    heading.innerText = 'Login';
    form.appendChild(heading);
    const userNameLabel = document.createElement('label');
    userNameLabel.htmlFor = 'user_name';
    userNameLabel.innerText = 'user name';
    form.appendChild(userNameLabel);
    const userName = document.createElement('input');
    userName.id = 'user_name';
    userName.placeholder = 'Enter user name';
    form.appendChild(userName);
    const passwordLabel = document.createElement('label');
    passwordLabel.htmlFor = 'password';
    passwordLabel.innerText = 'Password';
    form.appendChild(passwordLabel);
    const passwordInput = document.createElement('input');
    passwordInput.id = 'password';
    passwordInput.placeholder = 'Enter Password';
    form.appendChild(passwordInput);
    const loginButton = document.createElement('button');
    loginButton.classList.add('btn');
    loginButton.innerText = 'Login';
    form.appendChild(loginButton);
    main.appendChild(form);
}
function initPlaces(){
    let inputregretsContainer = document.createElement('div');
    inputregretsContainer.classList.add('inputregretsContainer');
    let inputName = document.createElement('div');
    inputName.classList.add('members-input');
    const eventMembers = document.createElement('select');
    eventMembers.classList.add('help-selected');
    for (const member of data.members) {
        if (member.name == userName) {
            const option = document.createElement('option');
            option.value = " ";
            option.text = " ";
            option.selected = true;
            eventMembers.appendChild(option);
        }
        else{
            for (const event of member.events) {
                if (event.id == selectionEventId) {
                    const option = document.createElement('option');
                    option.value = member.name;
                    option.text = member.name;
                    eventMembers.appendChild(option);
                }
            }
        }
    }
    let inputDetails = document.createElement('div');
    inputDetails.classList.add('help-input');
    eventMembers.addEventListener('change', function() {
        openRegrets = isValueSelectedNotNo(eventMembers);

        inputDetails.innerHTML="";
        initMembersBox(inputDetails);
    });
    inputName.appendChild(eventMembers);
    const names = document.createElement('p');
    names.textContent = "אדם שתרצה/י לשבח בפועלו";
    inputName.appendChild(names);
    inputregretsContainer.appendChild(inputName);
    inputregretsContainer.appendChild(initMembersBox(inputDetails));
    return inputregretsContainer;
}