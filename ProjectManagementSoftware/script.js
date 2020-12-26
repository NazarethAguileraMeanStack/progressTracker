
class Project {
    constructor(name, minutesPerDay) {
        this.projectName = name;
        this.float = 5;
        this.numberOfTasks = 0;
        this.totalDuration = 0;
        this.tasks = [];
        this.MINUTES_PER_DAY = minutesPerDay;
        this.DOM.addProjectToDOM(name);
    }

    DOM = {
        addProjectToDOM: function(name) {
            this.addToNavBar(name);
            this.initializeSection(name);
            this.intializeHeader(name);
            this.generateBackgroundColor(name)
        },
        addToNavBar: function(name) {
            let nav = document.getElementById('nav');
            let newNavItem = document.createElement('a');
            newNavItem.setAttribute('href', `#${name}`);
            newNavItem.innerText = `${name}`;
            nav.appendChild(newNavItem);    
        },
        initializeSection: function(name) {
            let body = document.getElementById('root');
            let section = document.createElement('div');
            section.setAttribute('id', `${name}`);
            body.appendChild(section);    
        },
        intializeHeader: function(name) {
            let currentSection = document.getElementById(name);
            let header = document.createElement('h2');
            header.innerText = `${name}`;
            currentSection.appendChild(header);
        },
        generateBackgroundColor: function(name) {
            let section = document.getElementById(`${name}`);
            let r = this.generateColor();
            let g = this.generateColor();
            let b = this.generateColor();
            section.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        },
        generateColor: function() {
            return 235 + Math.floor(Math.random() * 15);
        },
        display: {
            progressBar: function(percentComplete, name) {
                let percentDisplay = document.getElementById(`${name}`);
                let node = document.createElement('p');
                node.innerText = `${(percentComplete).toFixed(2)}%`;
                percentDisplay.appendChild(node);
                let progressBar = document.createElement('progress');
                progressBar.setAttribute('value', percentComplete);
                progressBar.setAttribute('max', 100);
                percentDisplay.appendChild(progressBar);
            },
            taskListTable: function(projectName, numOfTasks, tasksArray, totalDuration) {
                let section = document.getElementById(`${projectName}`);
                let table = document.createElement('table');
                table.innerHTML = `<thead>
                <th>#</th>
                <th>Task Name</th>
                <th>Task Duration</th>
                <th>% of total project</th>
                </thead>`;
                section.appendChild(table);
                let tableBody = document.createElement('tbody');
                for (let i = 0; i < numOfTasks; i++) {
                    let tableRow = document.createElement('tr');
                    if (tasksArray[i].isComplete === true) {
                        tableRow.classList.add('isComplete');
                    } else {
                        tableRow.classList.add('isNotStarted');
                    }
                    tableRow.innerHTML = `<td>${i + 1}</td>
                    <td>${tasksArray[i].name}</td>
                    <td>${tasksArray[i].duration} Minutes</td>
                    <td>${((tasksArray[i].duration / totalDuration) * 100).toFixed(2) }%</td>`;
                    tableBody.appendChild(tableRow);
                }
                table.appendChild(tableBody);
            },
            tableDistributionTable: function(projectName, days, minutesPerDay) {
                let section = document.getElementById(`${projectName}`);
                let subHeader = document.createElement('h2');
                subHeader.innerText = `${minutesPerDay} minutes per Day - ${days.length} Days`;
                section.appendChild(subHeader);
                let table = document.createElement('table');
                table.innerHTML = `<thead>
                <th>Day</th>
                <th>Task Names</th>
                <th>Total Minutes</th>
                </thead>`;
                section.appendChild(table);
                let tableBody = document.createElement('tbody');
                for (let i = 0; i < days.length; i++) {
                    let tableRow = document.createElement('tr');
                    tableRow.innerHTML = `<td>Day ${i + 1}</td>
                    <td>${days[i].list.map((element) => {
                        if (element.isDone === true) return `<p class='isComplete'>${element.taskName}</p>`;
                        else return `<p>${element.taskName}</p>`
                    }).join('')}</td>
                    <td>${days[i].totalTime}</td>`;
                    tableBody.appendChild(tableRow);
                }
                table.appendChild(tableBody);
            },
        }
    };


    addTask(taskName, taskDuration, isComplete) {
        if (taskDuration <= this.get_minutesPerDay()) {
            let task = {};
            task.name = taskName;
            task.duration = taskDuration;
            this.totalDuration += task.duration;
            task.isComplete = isComplete;
            this.tasks.push(task);
            this.numberOfTasks++;
        } else {
            let counter = 1;
            while (taskDuration > this.get_minutesPerDay()) {
                let task = {};
                task.name = (counter > 1) ? `${taskName} - (cont.${counter})`: `${taskName}`; 
                task.duration = this.get_minutesPerDay();
                this.totalDuration += task.duration;
                task.isComplete = isComplete;
                this.tasks.push(task);
                this.numberOfTasks++;
                counter++;
                taskDuration -= this.get_minutesPerDay();
            }
            if (taskDuration > 0) {
                let task = {};
                task.name = `${taskName} - (cont.${counter})`;
                task.duration = taskDuration;
                this.totalDuration += task.duration;
                task.isComplete = isComplete;
                this.tasks.push(task);
                this.numberOfTasks++;
            }
        }
        
    }

    get_float() {
        return this.float;
    }

    get_numberOfTasks() {
        return this.numberOfTasks;
    }

    get_totalDuration() {
        return this.totalDuration;
    }

    get_minutesPerDay() {
        return this.MINUTES_PER_DAY;
    }

    get_projectName() {
        return this.projectName;
    }

