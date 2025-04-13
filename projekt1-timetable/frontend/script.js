
        const API_URL = "http://localhost:3000/timetable";

        async function fetchTimetable() {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`Failed to fetch timetable: ${response.statusText}`);
                }
                const data = await response.json();
        
                const tbody = document.querySelector("#timetable tbody");
                console.log("Clearing table rows...");
                tbody.innerHTML = ""; // Clear existing rows
        
                data.forEach(entry => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${entry.id}</td>
                        <td>${entry.date}</td>
                        <td>${entry.hour}</td>
                        <td>${entry.subject}</td>
                        <td>
                            <button onclick="editEntry(${entry.id}, '${entry.date}', ${entry.hour}, '${entry.subject}')">Edit</button>
                            <button onclick="deleteEntry(${entry.id})">Delete</button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            } catch (error) {
                console.error("Error fetching timetable:", error);
            }
        }

        function showAddForm() {
            document.getElementById("form-title").textContent = "Add Entry";
            document.getElementById("entry-id").value = "";
            document.getElementById("date").value = "";
            document.getElementById("hour").value = "";
            document.getElementById("subject").value = "";
            document.getElementById("form-container").style.display = "block";
        }

        function editEntry(id, date, hour, subject) {
            document.getElementById("form-title").textContent = "Edit Entry";
            document.getElementById("entry-id").value = id;
            document.getElementById("date").value = date;
            document.getElementById("hour").value = hour;
            document.getElementById("subject").value = subject;
            document.getElementById("form-container").style.display = "block";
        }

        function hideForm() {
            document.getElementById("form-container").style.display = "none";
        }

        async function submitForm(event) {
            event.preventDefault();
            const id = document.getElementById("entry-id").value;
            const date = document.getElementById("date").value;
            const hour = document.getElementById("hour").value;
            const subject = document.getElementById("subject").value;

            const method = id ? "PUT" : "POST";
            const url = id ? `${API_URL}/${id}` : API_URL;

            await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ date, hour, subject })
            });

            hideForm();
            fetchTimetable();
        }

        async function deleteEntry(id) {
            if (confirm("Are you sure you want to delete this entry?")) {
                await fetch(`${API_URL}/${id}`, { method: "DELETE" });
                fetchTimetable();
            }
        }

        // Fetch timetable on page load
        fetchTimetable();