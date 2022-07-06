interface IVehicle {
  name: string;
  plate: string;
  entryTime: Date | string;
};

(function(){
  const $ = (query: string) => document.querySelector(query) as HTMLInputElement | null;
  
  function partkingLot (){ 
    // Look for saved data in localStorage - patio
    function read(): IVehicle[] {
      return localStorage.parkingLot ? JSON.parse(localStorage.parkingLot) : [];
    }

    // Save new vehicles in localStorage in format array 
    function save(vehicle: IVehicle[]){
      localStorage.setItem("parkingLot", JSON.stringify(vehicle));
    }

    // Add a new vehicle with name/plate/time
    function add(vehicle: IVehicle, needSave?: boolean){
      const row = document.createElement("tr");

      row.innerHTML = `
      <td>${vehicle.name}</td>
      <td>${vehicle.plate}</td>
      <td>${vehicle.entryTime}</td>
      <td>
        <button class="delete" data-plate="${vehicle.plate}">X</button>
      </td>
      `

      row.querySelector('.delete')?.addEventListener('click', function(){
        remove(this.dataset.plate);
      })
      $("#parking-lot")?.appendChild(row);

      // First check if it is just a render (needSave)
      // Then save all the old vehicles (spread) and the new one created above
      if (needSave) save([...read(), vehicle]);
    }

    function remove(plate: string){ 
      const vehicleExiting = read().find((vehicle) => vehicle.plate === plate);

      const timeIn = timeCalc(new Date().getTime() - new Date (vehicleExiting.entryTime).getTime());

      if(!confirm(`The vehicle ${vehicleExiting.name} stayed in for ${timeIn}. Do you wish to finish?`)) return;

      save(read().filter(vehicle => vehicle.plate !== plate));
      render();
    }

    // Wipe table body and iterate through localStorage parkingLot
    function render(){ 
      // wiping tbody (forcing because there is a tbody id=parking-lot)
      $('#parking-lot')!.innerHTML ='';
      const parkingLot = read();

      if (parkingLot.length) {
        parkingLot.forEach((vehicle) => add(vehicle));
      }
    }

    return { read, add, remove, save, render };
  }

  function timeCalc(ms: number){
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000)
    return `${min} minutes and ${sec}s`
  }


  partkingLot().render();

  // Event to create a new entry on the table
  $('#register-btn')?.addEventListener('click', () => {
    const name = $('#name')?.value;
    const plate = $('#plate')?.value;
    // console.log({name, plate});
  
    // Verifying if user sent name and plate of the vehicle
    if(!name || !plate) {
      alert('Please, fill name and plate fields');
      return;
    }
    partkingLot().add({ name, plate, entryTime: new Date().toISOString()}, true);
  })
})()