    calc_sumOfMinutesCompleted() {
        let totalMinutes = 0;
        for (let i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].isComplete) totalMinutes += this.tasks[i].duration;
        }

        return totalMinutes;
    }

    calc_tasksPerDay(numOfTasks, tasks, minutesPerDay, float) {
        let days = [];
        let day = [];
        let count = 0;

        for (let i = 0; i < numOfTasks - 1; i++) {
            day.push({taskName: tasks[i].name, isDone: tasks[i].isComplete});
            count += tasks[i].duration;
            if (count >= minutesPerDay || (count + tasks[i + 1].duration > (minutesPerDay + float))) {
                days.push({list: day, totalTime: count}); 
                count = 0;
                day = [];
            }
        }

        if (day.length !== 0) days.push({list: day, totalTime: count}); 
        if (days[days.length - 1].totalTime + tasks[tasks.length - 1].duration <= (minutesPerDay + float) ) {
            days[days.length - 1].list.push({taskName: tasks[tasks.length - 1].name, isDone: tasks[tasks.length - 1].isComplete});
            days[days.length - 1].totalTime += tasks[tasks.length - 1].duration
        } else {
            days.push({list: [{taskName: tasks[tasks.length - 1].name, isDone: tasks[tasks.length - 1].isComplete}], totalTime: tasks[tasks.length - 1].duration});
        }
        return days;
    }

    displayProgressBar() {
        let value = (this.calc_sumOfMinutesCompleted() / this.get_totalDuration()) * 100;
        this.DOM.display.progressBar(value, this.get_projectName());
    }
 

    displayTaskList() {
        let name = this.get_projectName();
        let numOfTasks = this.get_numberOfTasks();
        let tasksArray = this.tasks;
        let totalDuration = this.get_totalDuration();

        this.DOM.display.taskListTable(name, numOfTasks, tasksArray, totalDuration);
    
    }

    displayTaskDistribution() {
        let numOfTasks = this.get_numberOfTasks();
        let tasksArray = this.tasks;
        let minutesPerDay = this.get_minutesPerDay();
        let projectName = this.get_projectName();
        let float = this.get_float();

        let days = this.calc_tasksPerDay(numOfTasks, tasksArray, minutesPerDay, float);

        this.DOM.display.tableDistributionTable(projectName, days, minutesPerDay);

    }

    displayAll() {
        this.displayProgressBar();
        this.displayTaskList();
        this.displayTaskDistribution();
    }




}


// CompTIA(220 - 1001) Class
let core1 = new Project('CompTIA(220 - 1001) Class', 120);
core1.addTask('Write Mobile Device (Test Prep) Flashcards', 84, true);
core1.addTask('Write Networking (Test Prep) Flashcards', 110, true);
core1.addTask('Write Hardware (Test Prep) Flashcards', 282, true);
core1.addTask('Write Virtualization and Cloud Computing (Test Prep) Flashcards', 20, true);
core1.addTask('Write Hardware and Networking Troubleshooting (Test Prep) Flashcards', 220, true);

core1.addTask('Messer - 1.1 - Laptop Hardware', 21, true); 
core1.addTask('Messer - 1.2 - Laptop Displays', 8, false);
core1.addTask('Messer - 1.3 - Laptop Features', 10, false);
core1.addTask('Messer - 1.4 - Mobile Devices', 6, false);
core1.addTask('Messer - 1.5 - Mobile Device Connections',  8, false);
core1.addTask('Messer - 1.5 - Mobile Device Accessories', 6, false);
core1.addTask('Messer - 1.6 - Mobile Device Connectivity', 8, false);
core1.addTask('Messer - Configuring Email on Mobile Devices', 8, false);
core1.addTask('Messer - 1.7 - Mobile Device Synchronization', 6, false);
core1.addTask('Messer - 2.1 - Introduction to IP', 13, false);
core1.addTask('Messer - 2.1 - Common Network Ports', 11, false);
core1.addTask('Messer - 2.2 - Network Devices', 18, false);
core1.addTask('Messer - 2.3 - Installing a SOHO Network', 7, false);
core1.addTask('Messer - 2.3 - Configuring a SOHO Firewall', 11, false);
core1.addTask('Messer - 2.4 - 802.11 Wiresless Standards', 7, false);
core1.addTask('Messer - 2.4 - Wireless Network Technologies', 8, false);
core1.addTask('Messer - 2.4 - Cellular Network Technologies', 3, false);
core1.addTask('Messer - 2.5 - Network Services', 12 , false);
core1.addTask('Messer - 2.6 - An Overview of IPv4 and IPv6', 7, false);
core1.addTask('Messer - 2.6 - Assigning IP Addresses', 8, false);
core1.addTask('Messer - 2.6 - Using IP Addresses', 7, false);
core1.addTask('Messer - 2.7 - Internet Connection Types', 11, false);
core1.addTask('Messer - 2.7 - Network Types', 6, false);
core1.addTask('Messer - 2.8 - Network Tools', 12, false);
core1.addTask('Messer - 3.1 - Copper Network Cables', 13, false);
core1.addTask('Messer - 3.1 - Fiber Network Cables', 4, false);
core1.addTask('Messer - 3.1 - Video Cables', 7, false);
core1.addTask('Messer - 3.1 - Multipurpose Cables', 8, false);
core1.addTask('Messer - 3.1 - SATA Drive Cables', 3, false);
core1.addTask('Messer - 3.1 - PATA Drive Cables', 4, false);
core1.addTask('Messer - 3.1 - SCSI Drive Cables', 7, false);
core1.addTask('Messer - 3.1 - Adapters and Converters', 4, false);
core1.addTask('Messer - 3.2 - Connectors', 9, false);
core1.addTask('Messer - 3.3 - Overview of Memory', 9, false);
core1.addTask('Messer - 3.3 - Memory Technologies', 6, false);
core1.addTask('Messer - 3.4 - Storage Devices', 10, false);
core1.addTask('Messer - 3.4 - RAID', 8, false);
core1.addTask('Messer - 3.5 - Motherboard from Form Factors', 7, false);
core1.addTask('Messer - 3.5 - Motherboard Expansion Slots', 12, false);
core1.addTask('Messer - 3.5 - Motherbaord Connectors', 7, false);
core1.addTask('Messer - 3.5 - BIOS', 6, false);
core1.addTask('Messer - 3.5 - BIOS Options', 8, false);
core1.addTask('Messer - 3.5 - BIOS Security', 5, false);
core1.addTask('Messer - 3.5 - Installing BIOS Upgrades', 6, false);
core1.addTask('Messer - 3.5 - CPU Features', 11, false);
core1.addTask('Messer - 3.5 - CPU Cooling', 7, false);
core1.addTask('Messer - 3.5 - Expansion Cards', 6, false);
core1.addTask('Messer - 3.6 - Peripherals', 13, false);
core1.addTask('Messer - 3.7 - Computer Power', 13, false);
core1.addTask('Messer - 3.8 - Custom Computer Systems', 7, false);
core1.addTask('Messer - 3.9 - Common Devices', 6, false);
core1.addTask('Messer - 3.10 - SOHO Multifunction Devices', 7, false);
core1.addTask('Messer - 3.11 - Laser Printers', 11, false);
core1.addTask('Messer - 3.11 - Laser Printer Maintenance', 5, false);
core1.addTask('Messer - 3.11 - Inkjet Printers', 6, false);
core1.addTask('Messer - 3.11 - Inkjet Printer Maintenance', 4, false);
core1.addTask('Messer - 3.11 - Thermal Printers', 3, false);
core1.addTask('Messer - 3.11 - Thermal Printer Maintenance', 3, false);
core1.addTask('Messer - 3.11 - Impact Printers', 5, false);
core1.addTask('Messer - 3.11 - Impact Printer Maintenance', 4, false);
core1.addTask('Messer - 3.11 - Virtual and 3D Printers', 6, false);
core1.addTask('Messer - 4.1 - Cloud Models', 10, false);
core1.addTask('Messer - 4.1 - Cloud Services', 7, false);
core1.addTask('Messer - 4.2 - Client-Side Virtualization', 8, false);
core1.addTask('Messer - 5.1 - How to Troubleshoot', 11, false);
core1.addTask('Messer - Troubleshooting Common Hardware Problems', 20, false);
core1.addTask('Messer - 5.3 - Troubleshooting Hard Drives', 7, false);
core1.addTask('Messer - Troubleshooting Video and Display Issues', 8, false);
core1.addTask('Messer - 5.5 - Troubleshooting Laptops', 8, false);
core1.addTask('Messer - 5.5 - Troubleshooting Mobile Devices', 10, false);
core1.addTask('Messer - Device Disassembly Best Practices', 5, false);
core1.addTask('Messer - Troubleshooting Printers', 11, false);
core1.addTask('Messer - Troubleshooting Networks', 11, false);

