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
  const searchAlertEl = document.getElementById("search-alert");
  const filterDivEl = document.getElementById("filter-div");
  const filteredCardCount = document.getElementById("card-count");
  const filterStatusEl = document.getElementById("filter-status");

  // data var
  const BASE_API_KEY = "https://indian-colleges-list.vercel.app/api";
  // let collageDataArr = [];
  const allStateArr = await getState();

  // filtered
  let filteredStateArr = [];
  let filteredDistrictArr = [];
  let filteredInstituteArr = [];
  let filteredUniversityArr = [];
  let filteredProgrammeArr = [];

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
      const collageDataArr = data.data;
      filteredStateArr = collageDataArr.sort((a, b) =>
        a.institute_name.trim().localeCompare(b.institute_name.trim()),
      );

      renderFn(filteredStateArr);

      // dropdown--2-set
      // this clear inside content of the district tag prevent previous values
      districtEl.innerHTML = "";
      // unique district name using the set method remove the duplicates
      const uniqueDistricts = [
        ...new Set(filteredStateArr.map((item) => item.district)),
      ].sort();

      // district name add to the drop down list
      addDropdownValues(uniqueDistricts, districtEl);

      // All option add in dropdown in district
      addAllOptionInDropdown("Districts", districtEl);

      // dropdown--2.5-set
      // this clear inside content of the Institution tag prevent previous values
      institutionTypeEl.innerHTML = "";
      // unique institution name using the set method remove the duplicates
      const uniqueInstitutions = [
        ...new Set(filteredStateArr.map((item) => item.institution_type)),
      ].sort();

      // district name add to the drop down list
      addDropdownValues(uniqueInstitutions, institutionTypeEl);

      // All option add in dropdown in district
      addAllOptionInDropdown("Institution", institutionTypeEl);

      // dropdown--3-set
      // this clear inside the content of the university tag prevent previous values
      UniversityEl.innerHTML = "";
      // unique university name using set method to remove the duplicates
      const uniqueUniversity = [
        ...new Set(filteredStateArr.map((item) => item.university)),
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
          filteredStateArr.flatMap((item) =>
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
  function renderFn(collageData, searchName = false) {
    // if no data available trigger below if
    if (
      collageData.length === 0 ||
      collageData === "" ||
      collageData === null ||
      collageData === undefined
    ) {
      containerEl.classList.add("text-white");
      containerEl.innerHTML = `<div class="col-span-full mt-5 md:mt-20">
      
        <p class="text-blue-100 text-center">No Data found</p>
       </div>`;
      // add filter el
      filterDivEl.classList.replace("flex", "hidden");
      return;
    }

    // remove search alert el
    searchAlertEl.classList.add("hidden");
    // add filter el
    filterDivEl.classList.replace("hidden", "flex");
    filteredCardCount.textContent = collageData.length;
    filterStatusEl.innerHTML = "";

    if (!searchName) {
      // state
      filterStatusEl.innerHTML += `<strong>Filtered by:</strong> ${stateEl.value} (State)`;
      // dist
      if (
        districtEl.value !== "District" &&
        districtEl.value !== "" &&
        districtEl.value !== "All"
      ) {
        filterStatusEl.innerHTML += `, ${districtEl.value} (District)`;
      }
      // institute
      if (
        institutionTypeEl.value !== "Institution" &&
        institutionTypeEl.value !== "" &&
        institutionTypeEl.value !== "All"
      ) {
        filterStatusEl.innerHTML += `, ${institutionTypeEl.value} (Institution),<br>`;
      }
      // university
      if (
        UniversityEl.value !== "University" &&
        UniversityEl.value !== "" &&
        UniversityEl.value !== "All"
      ) {
        filterStatusEl.innerHTML += `${UniversityEl.value} (University), <br>`;
      }

      // programme
      if (
        programmeEl.value !== "Programme" &&
        programmeEl.value !== "" &&
        programmeEl.value !== "All"
      ) {
        filterStatusEl.innerHTML += `${programmeEl.value} (Programme)`;
      }
    } else {
      //Name filter status
      filterStatusEl.innerHTML = `<strong>Filtered by:</strong> ${searchInputEL.value} (Collage Name)`;
    }

    // create card fn
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
      universityEl2.innerHTML = `University: <span class="font-semibold text-sky-400/80">${toTitleCase(collage.university)}</span>`;

      // ${collage.institution_type}

      const institutionTypeEL = document.createElement("p");
      institutionTypeEL.innerHTML = `Institution: <span class="font-semibold text-sky-400/80">${toTitleCase(collage.institution_type)}</span>`;
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

    // other temp data clear
    filteredDistrictArr = [];
    filteredInstituteArr = [];
    filteredUniversityArr = [];
    filteredProgrammeArr = [];

    // other options reset
    districtEl.value = "All";
    institutionTypeEl.value = "All";
    UniversityEl.value = "All";
    programmeEl.value = "All";
  });

  //  district  filter method
  districtEl.addEventListener("change", () => {
    // value is extract the html page
    const districtType = districtEl.value;

    if (districtType === "All") {
      getSearchByState(stateEl.value);
      // console.log(filteredStateArr);
      filteredDistrictArr = filteredStateArr;
      renderFn(filteredDistrictArr);
    } else {
      filteredDistrictArr = filteredStateArr.filter(
        (college) => college.district == districtType,
      );
      // collageDataArr = filteredDistrictArr;
      //  console.log(filteredDistrictArr);
      renderFn(filteredDistrictArr);

      // other temp data clear
      filteredInstituteArr = [];
      filteredUniversityArr = [];
      filteredProgrammeArr = [];

      // other options reset
      institutionTypeEl.value = "All";
      UniversityEl.value = "All";
      programmeEl.value = "All";
    }
  });

  //search by institution type
  institutionTypeEl.addEventListener("change", () => {
    // value extract in the html page
    let institutionType = institutionTypeEl.value;
    // console.log(institutionType);

    if (institutionType === "All") {
      filteredInstituteArr = filteredDistrictArr;
      renderFn(filteredInstituteArr);
    } else {
      if (filteredDistrictArr.length === 0) {
        filteredDistrictArr = filteredStateArr;
      } else {
        filteredInstituteArr = filteredDistrictArr.filter(
          (collage) => collage.institution_type === institutionType,
        );
      }
      // console.log(filteredData);
      renderFn(filteredInstituteArr);

      // other temp data clear
      filteredUniversityArr = [];
      filteredProgrammeArr = [];

      // other options reset
      UniversityEl.value = "All";
      programmeEl.value = "All";
    }
  });

  // search by university
  UniversityEl.addEventListener("change", () => {
    let university = UniversityEl.value;

    if (university === "All") {
      filteredUniversityArr = filteredInstituteArr;
      renderFn(filteredUniversityArr);
    } else {
      if (filteredInstituteArr.length === 0) {
        filteredInstituteArr = filteredDistrictArr;
        if (filteredDistrictArr.length === 0) {
          filteredInstituteArr = filteredStateArr;
        }
      } else {
        filteredUniversityArr = filteredInstituteArr.filter(
          (collage) => collage.university === university,
        );
        renderFn(filteredUniversityArr);

        // other temp data clear
        filteredProgrammeArr = [];

        // other options reset
        programmeEl.value = "All";
      }
    }
  });

  // filter by programme
  programmeEl.addEventListener("change", () => {
    let programmeVal = programmeEl.value;
    if (programmeVal == "All") {
      filteredProgrammeArr = filteredUniversityArr;
      renderFn(filteredProgrammeArr);
    } else {
      if (filteredUniversityArr.length === 0) {
        filteredUniversityArr = filteredInstituteArr;
        if (filteredInstituteArr.length === 0) {
          filteredUniversityArr = filteredDistrictArr;
          if (filteredDistrictArr.length === 0) {
            filteredUniversityArr = filteredStateArr;
          }
        }
      } else {
        filteredProgrammeArr = filteredUniversityArr.filter((collage) => {
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

        renderFn(filteredProgrammeArr);
      }
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
    searchAlertEl.classList.remove("hidden");
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
  // renderFn(allCollagesArrValue);

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
    //change filter status
    // filterStatusEl.innerHTML = `<strong>Filtered by:</strong> ${searchInputEL.value} (Collage Name)`;

    const searchValue = searchInputEL.value.trim().toUpperCase();
    // console.log("fscscst aBctxx ".includes("abct"));

    //filter fn
    if (searchValue.length > 2) {
      const filteredData = allCollagesArrValue.filter((collage) =>
        collage.institute_name.includes(searchValue),
      );
      renderFn(filteredData, true);
    }
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
