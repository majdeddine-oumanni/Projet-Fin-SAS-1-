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

    console.log("Ticket acheté avec succès.");
    console.log(ticketObject);
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

        case 0:
            process.exit(0);
    }
}
