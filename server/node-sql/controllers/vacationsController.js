exports.vacationsController = {
    async chooseVacation(req, res) {
        const vacationData = require('../data/vacationData.json');
        const { vacationType, location, startDate, endDate, user } = req.body;
        if (!vacationType || !location || !startDate || !endDate || !user) {
            return res.status(400).json({ success: false, message: 'Vacation type, location, start date, end date, and user details are required' });
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        const timeDiff = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        if (diffDays > 7) {
            return res.status(400).json({ success: false, message: 'Date range must be within 7 days' });
        }
        const destinations = vacationData.destinations;
        const vacationTypes = vacationData.vacationTypes;
        if (!destinations.includes(location) || !vacationTypes.includes(vacationType)) {
            return res.status(400).json({ success: false, message: 'Invalid vacation type or location' });
        }
        const place = location;
        const userName = user.name;
        const values = [ place, startDate, userName, endDate];
        await bookVacation(req, res, values);
        res.json({ success: true, message: 'Vacation booked successfully!' });
    },
    async bookVacation(req, res, values) {
        const { dbConnection } = require('../db_connection');
        try {
            const connection = await dbConnection.createConnection();
            const query = `
                INSERT INTO tbl_vacations (vacation_code, place, start_date, user_name, end_date)
                VALUES (?, ?, ?, ?, ?)
            `;
            const [result] = await connection.execute(query, values);
            connection.end();
            res.json({ success: true, message: 'Vacation booked successfully!' });
        } catch (error) {
            console.error('Error booking vacation:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
};