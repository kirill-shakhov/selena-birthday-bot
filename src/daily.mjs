const BIRTHDAYS = [
    { name: "Чек",     md: "08-21" },
    { name: "Сквиз",   md: "08-30" },
    { name: "Нетс",    md: "12-24" },
    { name: "Карибас", md: "12-27" },
    { name: "Чоко",    md: "01-07" },
    { name: "Байкал",  md: "02-22" },
    { name: "Кивит",   md: "04-25" },
    { name: "Реязяп",  md: "05-23" },
    { name: "Фокс",    md: "06-02" },
    { name: "Лева",    md: "06-29" },
    { name: "Ростик",  md: "08-04" }
];

const MOSCOW_TZ = 'Europe/Moscow';

const moscowTodayYmd = new Intl.DateTimeFormat('en-CA', {
    timeZone: MOSCOW_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
}).format(new Date());

const moscowTodayMd = moscowTodayYmd.slice(5); // 'MM-DD'

const getMessage = (name) =>
    `\u{1F389}\u{1F389} Сегодня родился прекрасный мужчина — ${name}. Давайте поздравим его! \u{1F389}\u{1F389}`;

async function findPersonByMonthDay(md) {
    const person = BIRTHDAYS.find(p => p.md === md);
    if (person) {
        const { name } = person;
        const text = getMessage(name);
        console.log(text);
        await sendTelegramMessage(text);
    }
}

findPersonByMonthDay(moscowTodayMd).catch(err => {
    console.error(err);
    process.exitCode = 1;
});

async function sendTelegramMessage(text, chatId = process.env.TARGET_CHAT_ID) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) throw new Error('Missing TELEGRAM_BOT_TOKEN');
    if (!chatId) throw new Error('Missing TARGET_CHAT_ID');

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const body = new URLSearchParams({
        chat_id: String(chatId),
        text,
        disable_web_page_preview: 'true',
    });

    const res = await fetch(url, { method: 'POST', body });
    const json = await res.json();
    if (!res.ok || !json.ok) {
        throw new Error(`Telegram API error: ${res.status} ${JSON.stringify(json)}`);
    }
    return json.result;
}
