var softTyreTime = 88;
var hardTyreTime = 90;
var pitStopTime = 22;
var startingDrivers = [
    { name: "Макс Верстапен", team: "Red Bull", speed: 1.04, skill: 9.3 },
    { name: "Ландо Норис", team: "McLaren", speed: 1.06, skill: 9.1 },
    { name: "Шарл Леклер", team: "Ferrari", speed: 1.05, skill: 9.2 },
    { name: "Луис Хамилтон", team: "Ferrari", speed: 0.99, skill: 10.0 },
    { name: "Оскар Пијастри", team: "McLaren", speed: 1.07, skill: 8.9 },
    { name: "Џорџ Расел", team: "Mercedes", speed: 1.04, skill: 9.1 },
    { name: "Карлос Саинц", team: "Williams", speed: 1.01, skill: 9.6 },
    { name: "Фернандо Алонсо", team: "Aston Martin", speed: 0.98, skill: 10.0 },
    { name: "Пјер Гасли", team: "Alpine", speed: 1.02, skill: 9.2 },
    { name: "Алекс Албон", team: "Williams", speed: 1.05, skill: 9.0 }
];
var drivers = [];
var currentLap = 0;
var raceStarted = false;
var startButton = document.getElementById("startButton");
var nextLapButton = document.getElementById("nextLapButton");
var resetButton = document.getElementById("resetButton");
var driverTable = document.getElementById("driverTable");
var raceInfo = document.getElementById("raceInfo");
var winner = document.getElementById("winner");
function resetRace() {
    drivers = [];
    for (var i = 0; i < startingDrivers.length; i++) {
        var driver = {
            name: startingDrivers[i].name,
            team: startingDrivers[i].team,
            speed: startingDrivers[i].speed,
            skill: startingDrivers[i].skill,
            totalTime: 0,
            tyre: "soft",
            changedTyres: false,
            status: "На старт"
        };
        drivers.push(driver);
    }
    currentLap = 0;
    raceStarted = false;
    startButton.disabled = false;
    nextLapButton.disabled = true;
    raceInfo.innerText = "Трката сè уште не е започната.";
    winner.innerText = "";
    showTable();
}
function showTable() {
    drivers.sort(function(a, b) {
        return a.totalTime - b.totalTime;
    });
    driverTable.innerHTML = "";
    for (var i = 0; i < drivers.length; i++) {
        var row = document.createElement("tr");
        var tyreName = "";
        if (drivers[i].tyre === "soft") {
            tyreName = "Меки";
        } else {
            tyreName = "Тврди";
        }
        var statusClass = "";
        if (drivers[i].status.indexOf("Пит-стоп") !== -1) {
            statusClass = "status-pit";
        } else if (drivers[i].status.indexOf("Извртување") !== -1) {
            statusClass = "status-spin";
        } else if (drivers[i].status.indexOf("Безбедносно") !== -1) {
            statusClass = "status-safety";
        }
        row.innerHTML =
            "<td>" + (i + 1) + "</td>" +
            "<td>" + drivers[i].name + "</td>" +
            "<td>" + drivers[i].team + "</td>" +
            "<td>" + tyreName + "</td>" +
            "<td>" + drivers[i].totalTime.toFixed(2) + " s</td>" +
            '<td class="' + statusClass + '">' + drivers[i].status + "</td>";
        driverTable.appendChild(row);
    }
}
function startRace() {
    if (raceStarted === true) {
        return;
    }
    raceStarted = true;
    startButton.disabled = true;
    nextLapButton.disabled = false;
    for (var i = 0; i < drivers.length; i++) {
        drivers[i].status = "Трката започна";
    }
    raceInfo.innerText = "Старт! Круг 0 од 10.";
    showTable();
}
function nextLap() {
    if (raceStarted === false || currentLap === 10) {
        return;
    }
    currentLap++;
    var safetyCar = false;
    if (Math.random() < 0.10) {
        safetyCar = true;
    }
    for (var i = 0; i < drivers.length; i++) {
        var driver = drivers[i];
        driver.status = "Нормално возење";
        if (driver.changedTyres === false && currentLap >= 3) {
            var enterPit = false;
            if (currentLap === 8) {
                enterPit = true;
            } else if (Math.random() < 0.30) {
                enterPit = true;
            }
            if (enterPit === true) {
                driver.totalTime = driver.totalTime + pitStopTime;
                if (driver.tyre === "soft") {
                    driver.tyre = "hard";
                } else {
                    driver.tyre = "soft";
                }
                driver.changedTyres = true;
                driver.status = "Пит-стоп";
            }
        }
        var lapTime = softTyreTime;
        if (driver.tyre === "hard") {
            lapTime = hardTyreTime;
        }
        lapTime = lapTime / driver.speed;
        lapTime = lapTime - (driver.skill - 8) * 0.45;
        lapTime = lapTime + Math.random() * 1.5;
        if (Math.random() < 0.06) {
            lapTime = lapTime + 10;
            driver.status = "Извртување / излетување";
        }
        if (safetyCar === true) {
            lapTime = lapTime + 5;
            if (driver.status === "Нормално возење") {
                driver.status = "Безбедносно возило";
            }
        }
        driver.totalTime = driver.totalTime + lapTime;
    }
    raceInfo.innerText = "Завршен круг " + currentLap + " од 10.";
    if (safetyCar === true) {
        raceInfo.innerText = raceInfo.innerText +
            " Излезе безбедносно возило!";
    }
    showTable();
    if (currentLap === 10) {
        finishRace();
    }
}
function finishRace() {
    nextLapButton.disabled = true;
    drivers.sort(function(a, b) {
        return a.totalTime - b.totalTime;
    });
    winner.innerText = " Победник: " + drivers[0].name +
        " - " + drivers[0].totalTime.toFixed(2) + " секунди!";
    raceInfo.innerText = "Трката е завршена по 10 круга.";
    showTable();
}
startButton.addEventListener("click", startRace);
nextLapButton.addEventListener("click", nextLap);
resetButton.addEventListener("click", resetRace);
resetRace();