core1.addTask('Study x3 Mobile Device Flashcards', 90, false);
core1.addTask('Study x3 Networking Flashcards', 218, false);
core1.addTask('Study x3 Hardware Flashcards', 396, false);
core1.addTask('Study x3 Virtualization and Cloud Computing Flashcards', 23, false);
core1.addTask('Study x3 Hardware and Networking Troubleshooting Flashcards', 226, false);
core1.addTask('Study x3 Mobile Device (Test Prep) Flashcards', 151, false);
core1.addTask('Study x3 Networking (Test Prep) Flashcards', 198, false);
core1.addTask('Study x3 Hardware (Test Prep) Flashcards', 507, false);
core1.addTask('Study x3 Virtualization and Cloud Computing (Test Prep) Flashcards', 36, false);
core1.addTask('Study x3 Hardware and Networking Troubleshooting (Test Prep) Flashcards', 396, false);

core1.addTask('Quiz - Mobile Device Flashcards', 30, false);
core1.addTask('Review - Mobile Device Flashcards', 10, false);
core1.addTask('Quiz - Mobile Device Flashcards', 30, false);
core1.addTask('Review - Mobile Device Flashcards', 10, false);

core1.addTask('Quiz - Networking Flashcards', 73, false);
core1.addTask('Review - Networking Flashcards', 10, false);
core1.addTask('Quiz - Networking Flashcards', 73, false);
core1.addTask('Review - Networking Flashcards', 10, false);

core1.addTask('Quiz - Hardware Flashcards', 132, false);
core1.addTask('Review - Hardware Flashcards', 10, false);
core1.addTask('Quiz - Hardware Flashcards', 132, false);
core1.addTask('Review - Hardware Flashcards', 10, false);

core1.addTask('Quiz - Virtualization and Cloud Computing Flashcards', 8, false);
core1.addTask('Review - Virtualization and Cloud Computing Flashcards', 10, false);
core1.addTask('Quiz - Virtualization and Cloud Computing Flashcards', 8, false);
core1.addTask('Review - Virtualization and Cloud Computing Flashcards', 10, false);

core1.addTask('Quiz - Hardware and Networking Troubleshooting Flashcards', 75, false);
core1.addTask('Review - Hardware and Networking Troubleshooting Flashcards', 10, false);
core1.addTask('Quiz - Hardware and Networking Troubleshooting Flashcards', 75, false);
core1.addTask('Review - Hardware and Networking Troubleshooting Flashcards', 10, false);

core1.addTask('Quiz - Mobile Device (Test Prep) Flashcards', 25, false);
core1.addTask('Review - Mobile Device (Test Prep) Flashcards', 10, false);
core1.addTask('Quiz - Mobile Device (Test Prep) Flashcards', 25, false);
core1.addTask('Review - Mobile Device (Test Prep) Flashcards', 10, false);

core1.addTask('Quiz - Networking (Test Prep) Flashcards', 33, false);
core1.addTask('Review - Networking (Test Prep) Flashcards', 10, false);
core1.addTask('Quiz - Networking (Test Prep) Flashcards', 33, false);
core1.addTask('Review - Networking (Test Prep) Flashcards', 10, false);

core1.addTask('Quiz - Hardware (Test Prep) Flashcards', 84, false);
core1.addTask('Review - Hardware (Test Prep) Flashcards', 10, false);
core1.addTask('Quiz - Hardware (Test Prep) Flashcards', 84, false);
core1.addTask('Review - Hardware (Test Prep) Flashcards', 10, false);

core1.addTask('Quiz - Virtualization and Cloud Computing (Test Prep) Flashcards', 6, false);
core1.addTask('Review - Virtualization and Cloud Computing (Test Prep) Flashcards', 10, false);
core1.addTask('Quiz - Virtualization and Cloud Computing (Test Prep) Flashcards', 6, false);
core1.addTask('Review - Virtualization and Cloud Computing (Test Prep) Flashcards', 10, false);

core1.addTask('Quiz - Hardware and Networking Troubleshooting (Test Prep) Flashcards', 66, false);
core1.addTask('Review - Hardware and Networking Troublshooting (Test Prep) Flashcards', 10, false);
core1.addTask('Quiz - Hardware and Networking Troubleshooting (Test Prep) Flashcards', 66, false);
core1.addTask('Review - Hardware and Networking Troublshooting (Test Prep) Flashcards', 10, false);

