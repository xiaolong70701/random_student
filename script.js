function getRandomStudent() {
    const infoElement = document.getElementById("studentInfo");
    infoElement.innerText = "正在抽取...";
    infoElement.style.opacity = '0.5';

    fetch('https://script.google.com/macros/s/AKfycbzqb-br9umisM6ukmofrN5oeIm9pf-N4Hl8ec5ELmcsxG4jChoIpXneVMoh5ly8K73t/exec')
        .then(response => response.json())
        .then(data => {
            setTimeout(() => {
                // 處理學號，只顯示前三碼和後三碼
                const maskedId = maskStudentId(data.id);
                infoElement.innerHTML = `學號: ${maskedId}<br>姓名: ${data.name}`;
                infoElement.style.opacity = '1';
            }, 500);
        })
        .catch(error => {
            console.error('Error:', error);
            infoElement.innerText = "出錯了，請重試！";
            infoElement.style.opacity = '1';
        });
}

function maskStudentId(id) {
    if (id.length <= 6) {
        return id; // 如果學號長度不足，直接返回原始學號
    }
    const prefix = id.slice(0, 3);
    const suffix = id.slice(-3);
    const maskedPart = '*'.repeat(id.length - 6);
    return `${prefix}${maskedPart}${suffix}`;
}