
const db = require('./src/models');

async function testReadingHistory() {
    try {
        console.log('Connecting to database...');
        await db.sequelize.authenticate();
        console.log('Database connection successful.');

        const userId = 1; // Assuming user 1 exists

        console.log('Testing TarotReading query with Topic and Spread (simulating the controller)...');

        // Note: The controller logic I fixed in getReadingById includes Topic and Spread.
        // However, getUserReadings (the list view) ONLY includes cards.
        // Let's verify getUserReadings code again from my previous view.
        // It was:
        /*
        const readings = await TarotReading.findAll({
          where,
          limit: parseInt(limit),
          offset: parseInt(offset),
          order: [['created_at', 'DESC']],
          include: [{
            model: TarotReadingCard,
            as: 'cards',
            include: [{
              model: TarotCard,
              as: 'card'
            }]
          }]
        });
        */

        // But maybe the issue is that one of the models inside is invalid?
        // Let's try to query TarotSpreads directly first.
        console.log('Testing TarotSpreads table...');
        try {
            const spreads = await db.tarotSpreads.findAll();
            console.log(`Found ${spreads.length} spreads.`);
        } catch (e) {
            console.error('FAILED to query tarotSpreads table:', e.message);
        }

        // Now try the full list query
        console.log('Testing getUserReadings query structure...');
        const readings = await db.tarotReadings.findAll({
            where: { user_id: userId },
            limit: 10,
            offset: 0,
            order: [['created_at', 'DESC']],
            include: [{
                model: db.tarotReadingCards,
                as: 'cards',
                include: [{
                    model: db.tarotCards,
                    as: 'card'
                }]
            }]
        });

        console.log('getUserReadings Query successful!');
        console.log(`Found ${readings.length} readings.`);

    } catch (error) {
        console.error('TEST FAILED!');
        console.error('Error message:', error.message);
        if (error.original) {
            console.error('Original DB Error:', error.original);
        }
    } finally {
        await db.sequelize.close();
    }
}

testReadingHistory();
