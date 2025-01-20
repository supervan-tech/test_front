import Express from 'express';
import {getConnection} from "./mysql";
import {Chance} from 'chance';
import {DateTime} from 'luxon';

const app = Express()
const port = 3000

app.get('/', (req, res) => {
    console.log('Hello World!');
    res.send('Hello World!');
})


app.get('/stats', async (req, res) => {

    // Create the connection to database
    const connection = await getConnection();

    // A simple SELECT query
    const [results, fields] = await connection.query(
        'SELECT * FROM `table` WHERE `name` = "Page" AND `age` > 45'
    );

    console.log(results); // results contains rows returned by server
    console.log(fields); // fields contains extra metadata about results, if available

    // Using placeholders
    try {
        const [results] = await connection.query(
            'SELECT * FROM `table` WHERE `name` = ? AND `age` > ?',
            ['Page', 45]
        );

        console.log(results);
    } catch (err) {
        console.log(err);
    }

    res.json({
        totalOrderCount: 0,
        OrderCountByStatus: [
            {status: 'Pending', count: 0},
            {status: 'In progress', count: 0},
            {status: 'Completed', count: 0}
        ]
    });
});

app.get('/seed', async (req, res) => {

    const connection = await getConnection();
    const chance = new Chance();

    const deliveries: {
        start_lat: any;
        start_lng: any;
        start_address: any;
        end_lat: any;
        end_lng: any;
        end_address: any;
        total_weight: any;
        pickup_date_time: any;
        delivery_date_time: any;
        buyer_firstname: any;
        buyer_lastname: any;
        buyer_phone: any;
        buyer_email: any;
        pickup_contact_firstname: any;
        pickup_contact_lastname: any;
        pickup_contact_phone: any;
        pickup_contact_email: any;
        delivery_contact_firstname: any;
        delivery_contact_lastname: any;
        delivery_contact_phone: any;
        delivery_contact_email: any;
        price: any;
        status: any;
    }[] = [];
    const steps = [];
    const regularisations = [];

    let numDeliveries = 100;
    for (let i = 1; i <= numDeliveries; i++) {
        // Dates et heures avec luxon
        const startDateTime = DateTime.now().minus({days: chance.integer({min: 1, max: 30})}); // Début aléatoire dans le passé
        const endDateTime = startDateTime.plus({hours: chance.integer({min: 1, max: 48})}); // Fin entre 1h et 48h après

        const delivery = {
            start_lat: chance.latitude({min: -90, max: 90}).toFixed(7),
            start_lng: chance.longitude({min: -180, max: 180}).toFixed(7),
            start_address: chance.address(),
            end_lat: chance.latitude({min: -90, max: 90}).toFixed(7),
            end_lng: chance.longitude({min: -180, max: 180}).toFixed(7),
            end_address: chance.address(),
            total_weight: chance.floating({min: 0.1, max: 100, fixed: 2}),
            pickup_date_time: startDateTime.toSQL(), // Format SQL luxon
            delivery_date_time: endDateTime.toSQL(),
            buyer_firstname: chance.first(),
            buyer_lastname: chance.last(),
            buyer_phone: chance.phone(),
            buyer_email: chance.email(),
            pickup_contact_firstname: chance.first(),
            pickup_contact_lastname: chance.last(),
            pickup_contact_phone: chance.phone(),
            pickup_contact_email: chance.email(),
            delivery_contact_firstname: chance.first(),
            delivery_contact_lastname: chance.last(),
            delivery_contact_phone: chance.phone(),
            delivery_contact_email: chance.email(),
            price: chance.floating({min: 20, max: 500, fixed: 2}),
            status: chance.pickone(['Pending', 'In progress', 'Completed'])
        };
        deliveries.push(delivery);

        // Étapes
        const numSteps = chance.integer({min: 1, max: 10});
        let stepStart = startDateTime; // L'heure de début de la première étape correspond à la date de début de la commande
        for (let j = 1; j <= numSteps; j++) {
            const stepEnd = stepStart.plus({minutes: chance.integer({min: 30, max: 120})}); // Chaque étape dure 30 à 120 minutes

            steps.push({
                step_code: chance.guid(),
                order_id: i,
                start: stepStart.toSQL(),
                end: stepEnd.toSQL()
            });

            stepStart = stepEnd; // L'heure de fin devient le début de l'étape suivante
        }

        // Régularisations
        const numRegularisations = chance.integer({min: 0, max: 3});
        for (let k = 1; k <= numRegularisations; k++) {
            regularisations.push({
                order_id: i,
                price_delta: chance.floating({min: -50, max: 50, fixed: 2})
            });
        }
    }

    try {

        // Désactivation de la vérification des clés étrangères pour éviter les conflits (si nécessaire)
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');

        // Insérer les livraisons (deliveries)
        for (const delivery of deliveries) {
            const result = await connection.query(
                `INSERT INTO deliveries
                 (start_lat, start_lng, start_address, end_lat, end_lng, end_address, total_weight, pickup_date_time,
                  delivery_date_time,
                  buyer_firstname, buyer_lastname, buyer_phone, buyer_email,
                  pickup_contact_firstname, pickup_contact_lastname, pickup_contact_phone, pickup_contact_email,
                  delivery_contact_firstname, delivery_contact_lastname, delivery_contact_phone, delivery_contact_email,
                  price, status)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    delivery.start_lat,
                    delivery.start_lng,
                    delivery.start_address,
                    delivery.end_lat,
                    delivery.end_lng,
                    delivery.end_address,
                    delivery.total_weight,
                    delivery.pickup_date_time,
                    delivery.delivery_date_time,
                    delivery.buyer_firstname,
                    delivery.buyer_lastname,
                    delivery.buyer_phone,
                    delivery.buyer_email,
                    delivery.pickup_contact_firstname,
                    delivery.pickup_contact_lastname,
                    delivery.pickup_contact_phone,
                    delivery.pickup_contact_email,
                    delivery.delivery_contact_firstname,
                    delivery.delivery_contact_lastname,
                    delivery.delivery_contact_phone,
                    delivery.delivery_contact_email,
                    delivery.price,
                    delivery.status
                ]
            );


            // Obtenir l'ID de la commande insérée
            // @ts-ignore
            const orderId = result[0].insertId;

            // Insérer les étapes (steps) liées à la commande
            for (const step of steps.filter(step => step.order_id === deliveries.indexOf(delivery) + 1)) {
                await connection.query(
                    `INSERT INTO steps (step_code, order_id, start, end)
                     VALUES (?, ?, ?, ?)`,
                    [step.step_code, orderId, step.start, step.end]
                );
            }

            // Insérer les régularisations (regularisations) liées à la commande
            for (const regul of regularisations.filter(regul => regul.order_id === deliveries.indexOf(delivery) + 1)) {
                await connection.query(
                    `INSERT INTO regularisations (order_id, price_delta)
                     VALUES (?, ?)`,
                    [orderId, regul.price_delta]
                );
            }
        }

        // Réactivation des clés étrangères (si désactivées plus tôt)
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('Données insérées avec succès.');
    } catch (err) {
        console.error('Erreur lors de l\'insertion des données :', err);
    } finally {
        // Fermer la connexion
        await connection.end();
        console.log('Connexion fermée.');
    }

    res.send('Seeding completed.');
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})