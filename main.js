let is24 = true;
let DarkMode = true;

window.onload = () => {
    const DayProgress = document.querySelector('.bar');
    const [Hour, Minute, Second] = document.querySelectorAll('.Time');
    const DaySvg = document.querySelector('.Day');
    const CIR = 2 * Math.PI * 60;
    let SolarEvent = {sunrise: Date, sunset: Date};
    DayProgress.style.strokeDasharray = CIR;
    
    // DrawHourCounter
    let Cnt = 60;
    for (let i = 0; i <= (Cnt-1); i++) {
        const HC = document.createElement('div');
        HC.className = `Time HourCount ` + (!(i % 5)? "Bold":"");
        HC.style.transform = `rotate(${360 / Cnt * i}deg)`;
        document.querySelector('div.Clock').appendChild(HC);
    }

    // let tmp = document.createElementNS('Day.svg', 'use');
    

    navigator.geolocation.getCurrentPosition(function(position) {
        lat = position.coords.latitude;
        long = position.coords.longitude;
        let Today = new Date();
        const Yesterday = new Date(Today.getFullYear(), Today.getMonth(), Today.getDate()-1);
        
        SolarEvent.sunrise = SunriseSunsetJS.getSunrise(lat, long, Yesterday);
        SolarEvent.sunset = SunriseSunsetJS.getSunset(lat, long);
        console.log(SolarEvent)
        
        setTimeout(() => {
            setInterval(Update, 1000);
        }, 1000 - new Date().getMilliseconds());
    });
    

    
    function Update() {
        const now = GetTimeInfo(is24);

        var dashoffset = CIR * (1 - (now.Percent / 100));
        DayProgress.style.strokeDashoffset = dashoffset;

        Hour.style.transform = `rotate(${((now.Hour / 12) + (now.Minute / 60 / 12)) * 360}deg)`;

        Minute.style.transform = `rotate(${((now.Minute / 60) + (now.Second / 60 / 60)) * 360}deg)`;

        Second.style.transform = `rotate(${now.Second / 60 * 360}deg)`;

        const nowDate = new Date();
        let data;
        if (Math.abs(nowDate.getTime() - SolarEvent.sunrise.getTime()) / 1000 / 60 <= 15) data = "Sunrise";
        else if (Math.abs(nowDate.getTime() - SolarEvent.sunset.getTime()) / 1000 / 60 <= 15) data = "Sunrise";
        else if (nowDate.getTime() >= SolarEvent.sunset.getTime() || nowDate.getTime() <= SolarEvent.sunrise.getTime()) data = "Night";
        else data = "Day";
        
        if (DaySvg.getAttribute("data") != data) {
            DaySvg.setAttribute("data", data);
            switch (data) {
                case "Day": data = Day; break;
                case "Sunrise": data = Sunrise; break;
                case "Night": data = Night; break;
            }
            DaySvg.innerHTML = data;
        }
    }
}




function GetTimeInfo(is24) {
    let Now = new Date();
    return {
        Hour: Now.getHours(),
        Minute: Now.getMinutes(),
        Second: Now.getSeconds(),
        Percent: Number((Date.now() - new Date(Now.getFullYear(), Now.getMonth(), Now.getDate(), 0, 0, 0, 0).getTime()) / ((is24?24:12)*60*60*1000) * 100)
    }
}


function ToggleDark() {
    // console.log(DaySvg.)
    if (DarkMode) {
        document.documentElement.style.setProperty('--stroke', '#000000');
        document.documentElement.style.setProperty('--background', '#ffffff');
        // DaySvg.contentDocument.style.setProperty('--stroke', '#000000');
        // DaySvg.contentDocument.style.setProperty('--background', '#ffffff');
    } else {
        document.documentElement.style.setProperty('--stroke', '#ffffff');
        document.documentElement.style.setProperty('--background', '#000000');
        // DaySvg.contentDocument.style.setProperty('--stroke', '#ffffff');
        // DaySvg.contentDocument.style.setProperty('--background', '#000000');
    }
    DarkMode = !DarkMode;
}


let Timer;
let TouchDuration = 500;
function TouchStart() {
    if (Timer) clearTimeout(Timer);
    Timer = setTimeout(() => {
        is24 = !is24;
        Timer = 0;
    }, TouchDuration);
}
function TouchEnd() {
    if (Timer) {
        clearTimeout(Timer);
        ToggleDark();
    };
}