core1.addTask('Quiz - Mobile Device Flashcards', 30, false);
core1.addTask('Review - Mobile Device Flashcards', 10, false);
core1.addTask('Quiz - Networking Flashcards', 73, false);
core1.addTask('Review - Networking Flashcards', 10, false);
core1.addTask('Quiz - Hardware Flashcards', 132, false);
core1.addTask('Review - Hardware Flashcards', 10, false);
core1.addTask('Quiz - Virtualization and Cloud Computing Flashcards', 8, false);
core1.addTask('Review - Virtualization and Cloud Computing Flashcards', 10, false);
core1.addTask('Quiz - Hardware and Networking Troubleshooting Flashcards', 75, false);
core1.addTask('Review - Hardware and Networking Troubleshooting Flashcards', 10, false);
core1.addTask('Quiz - Mobile Device (Test Prep) Flashcards', 25, false);
core1.addTask('Review - Mobile Device (Test Prep) Flashcards', 10, false);
core1.addTask('Quiz - Networking (Test Prep) Flashcards', 33, false);
core1.addTask('Review - Networking (Test Prep) Flashcards', 10, false);
core1.addTask('Quiz - Hardware (Test Prep) Flashcards', 84, false);
core1.addTask('Review - Hardware (Test Prep) Flashcards', 10, false);
core1.addTask('Quiz - Virtualization and Cloud Computing (Test Prep) Flashcards', 6, false);
core1.addTask('Review - Virtualization and Cloud Computing (Test Prep) Flashcards', 10, false);
core1.addTask('Quiz - Hardware and Networking Troubleshooting (Test Prep) Flashcards', 66, false);
core1.addTask('Review - Hardware and Networking Troublshooting (Test Prep) Flashcards', 10, false);

core1.addTask('Kaplan Test 1', 90, false);
core1.addTask('Kaplan Test 2', 90, false);
core1.addTask('Kaplan Test 3', 90, false);
core1.addTask('Kaplan Test 4', 90, false);
core1.addTask('Kaplan Test 5', 90, false);

core1.addTask('UCertify - Mastery Quiz First Round', 300, false);
core1.addTask('UCertify - Mastery Quiz Second Round', 300, false);
core1.addTask('UCertify - Mastery Quiz Third Round', 300, false);
core1.addTask('UCertify - Practice Exam', 90, false);
core1.displayAll();




// 100 Angular Components
let angularChallenge100 = new Project('Udemy - 100 Angular Challenge', 45);
angularChallenge100.addTask('Section 1: Introduction', 9, false);
angularChallenge100.addTask('Section 1: Tools We Use', 3, false);

angularChallenge100.addTask('Section 2: Github Repo / Source Code', 3, false);
angularChallenge100.addTask('Section 2: Updating Information', 3, false);
angularChallenge100.addTask('Section 2: Creating a New Project with Angular CLI', 4, false);
angularChallenge100.addTask('Section 2: Updating Versions', 5, false);
angularChallenge100.addTask('Section 2: Understanding Our Configuration', 6, false);
angularChallenge100.addTask('Section 2: Understanding our src setup', 7, false);
angularChallenge100.addTask('Section 2: Generating Components with CLI', 4, false);
angularChallenge100.addTask('Section 2: Configuring ng generate component to use scss', 5, false);
angularChallenge100.addTask('Section 2: Converting Application to SCSS', 3, false);
angularChallenge100.addTask('Section 2: How to Succeed with this Course', 3, false);

