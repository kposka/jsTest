const tableBody = document.querySelector("tbody");

const test = async () => {
  const res = await fetch(`http://18.193.250.181:1337/api/people`);
  const data = res.json();
  console.log(data);
};

test();

// number of visitors

const countNumberOfVisitors = () => {
  const dashboardVisitors = document.querySelector("#visitors");
  dashboardVisitors.textContent = Math.floor(Math.random() * 5000) + 5000;
};

countNumberOfVisitors();

//number of users

const countNUmberOfUsers = (data) => {
  const dashboardUsers = document.querySelector("#users");
  const numberOfUsers = data.meta.pagination.total;
  dashboardUsers.textContent = numberOfUsers;
};

//get unique countries

const getUniqueCountries = (data) => {
  let uniqueCountriesArray = [];

  const uniqueCountries = data.data
    .filter((item) => item.attributes.country.data !== null)
    .forEach((country) => {
      uniqueCountriesArray.push(
        country.attributes.country.data.attributes.country
      );
    });

  return (uniqueCountriesArray = uniqueCountriesArray.filter(
    (item, index, a) => a.indexOf(item) === index
  ));
};

//unique countries

const displaysumOfUniqueCountries = (data) => {
  const dashboardCountries = document.querySelector("#countries");
  dashboardCountries.textContent = data.length;
};

//not capitalized name

const countSumOfNotCapitalizedNames = (data) => {
  const capitalizedNamesDashboard = document.querySelector(
    "#notCapitalizedNames"
  );
  capitalizedNamesDashboard.textContent = data.data.filter((item) => {
    return (
      item.attributes.first_name.charAt(0) !=
        item.attributes.first_name.charAt(0).toUpperCase() ||
      item.attributes.last_name.charAt(0) !=
        item.attributes.last_name.charAt(0).toUpperCase()
    );
  }).length;
};

//country options

const displayCountryOptions = async () => {
  const countrySelect = document.querySelector("#country");
  try {
    const res = await fetch("http://18.193.250.181:1337/api/countries");
    const data = await res.json();
    if (data.data.length > 0) {
      data.data.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.attributes.country;
        option.id = item.id;
        option.textContent = item.attributes.country;
        countrySelect.appendChild(option);
      });
    } else {
      alert("something went wrong");
    }
  } catch (error) {
    console.log(error);
  }
};

//filterData

const searchFilter = async () => {
  const searchQuery = document.querySelector("#search");
  searchQuery.addEventListener("keyup", async () => {
    const query = searchQuery.value.trim();
    console.log(query);
    try {
      const res = await fetch(
        `http://18.193.250.181:1337/api/people?populate=*&pagination[pageSize]=100&filters[$or][0][first_name][$containsi]=${query}&filters[$or][1][last_name][$containsi]=${query}&filters[$or][2][email][$containsi]=${query}&filters[$or][3][country][country][$containsi]=${query}`
      );
      const data = await res.json();
      if (data.data.length > 0) {
        displayItems(data);
        countSumOfNotCapitalizedNames(data);
        const uniqueCountries = getUniqueCountries(data);
        displaysumOfUniqueCountries(uniqueCountries);
      } else {
        alert("there is nothing to display");
      }
    } catch (error) {
      console.log(error);
    }
  });
};

searchFilter();

//search by country

const searchByCountry = async () => {
  const countriesSelect = document.querySelector("#country");
  countriesSelect.addEventListener("change", async () => {
    const countryToFilter = countriesSelect.value;
    try {
      const res = await fetch(
        `http://18.193.250.181:1337/api/people?populate=*&filters[country][country][$eq]=${countryToFilter}`
      );
      const data = await res.json();
      if (data.data.length > 0) {
        displayItems(data);
        countSumOfNotCapitalizedNames(data);
        const uniqueCountries = getUniqueCountries(data);
        displaysumOfUniqueCountries(uniqueCountries);
        countNUmberOfUsers(data);
      } else {
        alert("nothing to display");
      }
    } catch (error) {
      console.log(error);
    }
  });
};

searchByCountry();

//display items

const displayItems = (data) => {
  const mappedData = data.data.map((item) => {
    return {
      ...item,
      fullname: item.attributes.first_name + " " + item.attributes.last_name,
      initials:
        item.attributes.first_name.charAt(0).toUpperCase() +
        item.attributes.last_name.charAt(0).toUpperCase(),
    };
  });
  tableBody.innerHTML = "";

  mappedData.forEach((item) => {
    const tr = tableBody.insertRow();
    const firstLetters = tr.insertCell();
    firstLetters.innerHTML = `
    <div class="user">
              <div class="frame">
                    ${item.initials}
               </div>
              <div class="userInfo">
                <p class='name'>
                    ${item.fullname} 
                 </p>
                <p class='email'>${item.attributes.email}</p>
              </div>
            </div>
    `;
    const country = tr.insertCell();
    country.classList.add("padding");
    country.textContent =
      item.attributes.country.data !== null
        ? item.attributes.country.data.attributes.country
        : "none";
  });
};

//get data

const getData = async (url) => {
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log(data);
    if (data.data.length > 0) {
      displayItems(data);
      displayCountryOptions(data);
      countNUmberOfUsers(data);
      const uniqueCountries = getUniqueCountries(data);
      displaysumOfUniqueCountries(uniqueCountries);
      countSumOfNotCapitalizedNames(data);
    } else {
      alert("something went wrong");
    }
  } catch (error) {
    alert(error.message);
  }
};

getData(
  "http://18.193.250.181:1337/api/people?populate=*&pagination[pageSize]=100"
);
