window.onload = func;

function func() {
    anim = document.getElementById("changeMe");
    anim.onmouseover = function() {
        anim.innerText = "Bun venit!";

    }
    anim.onmouseleave = function() {
        anim.innerText = " Jocuri de cuvinte ";

    }
}




const list = document.getElementById('list');
const formName = document.getElementById('formName');
const formComment = document.getElementById('formComentariu');
const addButton = document.getElementById('addButton');
let updateButton = document.getElementById('updateButton');

// fetch the comments list
function getComments() {
    fetch('http://localhost:3000/comments')
        .then(function(response) {
            // Trasform server response to get the comments
            response.json().then(function(comments) {
                appendCommentsToDOM(comments);
            });
        });
};

// post comments
function postComment() {
    // creat post object
    const postObject = {
        name: formName.value,
        comment: formComment.value
    }
    if (!isNullOrWhitespace(postObject.comment) && !isNullOrWhitespace(postObject.name)) {
        // post comment
        fetch('http://localhost:3000/comments', {
            method: 'post',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(postObject)
        }).then(function() {
            // Get the new comments list
            getComments();
            // Reset Form
            resetForm();
        });
    }
}

// delete comment
function deleteComment(id) {
    // delete comment
    fetch(`http://localhost:3000/comments/${id}`, {
        method: 'DELETE',
    }).then(function() {
        // Get the new comments list
        getComments();
    });
}

// update comment
function updateComment(id) {
    // create put object
    const putObject = {
            name: formName.value,
            comment: formComment.value
        }
        // update comment
    if (!isNullOrWhitespace(putObject.comment) && !isNullOrWhitespace(putObject.name)) {
        fetch(`http://localhost:3000/comments/${id}`, {
            method: 'PUT',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(putObject)
        }).then(function() {
            // Get the new comments list
            getComments();

            // change button event from update to add
            addButton.disabled = false;

            // remove all event from update button
            clearUpdateButtonEvents();

            // Reset Form
            resetForm();
        });
    }
}

// copy edited comment information to form and add event listener on update button
function editComment(comment) {
    // copy comment information to form
    formName.value = comment.name;
    formComment.value = comment.comment;

    // disable add button
    addButton.disabled = true;

    // clear all events update button events
    clearUpdateButtonEvents();

    // enable and add event on update button
    updateButton.disabled = false;
    updateButton.addEventListener('click', function() {
        updateComment(comment.id)
    });

}

// Create and append comment and name DOM tags
function appendCommentsToDOM(comments) {
    // remove comment list if exist
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    // create and append tags
    for (let i = 0; i < comments.length; i++) {
        // create comment obj
        let comment = document.createElement('p');
        comment.innerText = comments[i].comment;
        // create name obj
        let name = document.createElement('span');
        name.innerText = comments[i].name;

        // create button and event for edit and delete
        let editButton = document.createElement('button')
            // add event on btn and pass comment id more at https://stackoverflow.com/questions/256754/how-to-pass-arguments-to-addeventlistener-listener-function
        editButton.addEventListener('click', function() {
            editComment(comments[i])
        });
        editButton.innerText = 'Edit';
        let deleteButton = document.createElement('button')
            // add event on btn and pass comment object more at https://stackoverflow.com/questions/256754/how-to-pass-arguments-to-addeventlistener-listener-function
        deleteButton.addEventListener('click', function() {
            deleteComment(comments[i].id)
        });
        deleteButton.innerText = 'Delete';
        // create a container for comment and name
        let container = document.createElement('div');
        // append elements to container
        container.appendChild(name);
        container.appendChild(comment);
        container.appendChild(editButton);
        container.appendChild(deleteButton);
        container.className += " comment";

        // append container to DOM (list div)
        list.appendChild(container);
    }
}

// reset form
function resetForm() {
    formName.value = '';
    formComment.value = '';
}
//  remove Update Button to clear events more at https://stackoverflow.com/questions/9251837/how-to-remove-all-listeners-in-an-element
function clearUpdateButtonEvents() {
    let newUpdateButton = updateButton.cloneNode(true);
    updateButton.parentNode.replaceChild(newUpdateButton, updateButton);
    updateButton = document.getElementById('updateButton');
}
// add event listener on add button
addButton.addEventListener('click', postComment);

// get comments
getComments();



//aux functions 
function isNullOrWhitespace(input) {

    if (typeof input === 'undefined' || input == null) return true;

    return input.replace(/\s/g, '').length < 1;
}