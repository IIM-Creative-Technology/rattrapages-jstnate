const API_URL = "https://api.weatherapi.com/v1/";
const API_KEY = "ec12d30916fe42d596d194859231906";
const API_CITY = "Paris";
const DAYS_RANGE = 14;

const daysSection = document.getElementById('days-data-section');
const showFirst = document.getElementById('show-first');
showFirst.addEventListener('click', () => {
    const dayElement = document.getElementById('day-2023-06-21');
    dayElement.classList.remove('hidden');
    dayElement.classList.add('flex');
});

window.onload = getWeatherData;

async function getWeatherData() {
    try {
        const response = await fetch(`${API_URL}forecast.json?key=${API_KEY}&q=${API_CITY}&days=${DAYS_RANGE}&aqi=no&alerts=no`);
        const data = await response.json();
        const days = data.forecast.forecastday;

        days.forEach((day) => {
            const { date, day: dayData } = day;
            const { mintemp_c: minTemp, maxtemp_c: maxTemp, condition: { text: dayCondition } } = dayData;
            const { condition: { text: launchCondition }, temp_c: launchTemp } = day.hour[12];
            const { condition: { text: dinnerCondition }, temp_c: dinnerTemp } = day.hour[20];

            const dayCard = createDayCard(date, dayCondition, minTemp, maxTemp, launchCondition, launchTemp, dinnerCondition, dinnerTemp);
            daysSection.appendChild(dayCard);
        });
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function createDayCard(date, dayCondition, minTemp, maxTemp, launchCondition, launchTemp, dinnerCondition, dinnerTemp) {
    const dayCard = document.createElement('div');
    dayCard.id = `day-${date}`;
    dayCard.classList.add('w-full', 'hidden', 'flex-col', 'rounded-2xl', 'shadow-card', 'pb-4');

    const dayCardHeader = createDayCardHeader(dayCondition);
    const dayInfos = createDayInfos(date, minTemp, maxTemp);
    const crowdInfo = createCrowdInfo(launchCondition, launchTemp, dinnerCondition, dinnerTemp);

    dayCard.appendChild(dayCardHeader);
    dayCard.appendChild(dayInfos);
    dayCard.appendChild(crowdInfo);

    return dayCard;
}

function createDayCardHeader(condition) {
    const headerBackgroundImage = getHeaderBackgroundImage(condition);
    const dayCardHeader = document.createElement('header');
    dayCardHeader.classList.add(`bg-${headerBackgroundImage}`, 'bg-cover', 'bg-no-repeat', 'bg-center', 'rounded-banner', 'h-40', 'flex', 'items-end', 'p-4');

    const cardConditionTag = document.createElement('span');
    cardConditionTag.innerText = condition;
    cardConditionTag.classList.add('text-white', 'text-base', 'uppercase', 'font-bold');

    dayCardHeader.appendChild(cardConditionTag);
    return dayCardHeader;
}

function getHeaderBackgroundImage(condition) {
    if (typeof condition === 'string' && (condition.includes('sun') || condition.includes('sunny') || condition.includes('Sun') || condition.includes('Sunny'))) {
        return 'sunny';
    }
    if (typeof condition === 'string' && (condition.includes('rain') || condition.includes('rainy') || condition.includes('Rain') || condition.includes('Rainy'))) {
        return 'rainy';
    }
    return 'cloudy';
}

function createDayInfos(date, minTemp, maxTemp) {
    const dayInfos = document.createElement('div');
    dayInfos.classList.add('flex', 'items-center', 'justify-between', 'px-4', 'py-10');

    const cardTitle = document.createElement('h3');
    cardTitle.innerText = date;
    cardTitle.classList.add('font-bold', 'font-[28px]');

    const cardTempTag = document.createElement('p');
    cardTempTag.innerText = `${minTemp}°C - ${maxTemp}°C`;
    cardTempTag.classList.add('font-bold', 'font-[28px]');

    dayInfos.appendChild(cardTitle);
    dayInfos.appendChild(cardTempTag);

    return dayInfos;
}

function createCrowdInfo(launchCondition, launchTemp, dinnerCondition, dinnerTemp) {
    const launchInfos = createCrowdInfoSection(launchCondition, launchTemp);
    const dinnerInfos = createCrowdInfoSection(dinnerCondition, dinnerTemp);

    const crowdInfo = document.createElement('div');
    crowdInfo.classList.add('flex', 'justify-between', 'items-center', 'gap-10', 'px-4');
    crowdInfo.appendChild(launchInfos);
    crowdInfo.appendChild(dinnerInfos);

    return crowdInfo;
}

function createCrowdInfoSection(condition, temperature) {
    const backgroundImage = getCrowdInfoBackgroundImage(condition);
    const crowds = getCrowdInfoText(condition);
    const color = getCrowdInfoTextColor(condition);
    console.log(color)

    const infoAside = document.createElement('aside');
    infoAside.classList.add(`bg-${backgroundImage}`, 'w-full', 'h-32', 'flex', 'items-end', 'p-4', 'bg-cover', 'bg-no-repeat', 'bg-center', 'rounded-banner');

    const timeTag = document.createElement('h4');
    timeTag.innerText = condition === 'launch' ? 'Launch' : 'Dinner';
    timeTag.classList.add('text-white', 'text-base', 'capitalize', 'font-medium');

    infoAside.appendChild(timeTag);

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('w-full', 'h-32', 'px-4', 'py-8', 'flex', 'flex-col', 'justify-center', 'gap-4');

    const tempTag = document.createElement('h5');
    tempTag.classList.add('font-bold');
    tempTag.innerText = `${condition} - ${temperature}°C`;

    const crowdsTag = document.createElement('p');
    crowdsTag.innerHTML = `<span class="text-[28px]">•</span> ${crowds}`;
    crowdsTag.classList.add(`${color}`, 'flex', 'items-center');

    infoDiv.appendChild(tempTag);
    infoDiv.appendChild(crowdsTag);

    const infoSection = document.createElement('div');
    infoSection.classList.add('flex', 'flex-col', 'items-end', 'w-3/6', 'rounded-2xl', 'shadow-card');
    infoSection.appendChild(infoAside);
    infoSection.appendChild(infoDiv);

    return infoSection;
}

function getCrowdInfoBackgroundImage(condition) {
    if (typeof condition === 'string' && (condition.includes('sun') || condition.includes('sunny') || condition.includes('Sun') || condition.includes('Sunny'))) {
        return 'sunny';
    }
    if (typeof condition === 'string' && (condition.includes('rain') || condition.includes('rainy') || condition.includes('Rain') || condition.includes('Rainy'))) {
        return 'rainy';
    }
    return 'cloudy';
}

function getCrowdInfoText(condition) {
    if (typeof condition === 'string' && (condition.includes('sun') || condition.includes('sunny') || condition.includes('Sun') || condition.includes('Sunny'))) {
        return 'Large crowds expected';
    }
    if (typeof condition === 'string' && (condition.includes('rain') || condition.includes('rainy') || condition.includes('Rain') || condition.includes('Rainy'))) {
        return 'Average attendance to be expected';
    }
    return 'Low attendance expected';
}

function getCrowdInfoTextColor(condition) {
    if (typeof condition === 'string' && (condition.includes('sun') || condition.includes('sunny') || condition.includes('Sun') || condition.includes('Sunny') )) {
        return 'text-red-500';
    }
    if (typeof condition === 'string' && (condition.includes('rain') || condition.includes('rainy'))) {
        return 'text-orange-500';
    }
    return 'text-blue-500';
}

