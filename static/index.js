async function getContentDogs() {
  try {
    const response = await fetch("http://localhost:3000/dogs");
    const data = await response.json();
    show(data);
  } catch (error) {
    console.log(error);
  }
}

getContentDogs();
function show(users) {
  let output = "";
  let output2 = "";
  for (let user of users) {
    output += `<div class="container">
                <div class="row justify-content-center">
                    <ul class="list-group list-group-horizontal w-auto">
                        <li class="list-group-item d-flex align-items-center" style="width: 100px";>${user.id}</li>
                        <li class="list-group-item d-flex align-items-center" style="width: 100px";>${user.name}</li>
                        <li class="list-group-item d-flex align-items-center" style="width: 100px";>${user.raça}</li>
                    </ul>
                    <a class="btn btn-white" href="/deletarDog/${user.id}"><button class="btn btn-danger">X</button></a>
                    <a class="btn" href="/editarDog/${user.id}"><button class="btn btn-success">Editar</button></a>
                </div>
            </div>`;
  }
  document.querySelector("#cachorros").innerHTML = output;
  //<li> ${user.name} - ${user.raça}</li>

  //<li class="list-group-item fs-6">${user.raça}</li>
}

async function getContentUsers() {
  try {
    const response = await fetch("http://localhost:3000/users");
    const data = await response.json();
    show2(data);
  } catch (error) {
    console.log(error);
  }
}

getContentUsers();
function show2(users2) {
  let output2 = "";
  for (let user2 of users2) {
    output2 += `<div class="container">

                    <div class="row justify-content-center">
                        <ul class="list-group list-group-horizontal w-auto">
                            <li class="list-group-item d-flex align-items-center" style="width: 100px";>${user2.id}</li>
                            <li class="list-group-item d-flex align-items-center" style="width: 100px";>${user2.name}</li>
                            <li class="list-group-item d-flex align-items-center" style="width: 100px;">${user2.password}</li>

                        </ul>
                        <a class="btn btn-white" href="/deletarUser/${user2.id}"><button class="btn btn-danger">X</button></a>
                        <a class="btn" href="/editarUser/${user2.id}"><button class="btn btn-success">Editar</button></a>
                    </div>

                </div>`;
  }
  document.querySelector("#users").innerHTML = output2;
  //<li> ${user.name} - ${user.raça}</li>

  //<li class="list-group-item fs-6">${user.raça}</li>
}

