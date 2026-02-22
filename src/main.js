import "./style.css";

document.addEventListener("DOMContentLoaded", async function () {
  // element var
  const districtEl = document.getElementById("district");
  const searchInputEL = document.getElementById("search");
  // const searchBtnEl = document.getElementById("search-btn");
  const stateEl = document.getElementById("state");
  const containerEl = document.getElementById("con");
  const institutionTypeEl = document.getElementById("institution");
  const UniversityEl = document.getElementById("University");
  const programmeEl = document.getElementById("programme");
  const courseDialogEL = document.getElementById("course-info");
  const courseTableEl = document.getElementById("course-table");
  const courseDialogCloseBtnEL = document.getElementById(
    "course-dialog-close-btn",
  );
  const loadingAlertEL = document.getElementById("loading-alert");
  
  // data var
  const BASE_API_KEY = "https://indian-colleges-list.vercel.app/api";
  let collageDataArr = [];
  const allStateArr = await getState();

  getState();
  setStatesInOption(allStateArr);

  courseDialogCloseBtnEL.addEventListener("click", () =>
    courseDialogEL.close(),
  );

  // append the state value in a state dropdown values
  async function getState() {
    try {
      const response = await fetch(`${BASE_API_KEY}/institutions/states`);

      if (!response.ok) {
        throw new Error("Network response was not working");
      }

      const data = await response.json();

      return data.states;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // dropdown--1-set
  // set state options to the state dropdown menu
  function setStatesInOption(stateArr) {
    stateArr.forEach((item) => {
      const option = document.createElement("option");
      option.textContent = `${item.name}`;
      option.value = item.name;
      option.className = "text-[#E2E8F0] border-[#2E3A47] bg-[#202934]";

      stateEl.append(option);
    });
  }

  // search the state name and append the district value
  async function getSearchByState(stateName) {
    try {
      const STATE_API_KEY = `https://indian-colleges-list.vercel.app/api/institutions/states/${stateName}`;

      const response = await fetch(STATE_API_KEY);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      collageDataArr = data.data;

      renderFn(collageDataArr);

      // dropdown--2-set
      // this clear inside content of the district tag prevent previous values
      districtEl.innerHTML = "";
      // unique district name using the set method remove the duplicates
      const uniqueDistricts = [
        ...new Set(collageDataArr.map((item) => item.district)),
      ].sort();

      // district name add to the drop down list
      addDropdownValues(uniqueDistricts, districtEl);

      // All option add in dropdown in district
      addAllOptionInDropdown("Districts", districtEl);

      // dropdown--3-set
      // this clear inside the content of the university tag prevent previous values
      UniversityEl.innerHTML = "";
      // unique university name using set method to remove the duplicates
      const uniqueUniversity = [
        ...new Set(collageDataArr.map((item) => item.university)),
      ].sort();

      const valuesToRemove = ["NOT APPLICABLE", "NONE", "None", "Self", "SELF"];

      const finalValues = uniqueUniversity.filter(
        (item) => !valuesToRemove.includes(item),
      );

      // add university Dropdown values
      addDropdownValues(finalValues, UniversityEl);

      // All option add in dropdown in programme type
      addAllOptionInDropdown("Universities", UniversityEl);

      // dropdown--4-set
      // programme drop add
      programmeEl.innerHTML = "";

      const uniqueProgrammes = [
        ...new Set(
          collageDataArr.flatMap((item) =>
            item.programmes.map((p) => p.programme),
          ),
        ),
      ].sort();

      // add dropdown values for programme dropdown
      addDropdownValues(uniqueProgrammes, programmeEl);

      // All option add in dropdown in programme type
      addAllOptionInDropdown("Programmes", programmeEl);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // add dropdown values by array
  function addDropdownValues(arr, dropdown) {
    arr.forEach((val) => {
      const option = document.createElement("option");
      option.className = "text-[#E2E8F0] border-[#2E3A47] bg-[#202934]";
      option.textContent = val;
      option.value = val;
      dropdown.append(option);
    });
  }

  // add all option option on top of dropdown.
  function addAllOptionInDropdown(optionName, dropdownEL) {
    const allOptionEl = document.createElement("option");
    allOptionEl.textContent = `All ${optionName}`;
    allOptionEl.value = "All";
    allOptionEl.className = "text-[#E2E8F0] border-[#2E3A47] bg-[#202934];";
    allOptionEl.selected = true;
    dropdownEL.prepend(allOptionEl);
  }

  // result output div
  function renderFn(collageData) {
    // if no data available trigger below if
    if (
      collageData.length === 0 ||
      collageData === "" ||
      collageData === null ||
      collageData === undefined
    ) {
      containerEl.classList.add("text-white");
      containerEl.innerHTML = `<div class="col-span-full mt-5 md:mt-20">
        <img src="./public/no-data-found/empty-box.png" class="w-50 m-auto">
        <p class="text-blue-100 text-center">no data found</p>
       </div>`;
      return;
    }

    const fragment = document.createDocumentFragment();
    fragment.replaceChildren();
    containerEl.innerHTML = "";

    collageData.forEach((collage) => {
      const cardEl = document.createElement("div");
      cardEl.className =
        "bg-[#0F1C2B] w-full sm:w-87.5 min-h-50 space-y-2 shadow-lg rounded-lg shadow-lg p-5 pb-10 flex flex-col content-center border border-white/20 relative";

      function toTitleCase(text) {
        return text
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }

      const collageNameEl = document.createElement("h3");
      collageNameEl.className =
        "font-semibold text-lg text-center text-slate-200 ";
      collageNameEl.textContent = collage.institute_name;

      const universityEl2 = document.createElement("p");
      universityEl2.className = "text-slate-100 pt-1";
      universityEl2.innerHTML = `University: <span class="font-semibold text-sky-400/80">${toTitleCase(collage.state)}</span>`;

      // ${collage.institution_type}

      const institutionTypeEL = document.createElement("p");
      institutionTypeEL.innerHTML = `Institution: <span class="font-semibold text-sky-400/80">${toTitleCase(collage.institute_name)}</span>`;
      institutionTypeEL.className = "text-slate-100 ";

      const stateEl = document.createElement("p");
      stateEl.innerHTML = `State: <span class="font-semibold text-sky-400/80">${toTitleCase(collage.state)}</span>`;
      stateEl.className = "pt-2 text-slate-100";

      const districtEl = document.createElement("p");
      districtEl.innerHTML = `District: <span class="font-semibold text-sky-400/80"> ${toTitleCase(collage.district)}</span>`;
      districtEl.className = "pt-2 text-slate-100";

      const addressEl = document.createElement("p");
      addressEl.innerHTML = `Address: <span class="font-semibold text-sky-400/80">${toTitleCase(collage.address)}</span>`;
      addressEl.className = "pb-3 pt-2 text-slate-100";

      const courseBtnEl = document.createElement("button");
      courseBtnEl.className =
        "absolute right-3 bottom-3 px-3 py-2 bg-slate-800/80 text-sky-400/80 active:scale-95 transition-all  border border-transparent hover:border-sky-400 hover:bg-transparent hover:-translate-y-0.5 duration-300 ease-in-out hover:bg-gray-700/70  rounded   cursor-pointer";
      courseBtnEl.textContent = `View Courses`;

      // course info show
      // console.log(collage);

      courseBtnEl.addEventListener("click", () => courseInfoShow(collage));

      // append
      cardEl.append(
        collageNameEl,
        institutionTypeEL,
        universityEl2,
        stateEl,
        districtEl,
        addressEl,
        courseBtnEl,
      );
      fragment.append(cardEl);
    });

    containerEl.append(fragment);
  }

  // event handling

  // state change
  stateEl.addEventListener("change", function () {
    // search.value = state.value;
    getSearchByState(stateEl.value);
  });

  //  district  filter method
  districtEl.addEventListener("change", () => {
    // value is extract the html page
    const districtType = districtEl.value;

    if (districtType === "All") {
      getSearchByState(stateEl.value);
      renderFn(collageDataArr);
    } else {
      const filteredDistrictArr = collageDataArr.filter(
        (college) => college.district == districtType,
      );
      // collageDataArr = filteredDistrictArr;
      //  console.log(filteredDistrictArr);
      renderFn(filteredDistrictArr);
    }
  });

  //search by institution type
  institutionTypeEl.addEventListener("change", () => {
    // value extract in the html page
    let institutionType = institutionTypeEl.value;
    // console.log(institutionType);

    if (institutionType === "All") {
      renderFn(collageDataArr);
    } else {
      const filteredData = collageDataArr.filter(
        (collage) => collage.institution_type === institutionType,
      );
      // console.log(filteredData);
      renderFn(filteredData);
    }
  });

  // search by university
  UniversityEl.addEventListener("change", () => {
    let university = UniversityEl.value;

    if (university === "All") {
      renderFn(collageDataArr);
    } else {
      const filteredData = collageDataArr.filter(
        (collage) => collage.university === university,
      );
      renderFn(filteredData);
    }
  });

  // filter by programme
  programmeEl.addEventListener("change", () => {
    let programmeVal = programmeEl.value;
    if (programmeVal == "All") {
      renderFn(collageDataArr);
    } else {
      const filteredData = collageDataArr.filter((collage) => {
        const hasMatch = collage.programmes.some((programme) => {
          // console.log("programme: ", programme.programme);

          const isMatch = programme.programme === programmeVal;
          // console.log(isMatch);

          return isMatch;
        });

        // console.log("This collage had the course? ", hasMatch);
        // console.log("---------------------------");

        return hasMatch;
      });

      renderFn(filteredData);
    }
  });

  // input search
  // searchBtnEl.addEventListener("click", collageSearchByName);
  searchInputEL.addEventListener("input", debounce(collageSearchByName, 2000));

  function debounce(func, delay) {
    let timer;

    return function (...args) {
      clearTimeout(timer);

      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  const allCollagesArrValue = await getAllCollages(allStateArr);

  // search activate Fn
  if (allCollagesArrValue) {
    loadingAlertEL.classList.add("hidden");
    searchInputEL.readOnly = false;
    searchInputEL.title = "now you can search😊...";
    searchInputEL.classList.replace("cursor-wait", "cursor-text");
    searchInputEL.classList.add("outline", "outline-green-600", "scale-110");
    setTimeout(() => {
      searchInputEL.classList.remove(
        "outline",
        "outline-green-600",
        "scale-110",
      );
    }, 3000);
  }

  // first render All collages show
  renderFn(allCollagesArrValue);

  async function getAllCollages(arr) {
    try {
      const results = [];

      for (const state of arr) {
        const response = await fetch(
          `${BASE_API_KEY}/institutions/states/${state.name}`,
        );

        if (!response.ok) {
          throw new Error("Network response war not ok");
        }
        const data = await response.json();
        results.push(...data.data);
      }
      return results;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // search by collage name
  function collageSearchByName() {
    const searchValue = searchInputEL.value.toUpperCase();
    // console.log("fscscst aBctxx ".includes("abct"));
    const filteredData = allCollagesArrValue.filter((collage) =>
      collage.institute_name.includes(searchValue),
    );
    renderFn(filteredData);
  }

  // Individual collage course info show
  function courseInfoShow(collage) {
    const programmesArr = collage.programmes;

    courseTableEl.innerHTML = "";

    programmesArr.forEach((programme) => {
      console.log(programme);

      const trEl = document.createElement("tr");
      // course
      const courseTdEL = document.createElement("td");
      courseTdEL.textContent = programme.course;
      // level
      const levelTdEL = document.createElement("td");
      levelTdEL.textContent = programme.level;
      // programme
      const programmeTdEL = document.createElement("td");
      programmeTdEL.textContent = programme.programme;
      // course
      const availabilityTdEL = document.createElement("td");
      availabilityTdEL.textContent = programme.availability;

      // append
      trEl.append(courseTdEL, levelTdEL, programmeTdEL, availabilityTdEL);
      courseTableEl.append(trEl);
    });

    courseDialogEL.showModal();
  }
});
