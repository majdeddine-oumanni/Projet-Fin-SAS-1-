let prompt = require("prompt-sync")();
const trips = require("./data.js");
let tickets = require("./ticket.js");


let availableSeats = [];

let ticketIdGenerator = 0;


function affichage(trips) {
    console.log("=== TRAJETS DISPONIBLES ===");

    let count = 0;

    for (let trip of trips) {
        count++;

        let availableSeatsNum = trip.availableSeats;

        let bookedTrip = availableSeats.find(seat => seat.id == trip.id);

        if (bookedTrip) {
            availableSeatsNum -= bookedTrip.availableSeatsNum;
        }

        console.log(`
            #${count} ${trip.departure} → ${trip.destination}
            Départ : ${trip.departureTime}
            Arrivée : ${trip.arrivalTime}
            Prix : ${trip.price} DH
            Places disponibles : ${availableSeatsNum}
        `);
    }
}


function ticketBuy() {
    const passengerName = prompt("Entrez votre Nom: ");
    const tripId = Number(prompt("Entrez Identifiant du trajet: "));

    let foundTrip = false;
    let tripObject;

    let ticketObject = {
        id: undefined,
        passengerName,
        tripId,
        seatNumber: 1,
        ticketPrice: undefined
    };


    for (let trip of trips) {
        if (trip.id == tripId) {
            foundTrip = true;
            tripObject = trip;
            break;
        }
    }

    if (!foundTrip) {
        console.log("Trajet introuvable");
        return;
    }

    let bookedTrip = availableSeats.find(seat => seat.id == tripObject.id);

    let bookedSeats = bookedTrip ? bookedTrip.availableSeatsNum : 0;

    if (tripObject.availableSeats - bookedSeats <= 0) {
        console.log("Train complet.");
        return;
    }
    ticketIdGenerator++;

    ticketObject.id = ticketIdGenerator;

    ticketObject.passengerName = passengerName;
    ticketObject.ticketPrice = tripObject.price;
    ticketObject.tripId = tripObject.id;

    if (bookedTrip) {
        bookedTrip.availableSeatsNum++;
    } else {
        availableSeats.push({
            id: tripObject.id,
            availableSeatsNum: 1
        });
    }

    tickets.push(ticketObject);

    console.log("\nTicket acheté avec succès.\n");
    console.log(ticketObject);
}

function ticketDisplay(tickets){
    console.log("=== TICKETS ===");

    let count = 0;

    for (let ticket of tickets) {
        count++;

        let trajet = trips.find(trip => trip.id == ticket.tripId)

        console.log(`
            Ticket #${count}
            Passager : ${ticket.passengerName}
            Trajet : ${trajet.departure} → ${trajet.destination}
            Place : ${ticket.seatNumber}
            Prix : ${ticket.ticketPrice} DH
        `);
    }
}

function ticketDelete() {
    let ticketId = Number(prompt("Identifiant du ticket: "));

    let ticketIndex = tickets.findIndex(ticket => ticket.id == ticketId);

    if (ticketIndex !== -1) {
        tickets.splice(ticketIndex, 1);
        console.log("Ticket annulé avec succès.");
    } else {
        console.log("Ticket introuvable.");
    }
}

function ticketResearch(){
    let ticketOwner = prompt("Nom du passager : ");
    let ticketGroup = [];
    let found = false;
    for(let ticket of tickets){
        if(ticket.passengerName == ticketOwner){
            ticketGroup.push(ticket);
            found = true;
        }
    }

    ticketDisplay(ticketGroup);

    if(!found){
        console.log("Ticket introuvable.");
    }

}

function tripsFilter(){
    let departCity = prompt("Ville de départ : ");
    let tripsGroup = [];
    let found = false;
    for(let trip of trips){
        if(trip.departure.toLocaleLowerCase() == departCity.trim().toLocaleLowerCase()){
            tripsGroup.push(trip);
            found = true;
        }
    }
    if(found){
        for(let trip of tripsGroup){
            console.log(`${trip.departure} --> ${trip.destination} : ${trip.price} DH`);
        }
    }else if(!found){
        console.log("Trajet introuvable.");
    }
}

function tripsSortingByPrice(){
    for(let i in trips){
        
        for(let j = 0; j < trips.length - 1; j++){
            if(trips[j].price > trips[j+1].price){
                let save = trips[j];
                trips[j] = trips[j+1];
                trips[j+1] = save;
            }
        }
    }
    for(let trip of trips){
        console.log(`\n${trip.departure} --> ${trip.destination} : ${trip.price} DH`);
    }
}

function ticketTotalNumber(){
    let somme = 0; 
    for(let ticket in tickets){
        somme++;
    }
    console.log(`\nNombre total de tickets : ${somme}\n`);
}

function ticketsRevenue(){
    let totalRevenue = 0; 
    for(let ticket of tickets){
        totalRevenue += ticket.ticketPrice;
    }
    console.log(`Chiffre d'affaires total : ${totalRevenue}`);
}

function mostSoldTrip(trips) {
    let minimumSeatsTrip = trips[0];

    for (let trip of trips) {
        if (trip.availableSeats < minimumSeatsTrip.availableSeats) {
            minimumSeatsTrip = trip;
        }
    }

    let ticketsSold = 50 - minimumSeatsTrip.availableSeats;

    console.log(`\n${minimumSeatsTrip.departure} --> ${minimumSeatsTrip.destination}`);
    console.log(`${ticketsSold} tickets vendus\n`);
}

while (true) {
    console.log("======================================");
    console.log("         RAILWAY MANAGER              ");
    console.log("======================================");

    console.log(
        "1. Afficher les trajets \n" +
        "2. Acheter un ticket \n" +
        "3. Afficher les tickets \n" +
        "4. Annuler un ticket \n" +
        "5. Rechercher un ticket \n" +
        "6. Filtrer les trajets \n" +
        "7. Trier les trajets \n" +
        "8. Nombre total de tickets vendus \n" +
        "9. Calculer la somme des prix des tickets. \n" +
        "10. Afficher le Trajet le plus vendu. \n" +
        "0. Quitter"
    );

    let choice = Number(prompt("Votre choix: "));

    switch (choice) {
        case 1:
            affichage(trips);
            break;

        case 2:
            ticketBuy();
            break;

        case 3:
            ticketDisplay(tickets);
            break;

        case 4:
            ticketDelete();
            break;

        case 5:
            ticketResearch();
            break;

        case 6:
            tripsFilter();
            break;

        case 7:
            tripsSortingByPrice();
            break;

        case 8:
            ticketTotalNumber();
            break;

        case 9:
            ticketsRevenue();
            break;

        case 10:
            mostSoldTrip();
            break;

        case 0:
            process.exit(0);
        
        default:
            console.log("Choix invalide!!")
    }
}
