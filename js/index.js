let number = 1;
const main = document.querySelector("main");

//post to local storage

const postToLocalStorage = (key, param) => {
  return localStorage.setItem(key, JSON.stringify(param));
};

//getData from localStorage

const getDataFromLocalStorage = (param) => {
  return JSON.parse(localStorage.getItem(param));
};

//fetch get data function

const getData = async (url) => {
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.data.length < 0) {
      alert("Something went wrong...");
    } else {
      console.log(data.data);
      return data;
    }
  } catch (error) {
    console.log(error.message);
  }
};

//Fetch post data function

const postData = async (url, dataToPost) => {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: dataToPost,
      }),
    });
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

//Personal information form (page 2)

const displaySecondPage = async () => {
  main.innerHTML = "";
  const section = document.createElement("section");
  main.appendChild(section);

  const progressLine = document.createElement("div");
  progressLine.classList.add("progressLine");
  progressLine.style.width = 20 * number + "%";
  section.append(progressLine);

  const pageNumber = document.createElement("span");
  pageNumber.innerHTML = `<span class="number"> ${number} <span> /5 `;
  section.appendChild(pageNumber);

  const title = document.createElement("h2");
  title.textContent = "Please fill your details";
  section.appendChild(title);

  const form = document.createElement("form");
  form.setAttribute("name", "mainInfo");
  section.append(form);

  const inputs = ["First Name", "Last Name", "Your Email"];
  inputs.forEach((item) => {
    const input = document.createElement("input");
    input.setAttribute("placeholder", `${item}`);
    input.setAttribute("name", `${item.split(" ").join("")}`);
    input.required = true;
    input.classList.add("margin");
    form.append(input);
  });

  const select = document.createElement("select");
  select.setAttribute("name", "country");
  select.classList.add("margin");
  form.append(select);

  const countries = await getData(`http://18.193.250.181:1337/api/countries`);
  countries.data.forEach((item) => {
    const option = document.createElement("option");
    option.textContent = item.attributes.country;
    option.id = item.id;
    select.append(option);
  });

  const option = document.createElement("div");
  option.classList.add("option");

  const label = document.createElement("label");
  label.setAttribute("name", `terms`);
  label.innerHTML = `Please accept our <span class="blue"> Terms and conditions </span>`;
  label.classList.add("label");

  const input = document.createElement("input");
  input.setAttribute("type", "checkbox");
  input.setAttribute("id", `terms`);
  input.classList.add("input");
  input.required = true;

  form.append(option);
  option.append(input, label);

  const line = document.createElement("div");
  line.classList.add("line");
  form.append(line);

  const button = document.createElement("button");
  button.textContent = "Next";
  button.classList.add("formBtn");
  form.append(button);
  const form1 = document.forms.mainInfo;
  form1.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = e.target.elements.FirstName.value.trim();
    const lastName = e.target.elements.LastName.value.trim();
    const email = e.target.elements.YourEmail.value.trim();
    const options = select.options;
    const country = options[options.selectedIndex].id;
    const activities = getDataFromLocalStorage("activities");

    try {
      const res = await fetch("http://18.193.250.181:1337/api/people", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            first_name: name,
            last_name: lastName,
            email,
            country,
            activities,
          },
        }),
      });
      const data = await res.json();
      postToLocalStorage("id", data.data.id);
      number++;
      confirmationOfCollectedInfo();
    } catch (error) {
      console.log(error);
    }
  });
};

//confirmation of information (page 3)

