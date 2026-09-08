let prompt = require("prompt-sync")();
const trips = require("./data.js");


function affichage(trips){
    console.log("=== TRAJETS DISPONIBLES ===");
    let count = 0;
    for(let trip of trips){
        count++;
        console.log(`
            #${count} ${trip.departure} → ${trip.destination}
            Départ : ${trip.departureTime}
            Arrivée : ${trip.arrivalTime}
            Prix : ${trip.price} DH
            Places disponibles : ${trip.availableSeats}
        `);
    }
}


while(true){
    console.log("======================================");
    console.log("         RAILWAY MANAGER              ")
    console.log("======================================");
    console.log("1. Afficher les trajets \n2. Acheter un ticket \n3. Afficher les tickets \n4. Annuler un ticket \n5. Rechercher un ticket \n6. Filtrer les trajets \n7. Trier les trajets \n0. Quitter");
    let choice = Number(prompt("Votre choix: "));
    switch(choice){
        case 1:
            affichage(trips);
            break;
        case 0:
            return false;

    }
}