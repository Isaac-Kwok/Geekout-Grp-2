function groupPendingRidesByDateTimeAndPickUp(data) {
    const pendingRides = data.filter(ride => ride.status === 'Pending');
    const groupedData = [];

    for (const ride of pendingRides) {
        const currentDateTime = new Date(ride.date + 'T' + ride.time);
        let addedToGroup = false;

        for (const group of groupedData) {
            const firstRideInGroup = group[0];
            const groupDateTime = new Date(firstRideInGroup.date + 'T' + firstRideInGroup.time);

            if (ride.pickUp === firstRideInGroup.pickUp && Math.abs(currentDateTime - groupDateTime) <= 5 * 60 * 1000) {
                group.push(ride);
                addedToGroup = true;
                break;
            }
        }

        if (!addedToGroup) {
            groupedData.push([ride]);
        }
    }

    return groupedData;
}

function splitListsIfNeeded(groupedData) {
    const updatedGroupedData = [];

    for (const group of groupedData) {
        let currentGroup = [];
        let groupPassengerCount = 0;

        for (const ride of group) {
            if (groupPassengerCount + ride.numberOfPassengers > 3) {
                updatedGroupedData.push(currentGroup);
                currentGroup = [];
                groupPassengerCount = 0;
            }

            currentGroup.push(ride);
            groupPassengerCount += ride.numberOfPassengers;
        }

        if (currentGroup.length > 0) {
            updatedGroupedData.push(currentGroup);
        }
    }

    return updatedGroupedData;
}


const sampleData = [
    {
        "requestId": 20,
        "userId": 2,
        "name": "user1",
        "date": "2023-08-19",
        "time": "16:15:00",
        "pickUp": "Serangoon NEX",
        "destination": "Dover MRT",
        "numberOfPassengers": 1,
        "status": "Pending",
        "createdAt": "2023-08-08T05:35:13.000Z",
        "updatedAt": "2023-08-08T05:35:13.000Z"
    },
    {
        "requestId": 21,
        "userId": 3,
        "name": "user2",
        "date": "2023-08-19",
        "time": "16:20:00",
        "pickUp": "Serangoon NEX",
        "destination": "Buona Vista MRT",
        "numberOfPassengers": 2,
        "status": "Pending",
        "createdAt": "2023-08-08T05:36:18.000Z",
        "updatedAt": "2023-08-08T05:36:18.000Z"
    },
    {
        "requestId": 22,
        "userId": 4,
        "name": "user3",
        "date": "2023-08-19",
        "time": "16:55:00",
        "pickUp": "Ang Mo Kio",
        "destination": "HarbourFront MRT",
        "numberOfPassengers": 1,
        "status": "Pending",
        "createdAt": "2023-08-08T05:37:22.000Z",
        "updatedAt": "2023-08-08T05:37:22.000Z"
    },
    {
        "requestId": 22,
        "userId": 4,
        "name": "user3",
        "date": "2023-08-19",
        "time": "16:17:00",
        "pickUp": "Serangoon NEX",
        "destination": "HarbourFront MRT",
        "numberOfPassengers": 1,
        "status": "Pending",
        "createdAt": "2023-08-08T05:37:22.000Z",
        "updatedAt": "2023-08-08T05:37:22.000Z"
    }
    ,
    {
        "requestId": 22,
        "userId": 4,
        "name": "user3",
        "date": "2023-08-19",
        "time": "16:17:00",
        "pickUp": "Ang Mo Kio",
        "destination": "HarbourFront MRT",
        "numberOfPassengers": 3,
        "status": "Pending",
        "createdAt": "2023-08-08T05:37:22.000Z",
        "updatedAt": "2023-08-08T05:37:22.000Z"
    },
    {
        "requestId": 22,
        "userId": 4,
        "name": "user3",
        "date": "2023-08-19",
        "time": "16:14:00",
        "pickUp": "Ang Mo Kio",
        "destination": "HarbourFront MRT",
        "numberOfPassengers": 1,
        "status": "Pending",
        "createdAt": "2023-08-08T05:37:22.000Z",
        "updatedAt": "2023-08-08T05:37:22.000Z"
    },
    {
        "requestId": 22,
        "userId": 4,
        "name": "user3",
        "date": "2023-08-19",
        "time": "16:55:00",
        "pickUp": "Ang Mo Kio",
        "destination": "HarbourFront MRT",
        "numberOfPassengers": 1,
        "status": "Accepted",
        "createdAt": "2023-08-08T05:37:22.000Z",
        "updatedAt": "2023-08-08T05:37:22.000Z"
    }
];

const groupedRides = groupPendingRidesByDateTimeAndPickUp(sampleData);
console.log(splitListsIfNeeded(groupedRides))