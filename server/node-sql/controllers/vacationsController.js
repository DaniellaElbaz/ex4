exports.vacationsController = {
    async chooseVacation(req, res) {
        const vacationData = require('../data/vacation.json');
        const { vacationsController } = require('./vacationsController');
        const { bookVacation } = vacationsController;
        console.log('bookVacation:', bookVacation);
        const { usersController } = require('./usersController');
        const { getUser } = usersController;
        console.log('getUser:', getUser);
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
        if (!user.name || !user.access_code) {
            return res.status(400).json({ success: false, message: 'Invalid user details' });
        }
        try {
             const userInDatabase = await getUser(user.name, user.access_code);
             if (!userInDatabase) {
                 return res.status(404).json({ success: false, message: 'User not found in database' });
                  }
                const place = location;
                const userName = user.name;
                const values = [ place, startDate, userName, endDate];
                await bookVacation(req, res, values);
            } catch (error) {
                console.error('Error choosing vacation:', error);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
    },
    async bookVacation(req, res, values) {
        const { dbConnection } = require('../db_connection');
        try {
            const connection = await dbConnection.createConnection();
            const query = `
                INSERT INTO tbl_22_vacations ( place, start_date, user_name, end_date)
                VALUES (?, ?, ?, ?)
            `;
            const [result] = await connection.execute(query, values);
            connection.end();
            res.json({ success: true, message: 'Vacation booked successfully!' });
        } catch (error) {
            console.error('Error booking vacation:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    async updateVacationDetails(req, res) {
        const { dbConnection } = require('../db_connection');
        const { usersController } = require('./usersController');
        const { getUser } = usersController;
        console.log('getUser:', getUser);
        const { vacationType, location, startDate, endDate, user } = req.body;
        console.log( vacationType, location, startDate, endDate, user );
        if (!vacationType || !location || !startDate || !endDate || !user) {
            return res.status(400).json({ success: false, message: 'Access code and updated values are required' });
        }
        try {
            const connection = await dbConnection.createConnection();
            const userInDatabase = await getUser(user.name, user.access_code);
             if (!userInDatabase) {
                 return res.status(404).json({ success: false, message: 'User not found in database' });
                  }
            if (user.length === 0) {
                connection.end();
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            const query = `
                UPDATE tbl_22_vacations
                SET place = ?, start_date = ?, end_date = ?
                WHERE user_name = ?`;
            const values = [location,startDate, endDate, user.name];
            const [result] = await connection.execute(query, values);
            connection.end();
            if (result.affectedRows > 0) {
                res.json({ success: true, message: 'Vacation details updated successfully' });
            } else {
                res.status(404).json({ success: false, message: 'No vacation details found for the user' });
            }
        } catch (error) {
            console.error('Error updating vacation details:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
};