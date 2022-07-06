;
(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function partkingLot() {
        // Look for saved data in localStorage - patio
        function read() {
            return localStorage.parkingLot ? JSON.parse(localStorage.parkingLot) : [];
        }
        // Save new vehicles in localStorage in format array 
        function save(vehicle) {
            localStorage.setItem("parkingLot", JSON.stringify(vehicle));
        }
        // Add a new vehicle with name/plate/time
        function add(vehicle, needSave) {
            var _a, _b;
            const row = document.createElement("tr");
            row.innerHTML = `
      <td>${vehicle.name}</td>
      <td>${vehicle.plate}</td>
      <td>${vehicle.entryTime}</td>
      <td>
        <button class="delete" data-plate="${vehicle.plate}">X</button>
      </td>
      `;
            (_a = row.querySelector('.delete')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
                remove(this.dataset.plate);
            });
            (_b = $("#parking-lot")) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            // First check if it is just a render (needSave)
            // Then save all the old vehicles (spread) and the new one created above
            if (needSave)
                save([...read(), vehicle]);
        }
        function remove(plate) {
            const vehicleExiting = read().find((vehicle) => vehicle.plate === plate);
            const timeIn = timeCalc(new Date().getTime() - new Date(vehicleExiting.entryTime).getTime());
            if (!confirm(`The vehicle ${vehicleExiting.name} stayed in for ${timeIn}. Do you wish to finish?`))
                return;
            save(read().filter(vehicle => vehicle.plate !== plate));
            render();
        }
        // Wipe table body and iterate through localStorage parkingLot
        function render() {
            // wiping tbody (forcing because there is a tbody id=parking-lot)
            $('#parking-lot').innerHTML = '';
            const parkingLot = read();
            if (parkingLot.length) {
                parkingLot.forEach((vehicle) => add(vehicle));
            }
        }
        return { read, add, remove, save, render };
    }
    function timeCalc(ms) {
        const min = Math.floor(ms / 60000);
        const sec = Math.floor((ms % 60000) / 1000);
        return `${min} minutes and ${sec}s`;
    }
    partkingLot().render();
    // Event to create a new entry on the table
    (_a = $('#register-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        var _a, _b;
        const name = (_a = $('#name')) === null || _a === void 0 ? void 0 : _a.value;
        const plate = (_b = $('#plate')) === null || _b === void 0 ? void 0 : _b.value;
        // console.log({name, plate});
        // Verifying if user sent name and plate of the vehicle
        if (!name || !plate) {
            alert('Please, fill name and plate fields');
            return;
        }
        partkingLot().add({ name, plate, entryTime: new Date().toISOString() }, true);
    });
})();