angularChallenge100.addTask('Section 3: Basic Toolbar', 15, false);
angularChallenge100.addTask('Section 3: Card', 15, false);
angularChallenge100.addTask('Section 3: Accordion', 17, false);
angularChallenge100.addTask('Section 3: Progress Bar', 13, false);
angularChallenge100.addTask('Section 3: Star Ratings', 15, false);
angularChallenge100.addTask('Section 3: Top of Page', 15, false);
angularChallenge100.addTask('Section 3: A. Basic Routing Setup', 11, false);
angularChallenge100.addTask('Section 3: B. Basic Routing Setup', 9, false);
angularChallenge100.addTask('Section 3: Lazy Loading Routes', 12, false);
angularChallenge100.addTask('Section 3: Truncate Pipe', 8, false);
angularChallenge100.addTask('Section 3: Loader Circular Component', 14, false);
angularChallenge100.addTask('Section 3: Credit Card Formater Pipe', 15, false);
angularChallenge100.addTask('Section 3: Credit Card Input Component', 19, false);
angularChallenge100.addTask('Section 3: Loader Loading Component', 19, false);
angularChallenge100.addTask('Section 3: Twitter Post Component', 17, false);
angularChallenge100.addTask('Section 3: LinkedIn Post Component', 17, false);
angularChallenge100.addTask('Section 3: Flatten Pipe', 11, false);
angularChallenge100.addTask('Section 3: Modal Component', 16, false);
angularChallenge100.addTask('Section 3: Debounce Click Directive', 13, false);
angularChallenge100.addTask('Section 3: Quote Component', 13, false);
angularChallenge100.addTask('Section 3: Toggle Component', 12, false);
angularChallenge100.addTask('Section 3: Filter Term Pipe', 9, false);
angularChallenge100.addTask('Section 3: Rich Text Viewer Component', 12, false);
angularChallenge100.addTask('Section 3: Debounce Search Component', 15, false);
angularChallenge100.addTask('Section 3: Search List Component', 18, false);
angularChallenge100.addTask('Section 3: Counter Component', 17, false);
angularChallenge100.addTask('Section 3: Simple Table', 15, false);
angularChallenge100.addTask('Section 3: Paging Component', 25, false);
angularChallenge100.addTask('Section 3: Tabs Component', 16, false);
angularChallenge100.addTask('Section 3: Ripple Directive', 15, false);
angularChallenge100.addTask('Section 3: Fade In Out Animation', 13, false);
angularChallenge100.addTask('Section 3: Sort Table Component', 27, false);
angularChallenge100.addTask('Section 3: Reactive Forms Emails Component', 32, false);
angularChallenge100.addTask('Section 3: Form Dirty Guard', 13, false);
angularChallenge100.addTask('Section 3: User Service', 17, false);
angularChallenge100.addTask('Section 3: Ribbon Component', 18, false);
angularChallenge100.addTask('Section 3: Button Toggle Component', 18, false);
angularChallenge100.addTask('Section 3: Banner Cut Out Component', 14, false);
angularChallenge100.addTask('Section 3: Scale Directive', 9, false);
angularChallenge100.addTask('Section 3: Snackbar Component', 20, false);
angularChallenge100.addTask('Section 3: Simple Popup Component', 15, false);
angularChallenge100.addTask('Section 3: Countdown Timer Component', 24, false);
angularChallenge100.addTask('Section 3: Snackbar Service', 13, false);
angularChallenge100.addTask('Section 3: Copy Directive', 13, false);
angularChallenge100.addTask('Section 3: Lazy Load Image Directive', 21, false);
angularChallenge100.addTask('Section 3: Footer Component', 18, false);
angularChallenge100.addTask('Section 3: Slide Right Animation', 9, false);
angularChallenge100.addTask('Section 3: Skeleton Loader Component', 14, false);
angularChallenge100.addTask('Section 3: Social Media Bar Component', 19, false);
angularChallenge100.addTask('Section 3: Bottom Sheet Component', 14, false);
angularChallenge100.addTask('Section 3: Fieldset Toggle Component', 10, false);
angularChallenge100.addTask('Section 3: Pill Component', 13, false);
angularChallenge100.addTask('Section 3: Pill Filter List Component', 20, false);
angularChallenge100.addTask('Section 3: Not Found Component', 16, false);
angularChallenge100.addTask('Section 3: Password Component', 23, false);
angularChallenge100.addTask('Section 3: Title Service', 17, false);
angularChallenge100.addTask('Section 3: Rich Text Pipe', 10, false);
angularChallenge100.addTask('Section 3: Sort By Pipe', 11, false);
angularChallenge100.addTask('Section 3: Sort By Key Pipe', 10, false);
angularChallenge100.addTask('Section 3: Overlay Component', 9, false);
angularChallenge100.addTask('Section 3: Local Storage Service', 16, false);
angularChallenge100.addTask('Section 3: Route Params', 13, false);
angularChallenge100.addTask('Section 3: Common Scripts', 12, false);
angularChallenge100.addTask('Section 3: Active Route UI', 9, false);
angularChallenge100.addTask('Section 3: Auto Focus Input Directive', 9, false);
angularChallenge100.addTask('Section 3: Testing Introduction', 6, false);
angularChallenge100.addTask('Section 3: Component Testing', 16, false);
angularChallenge100.addTask('Section 3: Guard Testing', 14, false);
angularChallenge100.addTask('Section 3: Pipe Testing', 10, false);
angularChallenge100.addTask('Section 3: Directive Testing', 18, false);
angularChallenge100.addTask('Section 3: Mock 3rd Party Http', 10, false);
angularChallenge100.addTask('Section 3: Service Testing', 16, false);
angularChallenge100.addTask('Section 3: Mock First Party Services', 10, false);
angularChallenge100.addTask('Section 3: Abstracting Services for Testing', 10, false);
angularChallenge100.addTask('Section 3: Testing Practcice x 75', 6, false);

angularChallenge100.addTask('Section 4: Good Job', 5, false);

angularChallenge100.addTask('Section 5: Bonus Lecture', 2, false);

angularChallenge100.displayAll();



// Udemy - Web Developer BootCamp
let webDevBootCamp = new Project('Udemy - Web Developer Bootcamp', 45);

webDevBootCamp.addTask('Section 9: What matters in this section', 5, true);
webDevBootCamp.addTask('Section 9: Opacity & The Alpha Channel', 9, true);
webDevBootCamp.addTask('Section 9: The Position Property', 12, true);
webDevBootCamp.addTask('Section 9: CSS Transitions', 13, true);
webDevBootCamp.addTask('Section 9: The Power of CSS Transformations', 15, true);
webDevBootCamp.addTask('Section 9: Fancy Button Hover Effect CodeAlong', 12, true);
webDevBootCamp.addTask('Section 9: The Truth About Background', 11, true);
webDevBootCamp.addTask('Section 9: Google Fonts is Amazing', 10, true);
webDevBootCamp.addTask('Section 9: Photo Blog CodeAlong Pt.1', 11, false);
webDevBootCamp.addTask('Section 9: Photo Blog CodeAlong Pt.2', 11, false);

webDevBootCamp.addTask('Section 10: What Matters In This Section', 5, false);
webDevBootCamp.addTask('Section 10: What on Earth is Flexbox', 6, false);
webDevBootCamp.addTask('Section 10: Flex-Direction', 8, false);
webDevBootCamp.addTask('Section 10: Justify-Content', 7, false);
webDevBootCamp.addTask('Section 10: Flex-Wrap', 6, false);
webDevBootCamp.addTask('Section 10: Align-Items', 10, false);
webDevBootCamp.addTask('Section 10: Align-Content & Align-Self', 7, false);
webDevBootCamp.addTask('Section 10: Flex-Basis, Grow & Shrink', 10, false);
webDevBootCamp.addTask('Section 10: Flex Shorthand', 8, false);
webDevBootCamp.addTask('Section 10: Responsive Design & Media Queries Intro', 9, false);
webDevBootCamp.addTask('Section 10: The Power of Media Queries', 11, false);
webDevBootCamp.addTask('Section 10: Building a Responsive Nav', 11, false);

webDevBootCamp.addTask('Section 11: Pricing Panel CodeAlong Pt.1', 6, false);
webDevBootCamp.addTask('Section 11: Pricing Panel CodeAlong Pt.2', 6, false);
webDevBootCamp.addTask('Section 11: Pricing Panel CodeAlong Pt.3', 6, false);
webDevBootCamp.addTask('Section 11: Pricing Panel CodeAlong Pt.4', 7, false);
webDevBootCamp.addTask('Section 11: Pricing Panel CodeAlong Pt.5', 6, false);
webDevBootCamp.addTask('Section 11: Pricing Panel CodeAlong Pt.6', 5, false);

