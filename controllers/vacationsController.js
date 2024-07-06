exports.vacationsController = {
    async chooseVacation(req, res) {
        const { dbConnection } = require('../db_connection');
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
            const connection = await dbConnection.createConnection();
            const [existingVacation] = await connection.execute('SELECT * FROM tbl_22_vacations WHERE user_name = ?', [user.name]);
            connection.end();
            if (existingVacation.length > 0) {
                return res.status(400).json({ success: false, message: 'User already has a vacation booked' });
            }
            const place = location;
            const userName = user.name;
            const values = [ place, startDate, userName, endDate ,vacationType];
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
                INSERT INTO tbl_22_vacations ( place, start_date, user_name, end_date , vacationType)
                VALUES (?, ?, ?, ? ,?)
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
                SET place = ?, start_date = ?, end_date = ? ,vacationType =?
                WHERE user_name = ?`;
            const values = [location,startDate, endDate,vacationType, user.name];
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
    },
    async calculateVacationResults(req,res) {
        const { dbConnection } = require('../db_connection');
        try {
            const connection = await dbConnection.createConnection();
            const [members] = await connection.execute('SELECT * FROM tbl_22_vacations');
            connection.end();
            const allPreferencesFilled =  members.every(member => member.place && member.vacationType && member.startDate && member.endDate);
            console.log('Members:', members);
            if (!allPreferencesFilled && members.length != 5) {
                return res.status(400).json({ success: false, message: "We have to wait for everyone's preferences." });
            }
            const validateDate = (date) => {
                return /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(new Date(date).getTime());
            };
    
            const invalidDates = members.filter(member => !validateDate(member.start_date.toISOString().split('T')[0]) || !validateDate(member.end_date.toISOString().split('T')[0]));
            if (invalidDates.length > 0) {
                console.log('Invalid Date Entries:', invalidDates);
                return res.status(400).json({ success: false, message: "Invalid date values provided." });
            }
            const placeCount = {};
            members.forEach(member => {
                if (member.place) {
                    if (placeCount[member.place]) {
                        placeCount[member.place]++;
                    } else {
                        placeCount[member.place] = 1;
                    }
                }
            });
            const places = Object.keys(placeCount);
            let chosenplace;
            if (places.length > 0) {
                chosenplace = places.reduce((a, b) => placeCount[a] > placeCount[b] ? a : b);
            } else {
                members.sort((a, b) => a.vacation_code - b.vacation_code);
                chosenplace = members[0].place;
            }
            const typeCount = {};
            members.forEach(member => {
                if (member.vacationType) {
                    if (typeCount[member.vacationType]) {
                        typeCount[member.vacationType]++;
                    } else {
                        typeCount[member.vacationType] = 1;
                    }
                }
            });
            const vacationTypes = Object.keys(typeCount);
            let chosenVacationType;
            if (vacationTypes.length > 0) {
                chosenVacationType = vacationTypes.reduce((a, b) => typeCount[a] > typeCount[b] ? a : b);
            } else {
                chosenVacationType = members[0].vacationType;
            }
            const startDates = members.map(member => new Date(member.start_date));
        const endDates = members.map(member => new Date(member.end_date));
        let startDate = new Date(Math.max(...startDates));
        let endDate = new Date(Math.min(...endDates));
        if (startDate > endDate) {
            return res.status(400).json({ success: false, message: "Invalid date range." });
        }
        startDate = startDate.toISOString().split('T')[0];
        endDate = endDate.toISOString().split('T')[0];
            res.json({
                success: true,
                place: chosenplace,
                vacationType: chosenVacationType,
                startDate: startDate,
                endDate: endDate
            });
        } catch (error) {
            console.error('Error fetching vacations:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    async getVacations(req, res) {
        const { dbConnection } = require('../db_connection');
        try {
            const connection = await dbConnection.createConnection();
            const [vacations] = await connection.execute('SELECT * FROM tbl_22_vacations');
            connection.end();
            res.json({ success: true, vacations });
        } catch (error) {
            console.error('Error fetching vacations:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
};