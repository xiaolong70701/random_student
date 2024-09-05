let drawnStudents = [];

// 在頁面加載時讀取 localStorage 中的已抽取學生列表
window.onload = function() {
    loadStudentListFromStorage();
    scheduleListClear();
};

function getRandomStudent() {
    const infoElement = document.getElementById("studentInfo");
    infoElement.innerText = "正在抽取...";
    infoElement.style.opacity = '0.5';

    fetchStudent();
}

function fetchStudent() {
    fetch('https://script.google.com/macros/s/AKfycbyGo6lC1VZsJsSdcrZTjqLkhtPKo9_y6r0rNF-qZV9nmlQbIcMxeHqgdmY1KpIDnSU/exec')
        .then(response => response.json())
        .then(data => {
            setTimeout(() => {
                const maskedId = maskStudentId(data.id);
                if (isStudentAlreadyDrawn(maskedId)) {
                    console.log("學生已被抽取過，重新抽取...");
                    fetchStudent(); // 重新抽取
                } else {
                    displayStudentInfo(maskedId, data.name);
                    addStudentToList(maskedId, data.name);
                }
            }, 500);
        })
        .catch(error => {
            console.error('Error:', error);
            const infoElement = document.getElementById("studentInfo");
            infoElement.innerText = "出錯了，請重試！";
            infoElement.style.opacity = '1';
        });
}

function maskStudentId(id) {
    if (id.length <= 6) {
        return id;
    }
    const prefix = id.slice(0, 3);
    const suffix = id.slice(-3);
    const maskedPart = '*'.repeat(id.length - 6);
    return `${prefix}${maskedPart}${suffix}`;
}

function isStudentAlreadyDrawn(maskedId) {
    return drawnStudents.some(student => student.id === maskedId);
}

function displayStudentInfo(maskedId, name) {
    const infoElement = document.getElementById("studentInfo");
    infoElement.innerHTML = `學號: ${maskedId}<br>姓名: ${name}`;
    infoElement.style.opacity = '1';
}

function addStudentToList(id, name) {
    const listItem = document.createElement('li');
    listItem.textContent = `${id} - ${name}`;
    
    const studentList = document.getElementById('studentList');
    studentList.insertBefore(listItem, studentList.firstChild);
    
    drawnStudents.unshift({ id, name });
    
    // 限制列表最多顯示10名學生
    if (drawnStudents.length > 10) {
        drawnStudents.pop();
        if (studentList.lastChild) {
            studentList.removeChild(studentList.lastChild);
        }
    }

    // 將更新後的學生列表保存到 localStorage
    saveStudentListToStorage();
}

function saveAndClearList() {
    console.log("保存列表:", drawnStudents);
    
    // 清空列表
    drawnStudents = [];
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = '';

    // 清除 localStorage 中的已抽取學生列表
    localStorage.removeItem('drawnStudents');
}

function saveStudentListToStorage() {
    // 將學生列表轉換成 JSON 並存入 localStorage
    localStorage.setItem('drawnStudents', JSON.stringify(drawnStudents));
}

function loadStudentListFromStorage() {
    // 從 localStorage 讀取已保存的學生列表
    const storedStudents = localStorage.getItem('drawnStudents');
    if (storedStudents) {
        drawnStudents = JSON.parse(storedStudents);
        const studentList = document.getElementById('studentList');
        // 將每個已抽取的學生重新顯示在列表中
        drawnStudents.forEach(student => {
            const listItem = document.createElement('li');
            listItem.textContent = `${student.id} - ${student.name}`;
            studentList.appendChild(listItem);
        });
    }
}

function scheduleListClear() {
    const now = new Date();
    const night = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, // 下一天
        0, 0, 0 // 午夜 12:00:00
    );
    const msToMidnight = night.getTime() - now.getTime();

    setTimeout(() => {
        saveAndClearList();
        scheduleListClear(); // 重新調度下一天的清理
    }, msToMidnight);
}
