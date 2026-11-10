// 홈페이지 공개 설정입니다. 비밀번호나 API 키를 넣지 마세요.
// theme: lime / orange / sky. video: assets/clinic.mp4 또는 HTTPS 동영상 주소.
export const clinic={
  brand:'쭉한의원', theme:'lime', phone:'', kakao:'', address:'', transit:'', parking:'', floor:'',
  business:'', permit:'', mapUrl:'', exteriorPhoto:'', clinicPhoto:'', video:'',
  booking:{enabled:false,endpoint:'',replyHours:null,privacyText:'',closedDates:[]},
  // Opening hours and appointment starts below are a planning example in Korea time.
  weekday:[10,11,12,14,15,16,17,18,19], saturday:[9,10,11,12],
  weekdayDisplay:'09:30–19:30', saturdayDisplay:'09:00–13:00', lunch:'13:00–14:00',
  visitDuration:'초진·재진 소요시간은 개원 시 안내합니다.',
  fees:[['약침','1회','개원 시 공지'],['한약 처방','1제 또는 제형별','개원 시 공지'],['웰니스 시술','항목별','개원 시 공지'],['제증명 발급','1부','개원 시 공지']]
};
