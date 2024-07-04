let data;
window.onload = () => {
    fetch("../data/vacation.json")
    .then(response => response.json())
    .then(data => fillHeader(data));
}
function fillHeader(data){
    const headerTitle =document.getElementById("selectVacation");
    let header= document.createElement("h1");
    header.innerText= `${data.category}`;
    let addVacationButton = document.createElement('button');
    addVacationButton.classList.add('addVacationButton');
    addVacationButton.innerText="add your vacation";
    headerTitle.appendChild(header);
    headerTitle.appendChild(addVacationButton);
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