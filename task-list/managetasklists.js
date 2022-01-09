var uid = localStorage.getItem('uid');
var jwt = localStorage.getItem('jwt');
var client = localStorage.getItem('client');

const createTask = async () => {

    const name = document.getElementById('inputTaskname').value;
    const description = document.getElementById('inputDescription').value;
    if (name && description != null){
    const createTaskRequest = await fetch(`https://tasklist-minh.herokuapp.com/task_lists`, {
        method: 'POST',
        headers: {
            'Access-Token': jwt,
            'UID': uid,
            'Client': client,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name, description
        })
    });
    window.location.href = "tasklists.html"
}
}


function taskListRequest() {

    const request = new XMLHttpRequest();
    request.open("GET", 'https://tasklist-minh.herokuapp.com/task_lists');
    request.setRequestHeader("Access-Token", jwt);
    request.setRequestHeader("Uid", uid);
    request.setRequestHeader("Client", client);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send();

    var counter = 0;

    request.onreadystatechange = function () {
        if (this.readyState == 4) {
            const taskList = JSON.parse(this.responseText);
            for (let list of taskList) {
                var tbody = document.getElementById('addtask');
                var tr = document.createElement('tr');

                var num = document.createElement('td');
                var nameoftask = document.createElement('td');
                var status = document.createElement('td');
                var description = document.createElement('td');
                var actionlist = document.createElement('td');

                var ul = document.createElement('ul');
                var a_edit = document.createElement('a');
                var a_delete = document.createElement('a');
                var a_done = document.createElement('a');
                var btn_edit = document.createElement('button');
                var btn_delete = document.createElement('button');
                var btn_done = document.createElement('button');

                a_done.setAttribute('data-toggle', 'modal');
                a_edit.setAttribute('data-toggle', 'modal');
                a_delete.setAttribute('data-toggle', 'modal');
                a_done.setAttribute('data-target', '#doneModal');
                a_edit.setAttribute('data-target', '#editModal');
                a_delete.setAttribute('data-target', '#deleteModal');
                

                ul.className = "action-list";

                btn_done.className = 'btn btn-primary';
                btn_edit.className = 'btn btn-warning';
                btn_delete.className = 'btn btn-danger';
                

                // set btn text
                btn_edit.innerText = 'Edit'
                btn_delete.innerText = 'Delete'
                btn_done.innerText = 'Done'

                tbody.appendChild(tr);
                tr.appendChild(num)
                tr.appendChild(nameoftask);
                tr.appendChild(status);
                tr.appendChild(description);
                tr.appendChild(actionlist);

                actionlist.appendChild(ul);

                ul.appendChild(a_edit);
                ul.appendChild(a_delete);
                ul.appendChild(a_done);

                a_done.appendChild(btn_done);
                a_edit.appendChild(btn_edit);
                a_delete.appendChild(btn_delete);

                num.innerHTML = counter + 1;
                nameoftask.innerHTML = list['name'];
                if (list['done'] != null) {
                    status.innerHTML = 'Done';
                } else {
                    status.innerHTML = "Processing";
                }
                description.innerHTML = list['description'];

                a_edit.className = 'taskedit';
                a_delete.className = 'taskdelete';
                a_done.className = 'taskdone';

                var edit = document.getElementsByClassName('taskedit')[counter];
                edit.addEventListener('click', function () {
                    var btnedit = document.getElementById('editTaskButton');

                    btnedit.addEventListener('click', function () {
                        var nameoftask = document.getElementById('editTaskname').value;
                        var taskdescription = document.getElementById('editDescription').value;

                        const requestEdit = new XMLHttpRequest();
                        requestEdit.open("PATCH", `https://tasklist-minh.herokuapp.com/task_lists/${list['id']}`);
                        requestEdit.setRequestHeader("Access-Token", jwt);
                        requestEdit.setRequestHeader("Uid", uid);
                        requestEdit.setRequestHeader("Client", client);
                        requestEdit.setRequestHeader("Content-Type", "application/json");

                        requestEdit.send(JSON.stringify({
                            "name": nameoftask,
                            "description": taskdescription
                        }));
                        requestEdit.onreadystatechange = function () {
                            if (this.readyState == 4) {
                                location.reload();

                            }
                        }
                    })

                })

                var deleted = document.getElementsByClassName('taskdelete')[counter];
                deleted.addEventListener('click', function(){
                    var buttondelete = document.getElementById('deleteTaskButton');

                    buttondelete.addEventListener('click', function(){

                        const requestDelete = new XMLHttpRequest();
                        requestDelete.open("DELETE", `https://tasklist-minh.herokuapp.com/task_lists/${list['id']}`);
                        requestDelete.setRequestHeader("Content-Type", "application/json");
                        requestDelete.setRequestHeader("Access-Token", jwt);
                        requestDelete.setRequestHeader("Uid", uid);
                        requestDelete.setRequestHeader("Client", client);

                        requestDelete.send();

                        requestDelete.onreadystatechange = function () {
                            if (this.readyState == 4) {
                                location.reload();

                            }
                        }
                    })

                })

                var checkdone = document.getElementsByClassName('taskdone')[counter];
                checkdone.addEventListener('click', function(){
                    var buttondone = document.getElementById('markdoneButton');

                    buttondone.addEventListener('click', function(){

                        const requestCheck = new XMLHttpRequest();
                        requestCheck.open("PATCH", `https://tasklist-minh.herokuapp.com/task_lists/todos${list['id']}`);
                        requestCheck.setRequestHeader("Access-Token", jwt);
                        requestCheck.setRequestHeader("UID", uid);
                        requestCheck.setRequestHeader("Client", client);
                        requestCheck.setRequestHeader("Content-Type", "application/json");

                        requestCheck.send(JSON.stringify({
                            "done" : true
                        }));
                        requestCheck.onreadystatechange = function () {
                            if (this.readyState == 4) {
                                location.reload();

                            }
                        }
                    })
                })

                counter++;

            }

        }
    };
}

if (jwt && uid && client != null) {
    
    }
    else{
        window.location.href = '../index.html';
    }