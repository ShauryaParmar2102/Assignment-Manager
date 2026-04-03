
// Retrieve assignments from localStorage or initialize empty array
let assignments = JSON.parse(localStorage.getItem('Assignments')) || [];

// DOM Elements
const AssignmentManagerContainer = document.querySelector(".AssignmentManager");
const confirmEl = document.querySelector(".confirm");
const confirmedBtn = confirmEl.querySelector(".confirmed");
const cancelledBtn = confirmEl.querySelector(".cancel");
const AssignmentForm = document.getElementById('AssignmentForm');
const AssignmentInput = document.getElementById('AssignmentInput');
const AssignmentContainer = document.getElementById('AssignmentContainer');
const confirmText = document.querySelector('p')

let indexToBeDeleted = null;


// Form submit
AssignmentForm.addEventListener('submit', handleFormSubmit);

// Confirm deletion
confirmedBtn.addEventListener("click", () => {
    confirmEl.style.display = "none";
    AssignmentManagerContainer.classList.remove("overlay");
    deleteAssignment(indexToBeDeleted);
});

// Cancel deletion
cancelledBtn.addEventListener("click", () => {
    confirmEl.style.display = "none";
    AssignmentManagerContainer.classList.remove("overlay");
});

// Handle form submission
function handleFormSubmit(event){
    event.preventDefault();
    const AssignmentTextValue = AssignmentInput.value.trim();

    if (AssignmentTextValue !== '') { //Checks if value not empty

//Creates a new assignment object: text stores name, and completed is false bcoz assignment isn't submitted yet
        const newAssignment = {
            text: AssignmentTextValue,
            completed: false,
        };

        assignments.push(newAssignment); //Adds new assignment to Array

        saveAssignments(); //Saves updated assignments array to local storage

        AssignmentInput.value = ''; //Clears input field in the form so that users can type new assignment easily

        renderAssignments(); //Calls function to update the UI and display the new assignment in the list.
    }
}

// Save assignments to localStorage
function saveAssignments(){
    localStorage.setItem('Assignments', JSON.stringify(assignments));
}

// Delete an assignment
function deleteAssignment(index){
    assignments.splice(index, 1);
    saveAssignments();
    renderAssignments();
}

// Toggle completed status
function toggleCompleted(index){
    assignments[index].completed = !assignments[index].completed;
    saveAssignments();
    renderAssignments();
}

// Render all assignments
function renderAssignments() {
    AssignmentContainer.innerHTML = '';

    assignments.forEach((assignment, index) => {
        const AssignmentCard = document.createElement('div');
        AssignmentCard.classList.add('AssignmentCard');

        // Status
        let statusClass = assignment.completed ? "completed" : "pending";
        let statusText = assignment.completed ? "Submitted" : "Pending";

        AssignmentCard.classList.add(statusClass);

        // Assignment text
        const AssignmentTextEl = document.createElement('p');
        AssignmentTextEl.innerText = assignment.text;

        // Status label
        const AssignmentStatusEl = document.createElement('p');
        AssignmentStatusEl.classList.add('status');
        AssignmentStatusEl.innerText = statusText;

        // Toggle button
        const toggleButton = document.createElement('button');
        toggleButton.classList.add('button-box');
        toggleButton.innerText = assignment.completed ? "Mark Pending" : "Mark Submitted";
        toggleButton.addEventListener('click', () => toggleCompleted(index));

        //Edit button
        const editButton = document.createElement('button');
        editButton.classList.add('button-box', 'edit-btn');
        editButton.innerText = 'Edit';

        editButton.addEventListener('click', () => {
            const newText = prompt("Edit Assignment:", assignment.text);
            if (newText !== null && newText.trim() !== ""){
                 assignment.text = newText.trim();
                 saveAssignments();
                 renderAssignments();
            }
        });

        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('button-box', 'delete-btn');
        deleteButton.innerText = "Delete";
        deleteButton.addEventListener('click', () => {
            indexToBeDeleted = index;
            confirmText.innerText = `Are you sure you want to delete: "${assignment.text}"?`
            confirmEl.style.display = "block";
            AssignmentManagerContainer.classList.add("overlay");
        });

        // Append all elements
        AssignmentCard.appendChild(AssignmentTextEl);
        AssignmentCard.appendChild(AssignmentStatusEl);
        AssignmentCard.appendChild(toggleButton);
        AssignmentCard.appendChild(deleteButton);
        AssignmentCard.appendChild(editButton);

        AssignmentContainer.appendChild(AssignmentCard);
    });
}

// Initial render
renderAssignments();