const confirmationOfCollectedInfo = async () => {
  main.innerHTML = "";
  const personId = getDataFromLocalStorage("id");
  const personInfo = await getData(
    `http://18.193.250.181:1337/api/people/${personId}?populate=country`
  );

  const section = document.createElement("section");
  section.classList.add("info");
  main.appendChild(section);

  const progressLine = document.createElement("div");
  progressLine.classList.add("progressLine");
  progressLine.style.width = 20 * number + "%";
  section.append(progressLine);

  const pageNumber = document.createElement("span");
  pageNumber.innerHTML = `<span class="number"> ${number} <span> /5 `;
  section.appendChild(pageNumber);

  const title = document.createElement("h2");
  title.textContent = "Are these details correct?";
  section.appendChild(title);

  const information = document.createElement("div");
  information.innerHTML = `
  <div class="personalInfoLine">
  <p>name</p> <p>${personInfo.data.attributes.first_name}</p>
  </div>
  <div class="personalInfoLine">
  <p>Surname</p> <p>${personInfo.data.attributes.last_name}</p>
  </div>
  <div class="personalInfoLine">
  <p>Email</p> <p>${personInfo.data.attributes.email}</p>
  </div>
  <div class="personalInfoLine">
  <p>Country</p> <p>${personInfo.data.attributes.country.data.attributes.country}</p>
  </div>`;
  section.append(information);

  const line = document.createElement("div");
  line.classList.add("line");
  section.append(line);

  const buttonDlt = document.createElement("button");
  buttonDlt.classList.add("buttonDelete");
  buttonDlt.textContent = "Oops, no";
  buttonDlt.addEventListener("click", async () => {
    try {
      const res = await fetch(
        `http://18.193.250.181:1337/api/people/${personId}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      window.localStorage.clear();
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  });

  const buttonNext = document.createElement("button");
  buttonNext.classList.add("buttonNext");
  buttonNext.textContent = "I confirm details are accurate";
  section.append(buttonDlt, buttonNext);
  buttonNext.addEventListener("click", () => {
    number++;
    email();
  });
};

//verification through email (page 4)

const email = () => {
  main.innerHTML = "";
  const section = document.createElement("section");
  section.classList.add("info");
  main.appendChild(section);

  const progressLine = document.createElement("div");
  progressLine.classList.add("progressLine");
  progressLine.style.width = 20 * number + "%";
  section.append(progressLine);

  const pageNumber = document.createElement("span");
  pageNumber.innerHTML = `<span class="number"> ${number} <span> /5 `;
  section.appendChild(pageNumber);

  const title = document.createElement("h2");
  title.textContent = "Please check your email";
  section.appendChild(title);

  const notification = document.createElement("p");
  notification.classList.add("msg");
  notification.textContent =
    "We sent you an email with all of the required information to complete the registration";
  section.append(notification);
};

//display activities (page 1)

const displayActivities = async () => {
  main.innerHTML = "";
  const data = await getData("http://18.193.250.181:1337/api/activities");

  const section = document.createElement("section");
  main.appendChild(section);

  const progressLine = document.createElement("div");
  progressLine.classList.add("progressLine");
  progressLine.style.width = 20 * number + "%";
  section.append(progressLine);

  const pageNumber = document.createElement("span");
  pageNumber.innerHTML = `<span class="number"> ${number} <span> /5 `;
  section.appendChild(pageNumber);

  const title = document.createElement("h2");
  title.textContent = "What do you usaully do after work?";
  section.appendChild(title);

  const form = document.createElement("form");
  form.setAttribute("name", "activities");
  section.append(form);

  data.data.forEach((item) => {
    const option = document.createElement("div");
    option.classList.add("option");

    const label = document.createElement("label");
    label.setAttribute("name", `${item.attributes.title.split(" ").join("")}`);
    label.textContent = `${item.attributes.title}`;
    label.classList.add("label");

    const input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    input.setAttribute("value", `${item.attributes.title}`);
    input.setAttribute("id", `${item.id}`);
    input.classList.add("input");
    input.textContent = item.attributes.title;

    option.append(input, label);
    form.appendChild(option);
  });

  const line = document.createElement("div");
  line.classList.add("line");
  form.append(line);

  const button = document.createElement("button");
  button.textContent = "Next";
  button.classList.add("formBtn");
  form.append(button);

  button.addEventListener("click", async (e) => {
    e.preventDefault();
    let checkboxes = document.querySelectorAll(
      'input[type="checkbox"]:checked'
    );
    checkboxesValues = [];
    checkboxes = Array.from(checkboxes);
    checkboxes.forEach((item) => {
      checkboxesValues.push(item.id);
    });
    if (checkboxesValues.length > 0) {
      localStorage.setItem("activities", JSON.stringify(checkboxesValues));
      number++;
    } else {
      return alert("choose activities");
    }
    displaySecondPage();
  });
};

displayActivities();
