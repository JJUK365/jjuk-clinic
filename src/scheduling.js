export function koreaNow(now=new Date()){
  const parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now).map(p=>[p.type,p.value]));
  return {date:[parts.year,parts.month,parts.day].join('-'),minutes:Number(parts.hour)*60+Number(parts.minute)};
}
export function dateParts(value){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return null;
  const date=new Date(value+'T12:00:00Z');
  return !Number.isNaN(+date)&&date.toISOString().slice(0,10)===value?date:null;
}
export function availableHours(value,clinic,now=koreaNow()){
  const date=dateParts(value);
  if(!date||value<now.date||clinic.booking.closedDates.includes(value))return [];
  const day=date.getUTCDay(),starts=day===0?[]:day===6?clinic.saturday:clinic.weekday;
  return starts.filter(hour=>value>now.date||hour*60>now.minutes);
}
export function firstBookDate(clinic,now=koreaNow()){
  const date=dateParts(now.date);
  for(let day=0;day<367;day++){const value=date.toISOString().slice(0,10);if(availableHours(value,clinic,now).length)return value;date.setUTCDate(date.getUTCDate()+1);}
  return '';
}