webDevBootCamp.addTask('Section 12: What Matters In This Section', 5, false);
webDevBootCamp.addTask('Section 12: WTF Is Bootstrap', 10, false);
webDevBootCamp.addTask('Section 12: Including Bootstrap & Container', 12, false);
webDevBootCamp.addTask('Section 12: Bootstrap Buttons', 12, false);
webDevBootCamp.addTask('Section 12: Bootstrap Typography & Utlities', 10, false);
webDevBootCamp.addTask('Section 12: Badges, Alerts, & Button Groups', 14, false);
webDevBootCamp.addTask('Section 12: Coding Exercise 13: Boostrap Basics Practice', 10, false);
webDevBootCamp.addTask('Section 12: Intro to Bootstrap Grid', 10, false);
webDevBootCamp.addTask('Section 12: Coding Exercise 14: Bootstrap Grid Practice', 10, false);
webDevBootCamp.addTask('Section 12: Responsive Bootstrap Grids', 13, false);
webDevBootCamp.addTask('Section 12: Useful Grid Utilities', 10, false);
webDevBootCamp.addTask('Section 12: Bootstrap & Forms', 15, false);
webDevBootCamp.addTask('Section 12: Bootstrap Navbars', 16, false);
webDevBootCamp.addTask('Section 12: Bootstrap Icons!', 8, false);
webDevBootCamp.addTask('Section 12: Other Boostrap Utilities', 13, false);
webDevBootCamp.addTask('Section 12: A Mixed Bag of Other Bootstrap Stuff', 6, false);

webDevBootCamp.addTask('Section 14: What Matters In This Section', 4, false);
webDevBootCamp.addTask('Section 14: Why JavaScript is Awesome', 10, false);
webDevBootCamp.addTask('Section 14: Primitives & The Console', 9, false);
webDevBootCamp.addTask('Section 14: JavaScript Numbers', 10, false);
webDevBootCamp.addTask('Section 14: WTF is NaN', 5, false);
webDevBootCamp.addTask('Section 14: Quick Numbers Quiz', 4, false);
webDevBootCamp.addTask('Section 14: Variables & Let', 9, false);
webDevBootCamp.addTask('Section 14: Coding Exercise 15: Our First Variable Exercise', 10, false);
webDevBootCamp.addTask('Section 14: Updating Variables', 7, false);
webDevBootCamp.addTask('Section 14: Const & Var', 7, false);
webDevBootCamp.addTask('Section 14: Coding Exercise 16: Our First Constants Exercise', 10, false);
webDevBootCamp.addTask('Section 14: Quiz 3: Varibles', 10, false);
webDevBootCamp.addTask('Section 14: Booleans', 7, false);
webDevBootCamp.addTask('Section 14: Variables Naming and Conventions', 6, false);
webDevBootCamp.addTask('Section 14: Quiz 4: Quick Variable Quiz', 10, false);

webDevBootCamp.addTask('Section 15: What Matters In This Section', 4, false);
webDevBootCamp.addTask('Section 15: Introducing Strings', 4, false);
webDevBootCamp.addTask('Section 15: Coding Exercise 17: Our First String Variables', 10, false);
webDevBootCamp.addTask('Section 15: Indices & Length', 10, false);
webDevBootCamp.addTask('Section 15: Quiz 5: Strings Basics Quix', 10, false);
webDevBootCamp.addTask('Section 15: String Methods', 10, false);
webDevBootCamp.addTask('Section 15: Coding Exercise 18: Strings Methods', 10, false);
webDevBootCamp.addTask('Section 15: String Methods with Arguments', 12, false);
webDevBootCamp.addTask('Section 15: Coding Exercise 19: More String Methods', 10, false);
webDevBootCamp.addTask('Section 15: String Template Literals - SUPER USEFUL', 9, false);
webDevBootCamp.addTask('Section 15: Undefined & Null', 5, false);
webDevBootCamp.addTask('Section 15: Random Numbers & The Math Object', 10, false);
webDevBootCamp.addTask('Section 15: Coding Exercise 20: String Template Literal', 10, false);

webDevBootCamp.addTask('Section 16: What Matters In This Section', 4, false);
webDevBootCamp.addTask('Section 16: Decision Making with Code??', 4, false);
webDevBootCamp.addTask('Section 16: Comparison Operators', 7, false);
webDevBootCamp.addTask('Section 16: Equality: Triple vs Double Equals', 6, false);
webDevBootCamp.addTask('Section 16: Quiz 6: Comparison Quiz', 10, false);
webDevBootCamp.addTask('Section 16: Console, Alert, & Prompt', 7, false);
webDevBootCamp.addTask('Section 16: Running JavaScript from a Script', 8, false);
webDevBootCamp.addTask('Section 16: if statements', 8, false);
webDevBootCamp.addTask('Section 16: Coding Exercise 21: Our First Conditional Exercise', 10, false);
webDevBootCamp.addTask('Section 16: Else-If', 11, false);
webDevBootCamp.addTask('Section 16: Else', 11, false);
webDevBootCamp.addTask('Section 16: Coding Exercise 22: getColor Conditional', 10, false);
webDevBootCamp.addTask('Section 16: Nesting Conditions', 8, false);
webDevBootCamp.addTask('Section 16: Coding Exercise 23: Nested Conditionals', 10, false);
webDevBootCamp.addTask('Section 16: Truth-y & False-y Values', 7, false);
webDevBootCamp.addTask('Section 16: Logical AND', 7, false);
webDevBootCamp.addTask('Section 16: Coding Exercise 24: Logical and Mystery', 10, false);
webDevBootCamp.addTask('Section 16: Logical OR', 11, false);
webDevBootCamp.addTask('Section 16: Logical NOT', 8, false);

