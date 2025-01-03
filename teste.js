const data = new Date(2024, 0, 13); // 13 de janeiro
const dataFormatada = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Bahia',
    dateStyle: 'full'
}).format(data);

console.log(dataFormatada);