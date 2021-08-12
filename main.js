window.onload = () => {
    const DayProgress = document.querySelector('.bar');
    const [Hour, Minute, Second] = document.querySelectorAll('.Time');
    const CIR = 2 * Math.PI * 60;
    DayProgress.style.strokeDasharray = CIR;

    setTimeout(() => {

        setInterval(Update, 100);

    }, 1000 - new Date().getMilliseconds());
    
    function Update() {
        const now = Get24Time();

        var dashoffset = CIR * (1 - (now.Percent / 100));
        DayProgress.style.strokeDashoffset = dashoffset;

        Hour.style.transform = `rotate(${((now.Hour / 12) + (now.Minute / 60 / 12)) * 360}deg)`;

        Minute.style.transform = `rotate(${(now.Minute / 60) * 360}deg)`;

        Second.style.transform = `rotate(${now.Second / 60 * 360}deg)`;
    }
}




function Get24Time() {
    let Now = new Date();
    return {
        Hour: Now.getHours(),
        Minute: Now.getMinutes(),
        Second: Now.getSeconds(),
        Percent: Number((Date.now() - new Date(Now.getFullYear(), Now.getMonth(), Now.getDate(), 0, 0, 0, 0).getTime()) / (24*60*60*1000) * 100).toPrecision(2)
    }
}