webDevBootCamp.addTask('Section 17: What Matters In This Section', 4, false);
webDevBootCamp.addTask('Section 17: Introducing Arrays', 10, false);
webDevBootCamp.addTask('Section 17: Coding Exercise 25: Lotto Numbers Exercise', 10, false);
webDevBootCamp.addTask('Section 17: Array Random Access', 10, false);
webDevBootCamp.addTask('Section 17: Coding Exercise 26: Array Access', 10, false);
webDevBootCamp.addTask('Section 17: Push & Pop', 10, false);
webDevBootCamp.addTask('Section 17: Shift & Unshift', 6, false);
webDevBootCamp.addTask('Section 17: Coding Exercise 27: Push/Pop/Shift/Unshift', 10, false);
webDevBootCamp.addTask('Section 17: Concat, indexOf, includes & reverse', 8, false);
webDevBootCamp.addTask('Section 17: Slice & Splice', 15, false);
webDevBootCamp.addTask('Section 17: Reference Types & Equality Testing', 8, false);
webDevBootCamp.addTask('Section 17: Arrays + Const', 6, false);
webDevBootCamp.addTask('Section 17: Multi-Dimensional Arrays', 6, false);
webDevBootCamp.addTask('Section 17: Coding Exercise 28: Nested Arrays Exercise', 10, false);

webDevBootCamp.addTask('Section 18: What Matters In This Section', 4, false);
webDevBootCamp.addTask('Section 18: Introducing Object Literals', 7, false);
webDevBootCamp.addTask('Section 18: Creating Object Literals', 6, false);
webDevBootCamp.addTask('Section 18: Coding Exercise 29: Our First Object', 10, false);
webDevBootCamp.addTask('Section 18: Accessing Data Out of Objects', 9, false);
webDevBootCamp.addTask('Section 18: Coding Exercise 30: Object Access Exercise', 10, false);
webDevBootCamp.addTask('Section 18: Modifying Objects', 7, false);
webDevBootCamp.addTask('Section 18: Nesting Arrays & Objects', 8, false);

webDevBootCamp.addTask('Section 19: What Matters in this section', 5, false);
webDevBootCamp.addTask('Section 19: Intro to For Loops', 9, false);
webDevBootCamp.addTask('Section 19: Coding Exercise 31: Our First For Loop Practice', 10, false);
webDevBootCamp.addTask('Section 19: More For Loops Examples', 7, false);
webDevBootCamp.addTask('Section 19: Coding Exercise 32: More For Loops', 10, false);
webDevBootCamp.addTask('Section 19: The Perils of Infinite Loops :( ', 8, false);
webDevBootCamp.addTask('Section 19: Looping Over Arrays', 8, false);
webDevBootCamp.addTask('Section 19: Coding Exercise 33: Iterating Arrays Exercise', 10, false);
webDevBootCamp.addTask('Section 19: Nested Loops', 11, false);
webDevBootCamp.addTask('Section 19: Another Loop: The While Loop', 8, false);
webDevBootCamp.addTask('Section 19: The Break Keyword', 6, false);
webDevBootCamp.addTask('Section 19: Writing a Guessing Game', 13, false);
webDevBootCamp.addTask('Section 19: Coding Exercise 34: For...Of', 10, false);
webDevBootCamp.addTask('Section 19: Iterating Over Objects', 8, false);
webDevBootCamp.addTask('Section 19: Todo List Project Intro', 7, false);
webDevBootCamp.addTask('Section 19: Todo List Project CodeAlong', 21, false);


webDevBootCamp.addTask('Section 20: What Matters In This Section', 5, false);
webDevBootCamp.addTask('Section 20: Intro to Functions', 6, false);
webDevBootCamp.addTask('Section 20: Our Very First Funciton', 8, false);
webDevBootCamp.addTask('Section 20: Coding Exercise 35: Heart Function', 10, false);
webDevBootCamp.addTask('Section 20: Arguments Intro', 10, false);
webDevBootCamp.addTask('Section 20: Coding Exercise 36: Rant', 10, false);
webDevBootCamp.addTask('Section 20: Functions with Multiple Arguments', 10, false);
webDevBootCamp.addTask('Section 20: Coding Exercise 37: Multiple Args', 10, false);
webDevBootCamp.addTask('Section 20: The Return Keyword', 9, false);
webDevBootCamp.addTask('Section 20: Coding Exercise 38: Return Value', 10, false);
webDevBootCamp.addTask('Section 20: Coding Exercise 39: isShortsWeather Function', 10, false);
webDevBootCamp.addTask('Section 20: Coding Exercise 40: Last Element Exercise', 10, false);
webDevBootCamp.addTask('Section 20: Coding Exercise 41: Capitalize', 10, false);
webDevBootCamp.addTask('Section 20: Coding Exercise 42: Sum Array', 10, false);
webDevBootCamp.addTask('Section 20: Coding Exercise 43: Days of the Week Exercise', 10, false);

webDevBootCamp.addTask('Section 21: What Matters In this Section', 6, false);
webDevBootCamp.addTask('Section 21: Function Scope', 8, false);
webDevBootCamp.addTask('Section 21: Quiz 7: Function Scope', 10, false);
webDevBootCamp.addTask('Section 21: Block Scope', 7, false);
webDevBootCamp.addTask('Section 21: Lexical Scope', 6, false);
webDevBootCamp.addTask('Section 21: Function Expressions', 6, false);
webDevBootCamp.addTask('Section 21: Coding Exercise 44: Function Expression', 10, false);
webDevBootCamp.addTask('Section 21: Higher Order Functions', 7, false);
webDevBootCamp.addTask('Section 21: Returning Functions', 13, false);
webDevBootCamp.addTask('Section 21: Defining Methods', 8, false);
webDevBootCamp.addTask('Section 21: Coding Exercise 45: Methods', 10, false);
webDevBootCamp.addTask('Section 21: The Mysterious THIS keyword', 12, false);
webDevBootCamp.addTask('Section 21: Coding Exercise 46: Egg Laying', 10, false);
webDevBootCamp.addTask('Section 21: Using Try/Catch', 8, false);

