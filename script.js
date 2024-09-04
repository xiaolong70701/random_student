function getRandomStudent() {
    const infoElement = document.getElementById("studentInfo");
    infoElement.innerText = "正在抽取...";
    infoElement.style.opacity = '0.5';

    fetch('https://script.google.com/macros/s/AKfycbzqb-br9umisM6ukmofrN5oeIm9pf-N4Hl8ec5ELmcsxG4jChoIpXneVMoh5ly8K73t/exec')
        .then(response => response.json())
        .then(data => {
            setTimeout(() => {
                infoElement.innerHTML = `學號: ${data.id}<br>姓名: ${data.name}`;
                infoElement.style.opacity = '1';
            }, 500);
        })
        .catch(error => {
            console.error('Error:', error);
            infoElement.innerText = "出錯了，請重試！";
            infoElement.style.opacity = '1';
        });
}
