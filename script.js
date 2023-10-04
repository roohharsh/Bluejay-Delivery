function handleFile() {
    const fileInput = document.getElementById('fileInput');
    const uploadButton = document.getElementById('uploadButton');
    const file = fileInput.files[0];

    if (file) {
        uploadButton.removeAttribute('disabled'); // Enable the upload button when a file is selected
    } else {
        uploadButton.setAttribute('disabled', true); // Disable the upload button when no file is selected
    }

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            // Read the content of the uploaded file
            const fileContent = e.target.result;

            // Split the file content into lines
            const lines = fileContent.split('\n');

            // Initialize variables to keep track of differnet conditions 
            let consecutiveDaysWorked = 0; // Number of consecutive days worked by an employee
            let previousDate = null; // Date of the previous record
            let previousEndTime = null; // End time of the previous record
            let currentEmployee = null; // Name of the current employee
            let currentEmployeePosition = null; // Position of the current employee
            let employeeWith7OrMoreConsecutiveDays = null; // To track employees with 7 or more consecutive days

            // Process each line of the file
            for (const line of lines) {
                const fields = line.split('\t'); // Split line into fields

                if (fields.length >= 8) {
                    const positionID = fields[0];
                    const startTime = fields[2];
                    const endTime = fields[3];
                    const timecardHours = fields[4];
                    const employeeName = fields[7];

                    // Convert timecardHours to total hours 
                    const totalHours = parseFloat(timecardHours);

                    // Check if the current line is for the same employee as the previous one
                    if (currentEmployee === employeeName) {
                        // Check consecutive days worked
                        const currentDate = new Date(startTime);
                        if (previousDate && currentDate.getDate() === previousDate.getDate() + 1) {
                            consecutiveDaysWorked++;
                        } else {
                            consecutiveDaysWorked = 1;
                        }

                        // Check hours between shifts (less than 10 hour and greater than 1 hour)
                        if (previousEndTime && currentDate - previousEndTime > 3600000 && currentDate - previousEndTime < 36000000) {
                            // Check if worked for more than 14 hours in a single shift and 7 consecutive days
                            if (totalHours > 14 && consecutiveDaysWorked >= 7 && !employeeWith7OrMoreConsecutiveDays) {
                                employeeWith7OrMoreConsecutiveDays = employeeName;
                                // Print employee name and position ID to the console
                                console.log(
                                    'Employee Name:', employeeName,
                                    'Position ID:', positionID
                                );
                            }
                        }
                    } else {
                        consecutiveDaysWorked = 1;
                    }

                    // Update previous date and end time
                    previousDate = new Date(startTime);
                    previousEndTime = new Date(endTime);

                    // Update current employee
                    currentEmployee = employeeName;
                    currentEmployeePosition = positionID;
                }
            }
        };

        // Read the file as text
        reader.readAsText(file);
    } else {
        console.error('No file selected');
    }
}