webDevBootCamp.addTask('Section 22: What Matters In this section', 5, false);
webDevBootCamp.addTask('Section 22: What is this section even about?', 4, false);
webDevBootCamp.addTask('Section 22: The forEach Method', 7, false);
webDevBootCamp.addTask('Section 22: The Map Method', 6, false);
webDevBootCamp.addTask('Section 22: Coding Exercise 47: Map Practice', 10, false);
webDevBootCamp.addTask('Section 22: Intro to Arrow Functions', 7, false);
webDevBootCamp.addTask('Section 22: Coding Exercise 48: Arrow Functions', 10, false);
webDevBootCamp.addTask('Section 22: Arrow Function Implicit Returns', 6, false);
webDevBootCamp.addTask('Section 22: Arrow Functions Wrapup', 5, false);
webDevBootCamp.addTask('Section 22: setTimeout and setInterval', 9, false);
webDevBootCamp.addTask('Section 22: the filter Method', 9, false);
webDevBootCamp.addTask('Section 22: Coding Exercise 49: Filter', 10, false);
webDevBootCamp.addTask('Section 22: Some & Every Methods', 5, false);
webDevBootCamp.addTask('Section 22: Coding Exercise 50: Some/Every', 10, false);
webDevBootCamp.addTask('Section 22: The Notorious Reduce Method', 13, false);
webDevBootCamp.addTask('Section 22: Arrow Functions & this', 8, false);

webDevBootCamp.addTask('Section 23: What matters in this section', 4, false);
webDevBootCamp.addTask('Section 23: Default Params', 8, false);
webDevBootCamp.addTask('Section 23: Spread in Function Calls', 7, false);
webDevBootCamp.addTask('Section 23: Spread with Array Literals', 5, false);
webDevBootCamp.addTask('Section 23: Spread with Objects', 7, false);
webDevBootCamp.addTask('Section 23: Rest Params', 9, false);
webDevBootCamp.addTask('Section 23: Destructuring Arrays', 5, false);
webDevBootCamp.addTask('Section 23: Destructuring Objects', 8, false);
webDevBootCamp.addTask('Section 23: Destructuing Params', 7, false);

webDevBootCamp.addTask('Section 24: What Matters In This Section', 4, false);
webDevBootCamp.addTask('Section 24: Introducing the DOM', 6, false);
webDevBootCamp.addTask('Section 24: The Document Object', 12, false);
webDevBootCamp.addTask('Section 24: getElementById', 9, false);
webDevBootCamp.addTask('Section 24: Coding Exercise 51: getElementById', 10, false);
webDevBootCamp.addTask('Section 24: getElementsByTagName & className', 10, false);
webDevBootCamp.addTask('Section 24: querySelector & querySelectorAll', 9, false);
webDevBootCamp.addTask('Section 24: Coding Exercise 52: querySelector', 10, false);
webDevBootCamp.addTask('Section 24: innerHTML, textContent, & innerText', 15, false);
webDevBootCamp.addTask('Section 24: Coding Exercise 53: Pickles', 10, false);
webDevBootCamp.addTask('Section 24: Attributes', 9, false);
webDevBootCamp.addTask('Section 24: Coding Exercise 54: Manipulating Attributes', 10, false);
webDevBootCamp.addTask('Section 24: Changing Styles', 14, false);
webDevBootCamp.addTask('Section 24: Coding Exercise 55: Magical Forest Circle', 10, false);
webDevBootCamp.addTask('Section 24: Coding Exercise 56: Rainbow Text', 10, false);
webDevBootCamp.addTask('Section 24: ClassList', 9, false);
webDevBootCamp.addTask('Section 24: Coding Exercise 57: ClassList', 10, false);
webDevBootCamp.addTask('Section 24: Traversing Parent/Child/Sibling', 9, false);
webDevBootCamp.addTask('Section 24: Append & AppendChild', 14, false);
webDevBootCamp.addTask('Section 24: Coding Exercise 58: 100 Button Insanity', 10, false);
webDevBootCamp.addTask('Section 24: removeChild & remove', 6, false);
webDevBootCamp.addTask('Section 24: Pokemon Sprites Demo', 12, false);

webDevBootCamp.addTask('Section 25: What Matters in this section', 4, false);
webDevBootCamp.addTask('Section 25: Intro to Events', 8, false);
webDevBootCamp.addTask('Section 25: Inline Events', 8, false);
webDevBootCamp.addTask('Section 25: Coding Exercise 59: Know They Enemy', 10, false);
webDevBootCamp.addTask('Section 25: The Onclick Property', 11, false);
webDevBootCamp.addTask('Section 25: addEventListener', 11, false);
webDevBootCamp.addTask('Section 25: Coding Exercise 60: Click Events', 10, false);
webDevBootCamp.addTask('Section 25: Random Color Exercise', 11, false);
webDevBootCamp.addTask('Section 25: Events & the keyword this', 10, false);
webDevBootCamp.addTask('Section 25: keyboard events & event objects', 14, false);
webDevBootCamp.addTask('Section 25: form events & preventDefault', 21, false);
webDevBootCamp.addTask('Section 25: Coding Exercise 61: Form Events', 10, false);
webDevBootCamp.addTask('Section 25: Input & Chnage Events', 7, false);
webDevBootCamp.addTask('Section 25: Coding Exercise 62: Input Event Practice', 10, false);
webDevBootCamp.addTask('Section 25: Event Bubbling', 9, false);
webDevBootCamp.addTask('Section 25: Event Delegation', 10, false);

webDevBootCamp.addTask('Section 26: Score Keeper pt1', 15, false);
webDevBootCamp.addTask('Section 26: Score Keeper pt2', 12, false);
webDevBootCamp.addTask('Section 26: Score Keeper pt3 with Bulma', 16, false);
webDevBootCamp.addTask('Section 26: Score Keeper pt4 refactoring', 12, false);

webDevBootCamp.addTask('Section 27: What matters in this section', 4, false);
webDevBootCamp.addTask('Section 27: The Call Stack', 14, false);
webDevBootCamp.addTask('Section 27: Web APIs & Single Threaded', 12, false);
webDevBootCamp.addTask('Section 27: Callback Hell :( ', 14, false);
webDevBootCamp.addTask('Section 27: Demo: fakeRequest Using Callbacks', 12, false);
webDevBootCamp.addTask('Section 27: Demo: fakeRequest using promises', 15, false);
webDevBootCamp.addTask('Section 27: the magic of promises', 10, false);
webDevBootCamp.addTask('Section 27: Creating our own promises', 13, false);
webDevBootCamp.addTask('Section 27: The Async Keyword', 13, false);
webDevBootCamp.addTask('Section 27: The Await Keyword', 10, false);
webDevBootCamp.addTask('Section 27: Handling Errors in Async Functions', 6, false);


webDevBootCamp.displayAll();



