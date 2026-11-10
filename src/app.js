import {clinic} from './clinic-config.js';
import {media} from './media.js';
import {koreaNow,availableHours,firstBookDate} from './scheduling.js';
document.documentElement.dataset.theme=['lime','orange','sky'].includes(clinic.theme)?clinic.theme:'lime';


// Symptom descriptions are grouped in the same order as their hub cards.
const departments = {
  pain: {name:'통증·재활', en:'Pain & rehabilitation', icon:'spine', home:'허리와 관절이\n자꾸 아파요', desc:'허리 · 목 · 어깨 · 골반 · 손목 · 발목', intro:'어디를 움직일 때 가장 불편한가요?', action:'통증·재활 상담'},
  accident: {name:'교통사고', en:'After an accident', icon:'car', home:'사고 뒤 몸이\n불편해요', desc:'사고 후 통증 · 저림 · 수면 변화', intro:'사고 뒤 달라진 몸 상태를 알려주세요.', action:'교통사고 상담'},
  herbal: {name:'체질', en:'Herbal medicine', icon:'herb', home:'기운이 없고\n잠이 달라졌어요', desc:'갱년기 · 기력 저하 · 한약 상담', intro:'요즘 가장 달라진 일상은 무엇인가요?', action:'체질 상담'},
  wellness: {name:'웰니스', en:'Wellness', icon:'face', home:'체형과 얼굴 인상을\n자연스럽게 가꾸고 싶어요', desc:'리프팅 · 체형 · 안면 인상 미세 개선', intro:'리프팅을 중심으로, 체형과 얼굴 인상의 작은 변화를 상담합니다.', action:'웰니스 상담'}
};
// id, card label, page title, scope, illustration, example, patient's words,
// clinical explanation, four prompts for the consultation.
const topics = {
pain:[
['back','허리','허리가 아프고, 다리가 저려요','만성 요통 · 허리 디스크 · 척추관협착','spine','박은경 님 · 57세','장을 보다가 다리가 저려서, 어디 앉을 곳부터 찾아요.','허리에서 다리로 이어지는 통증은 신경 자극과 관련되기도 합니다. 걷기 전후의 변화와 다리 힘·감각을 살피고, 필요하면 추가 영상검사를 안내합니다.','걸으면 종아리가 저려요|잠시 앉으면 걷기가 편해져요|한쪽 엉덩이부터 다리로 당겨요|오래 서서 일하기가 힘들어요'],
['neck','목','목이 뻐근하고, 팔이 저려요','만성 목 통증 · 거북목 · 목 디스크','neck','이정혜 님 · 53세','고개를 돌릴 때 팔까지 찌릿해서 운전할 때마다 신경 쓰여요.','목 주변 근육과 신경, 어깨의 문제가 비슷한 통증으로 느껴지기도 합니다. 목을 움직여 증상이 달라지는지 보고 팔의 힘과 손끝 감각을 확인합니다.','고개를 돌리면 팔까지 찌릿해요|책상 앞에 오래 앉기가 힘들어요|팔을 올리면 느낌이 달라져요|어느 손가락이 저린지 구분돼요'],
['shoulder','어깨','어깨가 뻣뻣하고, 안 올라가요','오십견 · 회전근개 · 자세성 통증','shoulder','이경희 님 · 63세','머리를 감으려고 팔을 들면 어깨가 중간에서 딱 멈춰요.','팔을 스스로 올릴 때와 도움을 받아 올릴 때의 범위를 비교합니다. 힘줄 문제를 의심하면 초음파로 회전근개(어깨를 감싸는 힘줄)의 상태를 살피기도 합니다.','선반에서 그릇을 꺼내기 어려워요|등 뒤로 손을 보내기 힘들어요|아픈 쪽으로 누우면 잠이 깨요|팔을 올리는 중간에 특히 아파요'],
['pelvis','골반','골반이 틀어진 느낌이에요','좌우 불균형 · 출산 후 변화','pelvis','한수민 님 · 29세','아이를 안고 서 있으면 한쪽 골반만 묵직해져요.','좌우가 다르게 느껴지는 데에는 근력과 관절 움직임도 영향을 줄 수 있습니다. 서 있을 때, 걸을 때, 한 발로 체중을 지탱할 때의 차이를 살핍니다.','한쪽 다리에 기대 서게 돼요|계단에서 골반이 불편해요|아이를 안으면 한쪽만 무거워요|한쪽으로 누울 때 더 아파요'],
['wrist','손목','손목을 쓰면 시큰거려요','손목 과사용 · 손끝 저림','wrist','김도현 님 · 33세','마우스를 오래 쓰면 손목이 시큰한데, 요즘은 손끝도 저려요.','아픈 지점과 저린 손가락을 구분해 힘줄과 신경을 살핍니다. 필요한 경우 초음파로 손목 힘줄이나 신경 주변을 확인합니다.','병뚜껑을 돌리면 아파요|엄지를 움직이면 손목이 당겨요|밤에 손끝이 저려서 깨요|손으로 바닥을 짚기가 어려워요'],
['ankle','발목','발목이 시큰하고, 자꾸 접질려요','반복 염좌 · 만성 불안정','ankle','오지훈 님 · 35세','한 번 삐었던 발목이 울퉁불퉁한 길만 걸으면 다시 꺾여요.','반복해서 접질릴 때는 인대와 발목의 균형 조절 능력을 함께 살핍니다. 붓기와 체중을 싣는 능력에 따라 초음파나 다른 검사가 필요할 수 있습니다.','고르지 않은 길이 불안해요|발목 바깥쪽이 자주 부어요|방향을 바꾸다가 휘청거려요|오래 걸으면 발목이 시큰해요']
],
accident:[
['whiplash','목','사고 뒤 목이 뻣뻣하고 아파요','편타성 손상(충격으로 목이 앞뒤로 흔들린 뒤의 통증)','neck','운전자 · 46세','사고 난 날보다 다음 날 아침에 목을 돌리기가 더 힘들었어요.','충격의 방향, 머리를 부딪혔는지, 팔까지 증상이 이어지는지 묻습니다. 골절이나 신경 손상이 의심되면 추가 검사를 우선합니다.','고개를 돌릴 때 아파요|어깨까지 뻐근해요|아침에 더 뻣뻣해요|팔에 힘이 덜 들어가요'],
['after-back','허리','사고 뒤 허리가 계속 아파요','사고 후 허리 통증','spine','동승자 · 51세','차에서 내릴 땐 괜찮았는데, 의자에서 일어날 때 허리가 아파요.','충격 이후 생긴 통증인지, 이전 통증이 달라졌는지를 구분합니다. 허리의 압통과 다리 힘, 감각을 확인해 필요한 검사와 치료를 정합니다.','앉았다 일어날 때 아파요|엉덩이까지 묵직해요|오래 앉기가 힘들어요|사고 전과 아픈 위치가 달라요'],
['head','두통·어지럼','사고 뒤 두통과 어지럼이 남아요','사고 후 두통 · 어지럼','head','동승자 · 38세','사고 뒤로 자꾸 어지러워서 어디부터 진료를 봐야 할지 모르겠어요.','머리를 부딪혔는지와 당시 기억, 구토, 복용 약을 먼저 확인합니다. 사고 후 두통과 어지럼은 뇌진탕 등 머리 손상 평가가 필요할 수 있습니다.','머리를 부딪힌 기억이 있어요|두통의 강도가 달라져요|화면을 보면 어지러워요|사고 당시가 잘 기억나지 않아요'],
['tingling','팔·다리','팔 · 다리가 저릿해요','사고 후 팔다리 저림','wrist','운전자 · 42세','사고 뒤 팔이 저린데 어느 손가락부터인지 잘 모르겠어요.','저림이 시작된 시점과 범위를 확인하고 좌우의 감각과 근력을 비교합니다. 새로 생긴 마비나 감각 소실은 응급 평가가 필요합니다.','한쪽 손끝이 저려요|팔에서 손으로 찌릿해요|다리 감각이 전과 달라요|물건을 쥐는 힘이 달라요'],
['sleep','수면·긴장','잠들기 어렵고 쉽게 놀라요','사고 후 수면 변화 · 긴장','moon','운전자 · 36세','잠들려고 누우면 그날 소리와 장면이 자꾸 떠올라요.','사고를 겪은 뒤 긴장과 수면 변화가 이어지기도 합니다. 잠든 시간, 깨는 횟수, 일상에서의 불편을 확인하고 필요한 진료를 안내합니다.','잠들기까지 오래 걸려요|차 소리에도 깜짝 놀라요|사고 장면이 떠올라요|운전대를 잡기가 두려워요'],
['fatigue','피로','회복이 더디고 쉽게 지쳐요','사고 후 피로 · 활동량 변화','moon','동승자 · 48세','출근은 했는데 평소 하던 일에도 오후가 되면 기운이 빠져요.','통증과 수면 변화, 복용 약이 피로에 영향을 줄 수 있습니다. 사고 전후의 활동량을 비교하고 피로를 설명할 다른 원인도 살핍니다.','오후가 되면 기운이 빠져요|집중하는 시간이 줄었어요|아침에 개운하지 않아요|평소보다 쉬는 시간이 길어졌어요']
],
herbal:[
['gongjin','공진단','공진단','기력 저하 · 복용 적합성 상담','herb','직장인 · 49세','피곤해서 공진단을 생각 중인데 지금 먹는 약과 같이 먹어도 될까요?','피로의 경과와 복용 중인 약, 질환을 먼저 확인합니다. 공진단을 고려할 때는 개인의 건강 상태와 구성 약재를 함께 검토합니다.','충분히 쉬어도 피곤해요|다른 약을 여러 가지 먹어요|약재에 알레르기가 있어요|복용 방법과 비용이 궁금해요'],
['gyeongok','경옥고','경옥고','식욕과 컨디션 · 복용 상담','herb','보호자 · 54세','식사량이 줄어든 부모님께 드려도 될지 먼저 물어보고 싶어요.','식욕이나 체중이 달라졌다면 변화의 원인부터 살핍니다. 기존 질환과 혈당 관리 여부, 복용 약을 확인한 뒤 처방을 논의합니다.','식사량이 전보다 줄었어요|최근 체중이 변했어요|혈당을 관리하고 있어요|부모님의 복용약이 걱정돼요'],
['menopause','갱년기','갱년기','얼굴 열감 · 야간 발한 · 수면 변화','moon','직장인 · 52세','밤에 갑자기 더워서 이불을 걷어차고 나면 다시 잠들기 어려워요.','열감과 수면 변화는 갱년기에 겪을 수 있는 증상입니다. 월경 변화와 복용 약, 생활에 미치는 영향을 듣고 필요한 평가와 관리 방법을 논의합니다.','밤중에 땀 때문에 깨요|갑자기 얼굴이 달아올라요|월경 주기가 달라졌어요|수면 변화로 낮에 피곤해요'],
['prescription','체질 상담','체질 맞춤 처방','생활 리듬 · 복용 약 · 처방 상담','herb','교대 근무자 · 41세','끼니와 잠이 들쑥날쑥한데 어디서부터 이야기하면 좋을까요?','수면, 소화, 식사와 배변의 변화를 함께 살핍니다. 복용 약과 과거의 이상반응을 검토하고 목표에 따라 처방 여부를 정합니다.','소화가 편한 날이 드물어요|수면 시간이 일정하지 않아요|이미 복용하는 약이 있어요|한약 복용 뒤 불편했던 적이 있어요']
],
wellness:[
['lift','리프팅','내 얼굴에 맞는 리프팅이 궁금해요','얼굴 탄력 · 턱선 · 리프팅 상담','face','상담 예시','탄력이 신경 쓰이지만 얼굴이 많이 달라 보이는 건 부담스러워요.','관심 부위와 이전 시술, 피부 상태를 먼저 확인합니다. 원하는 변화의 정도를 듣고, 리프팅 방법별 예상 범위와 통증, 붓기 등 주의사항을 설명합니다.','턱선 변화가 신경 쓰여요|자연스러운 변화를 원해요|이전 시술 경험이 있어요|회복에 필요한 시간이 궁금해요'],
['line','체형 관리','내 몸의 균형과 라인을 살펴보고 싶어요','체형 · 자세 · 생활습관 상담','figure','상담 예시','몸의 라인과 자세가 신경 쓰이는데 어디부터 살펴보면 좋을까요?','어떤 부위가 신경 쓰이는지 듣고, 자세와 움직임, 생활습관을 함께 살핍니다. 평가 결과에 따라 관리 방향과 실천할 수 있는 목표를 상의합니다.','어깨 높이가 다르게 느껴져요|평소 자세가 신경 쓰여요|몸의 라인을 살펴보고 싶어요|일상에서 할 수 있는 관리가 궁금해요'],
['impression','안면 인상 미세 개선','나다운 인상은 그대로, 작은 변화부터','얼굴선 · 안면 인상 · 미세 개선 상담','face','상담 예시','크게 달라지기보다는 제 인상을 살리면서 조금만 정돈하고 싶어요.','유지하고 싶은 특징과 바꾸고 싶은 부분을 먼저 듣습니다. 얼굴선과 피부 상태를 살핀 뒤 리프팅으로 접근할 수 있는 범위와 한계를 설명하고, 무리한 변화보다 본인이 원하는 정도를 함께 정합니다.','지금의 인상을 유지하고 싶어요|얼굴선을 조금 정돈하고 싶어요|과한 변화는 부담스러워요|어디까지 가능한지 먼저 알고 싶어요'],
['consult','맞춤 상담','무엇이 맞을지 모르셔도 괜찮습니다','리프팅 · 체형 · 안면 인상 상담','figure','상담 예시','시술 이름을 몰라도 원하는 느낌부터 이야기해도 될까요?','신경 쓰이는 부분과 원하는 변화, 일상에서 가능한 관리 범위를 듣습니다. 상담 뒤 시술을 미루거나 생활관리부터 선택할 수 있습니다.','우선 상담부터 받고 싶어요|어떤 선택지가 있는지 궁금해요|중요한 일정이 있어요|비용과 회복 기간을 알고 싶어요']
]};
const careSteps={
pain:[['정밀 평가','움직임과 힘, 감각을 비교하고 필요한 검사를 고릅니다.'],['움직임 회복','필요시 섬세한 추나요법으로 적합한 움직임과 틀어짐을 교정합니다.'],['침·약침','침이나 약침으로 통증과 염증을 제어합니다.'],['일상 관리','올바른 동작을 바탕으로 건강한 일상으로 복귀합니다!']],
accident:[['손상 평가','충격 방향과 사고 뒤 달라진 증상을 확인합니다.'],['움직임 확인','골절과 신경 손상 가능성을 먼저 살핀 뒤 움직임을 평가합니다.'],['치료 상의','검사 결과에 따라 진료 의뢰나 침·추나 등 가능한 방법을 논의합니다.'],['경과 확인','수면과 활동량, 증상 변화를 보며 복귀 계획을 조정합니다.']],
herbal:[['생활 문진','수면, 식사, 증상의 시작과 변화를 듣습니다.'],['복용약 확인','질환과 복용 약, 알레르기, 임신 가능성을 확인합니다.'],['처방 상의','처방 여부와 약재, 예상 비용, 주의할 점을 설명합니다.'],['경과 확인','복용 뒤 불편감과 목표 증상의 변화를 확인합니다.']],
wellness:[['관심 부위 확인','궁금한 부위와 원하는 변화, 일정을 듣습니다.'],['적합성 평가','피부 상태와 복용 약, 이전 시술 이력을 확인합니다.'],['방법 선택','생활관리와 시술의 예상 범위, 비용과 위험을 비교합니다.'],['관리 안내','선택한 방법에 맞춰 주의사항과 확인 시점을 안내합니다.']]};

const iconPaths={
 arrow:'<path d="M4 12h15m-6-6 6 6-6 6"/>',back:'<path d="M20 12H5m6-6-6 6 6 6"/>',
 chev:'<path d="m9 5 7 7-7 7"/>',down:'<path d="m5 9 7 7 7-7"/>',menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',close:'<path d="M5 5l14 14M19 5 5 19"/>',
 phone:'<path d="m8 3 3 5-2.5 2a12 12 0 0 0 5.4 5.4l2-2.4 5 3c.1 2.4-1.4 4.8-3.8 4.8C10.2 20.8 3.2 13.8 3.2 6.6 3.2 4.4 5.5 2.8 8 3Z"/>',
 chat:'<path d="M4 16C-1 7 7 3.5 12 3.5c6 0 9 3 9 7.3s-4.2 7.5-9.4 7.5H10l-5 3 .8-4.1Z"/><path d="M7.8 11h.5m3.5 0h.5m3.5 0h.5"/>',
 book:'<rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M7.5 3v4m9-4v4M4 10h16m-12 5h2m4 0h2"/>',
 pin:'<path d="M19.5 9.5C19.5 15.5 12 21 12 21S4.5 15.5 4.5 9.5a7.5 7.5 0 1 1 15 0Z"/><circle cx="12" cy="9.5" r="2.5"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
 home:'<path d="m2 11 10-8 10 8M5 9v11h14V9m-9 11v-7h4v7"/>',
 check:'<path d="m4 12 5 5L20 6"/>',plus:'<path d="M12 5v14M5 12h14"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.5"/>',
 north:'<path d="M5 18 18 5M7 5h11v11"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/>'};
iconPaths.play='<path d="m9 5 11 7-11 7Z"/>';
function icon(name,size=20){return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${iconPaths[name]||''}</svg>`;}
function oldMark(){return '<svg class="mark" viewBox="0 0 48 52" aria-hidden="true"><ellipse cx="20" cy="26" rx="13" ry="20" transform="rotate(-16 20 26)" fill="none" stroke="currentColor" stroke-width="2" opacity=".45"/><path fill="currentColor" fill-rule="evenodd" d="M30 4C20 4 13 13 13 26s6 22 16 22 17-9 17-22S40 4 30 4Zm-.4 2c6.7 0 10.5 7.5 10.5 20s-4 20.1-10.8 20.1S18.8 38.4 18.8 26 23 6 29.6 6Z"/></svg>';}
const spineSegments=Array.from({length:11},(_,i)=>{const y=18+i*6.1,x=48+Math.sin((i-2)*.54)*4.2,w=4.4+i*.25;return `<path d="M${x-w} ${y-1.2} q${w} 2.8 ${2*w} 0 l1.1 3.4 q-${w+1} 3 -${2*w+2} .2Z M${x-w} ${y} l-3.4 -1m${2*w+4.4} 1 2.9-1" />`}).join('');
const artPaths={
spine:`<path d="M38 7c-2 8-6 12-14 16-7 4-9 8-10 16m44-32c2 8 6 12 14 16 7 4 9 8 10 16M20 39c3 11 8 18 9 26 1 8-3 16-5 22m50-48c-4 11-8 18-9 26-1 8 3 16 5 22" opacity=".45"/>${spineSegments}<path d="m42 85 7 7 6-7"/>`,
car:'<path d="M9 61v-8c0-4 2-6 7-8l9-3 10-14c3-4 6-5 11-5h16c5 0 8 1 11 5l11 15 5 3c3 2 4 4 4 8v7H83m-15 0H36m-16 0H9"/><path d="m29 42 10-13h10v13Zm25-13h8c3 0 5 .6 7 3l7 10H54Zm-16 19h6m35 1h7M13 50h8"/><circle cx="28" cy="61" r="8"/><circle cx="75" cy="61" r="8"/><circle cx="28" cy="61" r="3"/><circle cx="75" cy="61" r="3"/><path d="M4 73h86M8 36h12M3 31h10m66-15 1-5m5 8 5-3" opacity=".55"/>',
herb:'<path d="M27 87c14-23 29-47 43-71M41 64c-15-2-20-14-19-29 14 4 23 15 19 29Zm10-18c-8-6-10-17-8-27 11 8 13 16 8 27Zm8-14c-1-13 5-21 17-25-1 13-5 21-17 25Zm-12 24c6-15 17-21 32-20-8 14-18 21-32 20ZM35 75c7-13 18-17 31-15-9 13-19 17-31 15Z"/><path d="m25 42 14 19m7-35 5 16m11-15 9-13m-20 39 19-12M40 72l18-8" opacity=".5"/>',
face:'<path d="M28 84c4-11 4-16 0-26-6-17-9-35 4-45C43 4 63 6 72 19c4 6 3 13 3 18 0 5 8 12 8 14 0 2-4 3-7 3l-1 6c0 2-3 3-5 3 4 1 4 3 2 6-1 3-5 4-9 4h-9l-2 12"/><path d="M31 56c-4-7-5-16-1-22 6-9 16-11 22-19m-8 49c4 3 8 5 14 6m3-31c4-2 7-2 11-1m-9 5c2 1 5 1 8-1"/><path d="M22 89c11-4 17-4 28-3 7 1 13 3 18 6" opacity=".6"/>',
neck:'<path d="M28 91c7-13 13-19 14-29 1-7-2-13-8-18-8-7-10-17-6-25 4-9 14-14 24-13 13 1 20 7 21 18 1 5-1 10 1 13l5 7-6 3-1 7-6 4-10-1c-2 10 3 18 10 23l12 8M39 41c4-3 8-1 7 3-1 4-4 5-6 2"/><path d="M40 53c11 12 13 21 10 32m-6-29c10 10 14 17 13 27" opacity=".55"/>',
shoulder:'<path d="M43 10c1 10 0 18-6 22-7 4-17 7-21 17-4 9-3 21-2 36m39-75c-1 8 2 15 8 20 7 5 15 7 19 16s5 22 4 39M18 43c7-5 17-5 24 1m18-4c9-2 14 1 18 7M30 47c-5 10-7 21-7 33m48-32c5 12 6 19 6 29"/><path d="M20 39c7-7 16-9 23-6m-28 15c4-5 8-6 13-6" stroke-width="2.3"/>',
pelvis:'<path d="M29 12c4 14 2 24-5 34-7 11-10 24-9 39m52-73c-4 14-2 24 5 34 8 11 10 24 9 39M27 43c8-2 15 3 21 11 6-8 13-13 21-11 6 3 6 9 2 16-5 8-10 11-16 13l-7-6-7 6c-7-2-14-7-17-13-4-8-3-13 3-16Z"/><path d="M39 58c0 5 3 8 7 8m11-8c0 5-3 8-7 8M48 28v17" opacity=".6"/>',
wrist:'<path d="m37 88 1-17c-1-7-8-17-11-23l-8-14c-1-4 3-7 6-4l12 15-6-30c-1-5 4-7 6-2l7 23-2-28c-.4-6 5-7 7-2l4 30 2-25c1-5 6-5 6 1l-1 27 6-19c2-5 7-3 6 2l-6 28c-1 10-4 17-8 23l-1 15"/><path d="M39 67q9 4 18 1m-17 5q7 3 15 1m-10-15 4-13" opacity=".55"/>',
ankle:'<path d="M35 7c2 22 1 35-3 47-2 6-5 12-3 16 3 6 11 8 20 8l25 1c8 0 11-5 7-8-5-4-11-4-18-8l-11-9c-4-4-4-10-3-16l5-31"/><path d="M39 53c-5 7-5 12 0 15 5 3 10-1 9-6-1-4-4-6-9-9Zm5 17 19 4M28 83h51" opacity=".65"/>',
head:'<path d="M29 84c5-10 8-19 0-31-10-15-8-29 2-39 12-11 32-10 41 2 7 9 2 20 6 25l5 9-7 2-2 9c-2 7-8 9-18 7l-2 16"/><path d="M34 31c3-10 13-15 23-12m-22 20c4-8 13-12 21-12m-16 19c4-5 11-8 16-8" opacity=".6"/>',
moon:'<path d="M66 67c-19-1-32-16-31-33 0-7 3-13 7-18-16 2-28 15-28 31 0 18 14 32 32 32 10 0 18-5 24-12Z"/><path d="m68 16 2 7 7 2-7 2-2 7-2-7-7-2 7-2Zm11 23 1 4 4 1-4 1-1 4-1-4-4-1 4-1Z"/>',
figure:'<path d="M35 8c-2 9-9 16-10 25-1 8 3 13 6 19 3 7 1 14-3 23l-4 12m33-79c3 9 9 15 10 25 1 8-2 14-6 20-3 5-2 12 3 23l4 11M31 53c10 5 19 6 29 1m-25 18c8 5 18 5 25 0"/><path d="M19 64c15 4 40 3 61-3m-6-2 6 2-5 5" stroke-dasharray="3 3"/>'};
function art(name){return `<svg class="drawing" viewBox="0 0 96 96" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">${artPaths[name]||artPaths.herb}</svg>`;}

// Set verified clinic details before opening real appointments. No data is sent in preview.


const byId=id=>document.getElementById(id);
const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const secureUrl=value=>{try{const url=new URL(value);return url.protocol==='https:'?url.href:''}catch{return ''}};
const ready=Boolean(clinic.booking.enabled&&secureUrl(clinic.booking.endpoint)&&clinic.phone&&clinic.booking.replyHours>0&&clinic.booking.privacyText);
const names={doctor:'의료진',fees:'비급여 진료비용',visit:'오시는 길',first:'초진 안내',privacy:'개인정보처리방침',hours:'진료시간',booking:'진료 예약'};
const departmentKeys=Object.keys(departments);
const navItems=[['doctor','의료진'],...Object.entries(departments).map(([id,d])=>[id,d.name])];
const menus=navItems.map(([id,n])=>`<a href="#${id}" data-nav="${id}">${n}</a>`).join('');
const brandGlyph=()=>`<svg class="brand-glyph" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false" style="background:none;mask:none;-webkit-mask:none;filter:none"><path d="M82 16H176C194 16 207 18 202 34C198 48 185 66 168 83L205 117L242 74H218C203 74 201 67 207 56L225 28C231 18 238 16 250 16H338C354 16 364 21 361 35C358 49 345 67 326 83L367 128C383 146 374 163 356 165C345 166 335 162 326 155L285 125L247 158C241 163 233 165 223 165H189C178 165 169 161 162 155L128 125L95 155C85 164 76 166 61 165C41 164 28 157 33 138C36 126 51 111 64 99L85 74H52C36 74 32 68 39 54L57 27C63 19 70 16 82 16Z"/><path d="M42 180H358C379 180 390 192 390 210C390 228 377 238 358 238H237V255H319C343 255 355 269 355 292V335C355 361 338 379 314 379C295 379 281 368 281 351V322C281 316 277 312 270 312H75C52 312 43 301 43 284C43 266 55 255 75 255H164V238H42C21 238 10 227 10 210C10 192 23 180 42 180Z"/></svg>`;
const brandWordmark=()=>'<span class="wordmark-shape" aria-hidden="true"></span>';
const wordmark=()=>`<a class="logo logo-final" href="#home" aria-label="쭉한의원 홈">${brandWordmark()}<span class="brand-caption" lang="en">JJUK CLINIC</span></a>`;
const button=(label,url,secondary=false,sign='arrow')=>`<a class="${secondary?'btn2':'btn'}" href="#${url}">${label}${icon(sign,16)}</a>`;
function contact(type){const label=type==='phone'?'전화':'카카오톡';const symbol=type==='phone'?'phone':'chat';const href=type==='phone'&&clinic.phone?'tel:'+clinic.phone.replace(/[^+\d]/g,''):type==='chat'&&secureUrl(clinic.kakao);return href?`<a href="${escapeHTML(href)}">${icon(symbol)}${label}</a>`:`<button type="button" data-contact="${type}">${icon(symbol)}${label}</button>`;}
const bookingLink=key=>'booking/'+(departments[key]?key:'general');
function band(key){const d=departments[key];return `<section class="band-wrap"><div class="band"><div><span class="pill">초진 안내</span><h2>${d?d.name+' 진료를 예약하려면':'첫 방문을 준비하고 계신가요?'}</h2><p>${ready?'희망 일정을 남기면 담당자가 확인 후 연락드립니다.':'개원 전 시안입니다. 희망일과 시간 선택을 미리 살펴보세요.'}</p></div><div class="ch">${contact('phone')}${contact('chat')}<a href="#${bookingLink(key)}">${icon('book')}진료 예약</a><a href="#visit">${icon('pin')}오시는 길</a></div></div></section>`;}
function topBanner(en,title,sub){return `<header class="hero"><div class="kicker" lang="en">${en}</div><h1>${title}</h1>${sub?'<p>'+sub+'</p>':''}</header>`;}
function crumb(section,title){return `<nav class="bc" aria-label="현재 위치"><a class="hm" href="#home" aria-label="홈">${icon('home',18)}</a>${section?`<a class="cell ancestor" href="#${section}">${departments[section]?.name||'진료 안내'} ${icon('chev',13)}</a>`:''}<span class="cell" aria-current="page">${title}</span></nav>`;}
function section(number,title,inner){return `<section class="pad numbered"><div class="sechd"><span class="num">${number}</span><h2>${title}</h2></div><div class="rule"></div>${inner}</section>`;}
function pairs(arr){return '<dl class="info-list">'+arr.map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')+'</dl>';}
function steps(rows){return '<div class="steps">'+rows.map(([title,body],i)=>`<div class="step"><div class="step-label">STEP 0${i+1}</div><h3>${title}</h3><p>${body}</p></div>`).join('')+'</div>';}
const hoursTable=()=>pairs([['월–금',clinic.weekdayDisplay],['토요일',clinic.saturdayDisplay],['평일 점심',clinic.lunch],['일요일','휴진']]);
const hourNote=()=>ready?'날짜별 예약 가능 시간은 예약 화면에서 확인하세요.':'예약 화면을 위한 예시 시간표입니다. 실제 운영시간과 공휴일 운영 여부는 개원 시 안내합니다.';
const visitTable=()=>pairs([['주소·층',escapeHTML([clinic.address,clinic.floor].filter(Boolean).join(' '))||'개원 장소 확정 후 안내'],['대중교통',escapeHTML(clinic.transit)||'가까운 역·출구와 도보 시간 확인 중'],['주차',escapeHTML(clinic.parking)||'주차 가능 여부·대수·요금 확인 중']]);
const primaryCredentials=[
'보건복지부 인증 한방재활의학과 전문의',
'강남자생한방병원 진료원장(TA센터)',
'장성공립노인전문요양병원 한방과장',
'경희대학교 한의학 석사 · 본초학 박사과정',
'미국 근골격계초음파 (RMSK) 인증',
'NASM-CES',
'NSCA 상급 스포츠영양학 코치',
'한의 일차의료 가이드라인 교과서 집필진<br><span class="credential-detail">불면증 · 암 관련 증상</span>'
];
const credentials='<ul class="primary-credentials">'+primaryCredentials.map(item=>`<li>${item}</li>`).join('')+'</ul>';
const homeVideo=clinic.video||media.hero;
const cvList=items=>'<ul class="cv-list">'+items.map(item=>'<li>'+item+'</li>').join('')+'</ul>';
const cvGroup=(title,description,body,open=false)=>`<details class="cv-group" ${open?'open':''}><summary><span><strong>${title}</strong><small>${description}</small></span>${icon('plus',20)}</summary><div class="cv-group-body">${body}</div></details>`;
function mediaField(){if(!clinic.clinicPhoto)return '';return `<section class="pad field"><div><div class="kicker fieldword">Our space</div><h2>편안하게 머무는 공간</h2><p>쭉한의원의 진료 공간을 만나보세요.</p></div><figure><img loading="lazy" src="${escapeHTML(clinic.clinicPhoto)}" alt="쭉한의원 진료 공간"></figure></section>`;}
function home(){return `<section class="cinema ${homeVideo?'has-video':''}" aria-label="쭉한의원 소개">
<div class="cinema-visual"><div class="brand-scene" aria-hidden="true"><div class="brand-orbit orbit-one"></div><div class="brand-orbit orbit-two"></div><div class="brand-sign"><span class="brand-emblem">${brandGlyph()}</span><span class="brand-scene-wordmark">${brandWordmark()}</span><span class="brand-scene-caption">CARE THAT STAYS WITH YOU</span></div></div>${homeVideo?`<video class="cinema-video" autoplay muted loop playsinline webkit-playsinline preload="auto" poster="${media.heroPoster}" disablepictureinpicture tabindex="-1" aria-label="이성민 원장의 진료 현장 영상"><source src="${escapeHTML(homeVideo)}"></video>`:''}</div>
<div class="cinema-content"><div class="film-eyebrow" lang="en">JJUK · CARE FOR YOUR EVERYDAY</div><h1>다시, 편안하게.<br>아픔 없이<br><em class="slogan-jjuk"><span class="visually-hidden">쭉.</span>${brandGlyph()}<span class="slogan-dot" aria-hidden="true"></span></em></h1><p class="cinema-intro">아픈 곳도, 걱정되는 마음도 편하게 이야기하세요.<br>당신의 일상을 함께 생각하는 쭉한의원입니다.</p><div class="cinema-actions">${button('나에게 맞는 진료','pain')}<button class="film-open" type="button" data-film-open>${icon(homeVideo?'play':'plus',14)}${homeVideo?'영상 크게 보기':'쭉한의원 만나보기'}</button></div></div>
<div class="film-bottom"><span lang="en">WITH YOU, ALWAYS</span><span class="film-rule" aria-hidden="true"></span><button class="film-pause" type="button" data-motion-toggle aria-label="움직임 일시정지">Ⅱ</button></div>
</section><section class="brand-promise" aria-label="쭉한의원의 약속"><p class="promise-en" lang="en">OUR PROMISE TO YOU</p><h2>진심 어린 건강 관리, <span class="promise-emblem" role="img" aria-label="쭉">${brandGlyph()}</span></h2><p class="promise-sub">‘쭉’ 건강을 책임지겠습니다.</p></section>
<section class="pad"><div class="homeheading"><div><div class="kicker" lang="en">Care guide</div><h2>어떤 점이 불편하신가요?</h2></div><a class="plainlink" href="#first">처음 오시는 분 ${icon('chev',14)}</a></div><div class="homecards">${Object.entries(departments).map(([key,d])=>`<a class="dept-card" href="#${key}"><span class="dept-tag">${d.name}</span>${art(d.icon)}<strong>${d.home}</strong><span class="small">${d.desc}</span><span class="circle-arrow">${icon('arrow',16)}</span></a>`).join('')}</div></section>
<section class="clinic-values"><div class="values-inner"><div class="values-heading"><div class="kicker" lang="en">THE JJUK WAY</div><h2>몸도 마음도 편안한 진료.<br>쭉한의원이 지킬 약속입니다.</h2><p>좋은 진료는 편안하게 이야기할 수 있는 순간부터 시작됩니다.</p></div><div class="values-grid"><article><span class="value-number">01</span><h3>진심 어린 건강 관리</h3><p>작은 불편을 세심하게 듣고,<br>건강한 일상을 함께 만들어가도록.</p></article><article><span class="value-number">02</span><h3>전문적인 실력</h3><p>몸의 상태를 세심하게 살피고,<br>치료가 필요한 이유를 이해할 수 있도록.</p></article><article><span class="value-number">03</span><h3>끊임없는 발전</h3><p>진료를 돌아보고 배움을 이어가며,<br>더 나은 진료 경험을 만들어가도록.</p></article></div></div></section>
<section class="pad doctor-teaser"><div><div class="kicker" lang="en">PEOPLE AT JJUK</div><h2>쭉한의원에서 만날 의료진</h2><p>이성민 원장 · 한방재활의학과 전문의</p></div><a href="#doctor" class="doctor-teaser-link"><div class="doctor-teaser-portrait"><img src="${media.main}" alt="이성민 원장" loading="lazy"></div><span>의료진 이야기 ${icon('arrow',18)}</span></a></section>${mediaField()}
<section class="pad visit-grid"><article><div class="kicker" lang="en">Opening hours</div><h2>진료시간</h2>${hoursTable()}<p class="note">${hourNote()}</p></article><article><div class="kicker" lang="en">Visit us</div><h2>오시는 길</h2>${visitTable()}<a class="plainlink" href="#visit">방문 안내 보기 ${icon('arrow',16)}</a></article></section>`;}
const accidentReception=[['희망일 선택','보험 접수번호가 없어도 상담을 신청할 수 있습니다.'],['접수 정보 확인','사고일과 보험사 대인 접수번호가 있다면 알려주세요.'],['보장 범위 확인','담당자가 지급보증 여부와 필요한 서류를 확인합니다.'],['예약 확정','담당자 연락으로 시간을 확인한 뒤 방문합니다.']];
function hub(key){const d=departments[key];return topBanner(d.en,d.name,d.intro)+crumb('',d.name)+(key==='accident'?section('01','자동차보험 접수 순서',steps(accidentReception)):'')+
`<section class="pad${key==='accident'?' numbered':''}" aria-label="${d.name} 증상 목록"><div class="hubg">${topics[key].map(row=>`<a class="hubc" href="#${key}/${row[0]}"><span class="small-label" lang="en">${row[0].replace('-',' ')}</span><h2>${row[1]}</h2><p>${row[3]}</p><span class="more">자세히 보기 ${icon('arrow',16)}</span></a>`).join('')}</div></section>`+band(key);}
function faq(rows){return '<div class="faq">'+rows.map(([q,a])=>`<details><summary><b>Q.</b><span>${q}</span>${icon('plus',16)}</summary><p>${a}</p></details>`).join('')+'</div>';}
function faqsFor(key){const first={pain:'검사와 동작 확인부터 시작합니다. 침이나 추나가 두렵다면 먼저 말씀해 주세요. 예상되는 자극과 불편을 듣고 치료를 선택할 수 있습니다.',accident:'사고 뒤 어디가 달라졌는지 듣고 위험 신호부터 확인합니다. 아픈 동작이나 무서운 치료가 있으면 먼저 말씀해 주세요.',herbal:'생활 리듬과 복용 약을 확인하는 상담부터 받을 수 있습니다. 복용이 걱정된다면 약 이름이나 포장 사진을 가져오세요.',wellness:'관심 부위를 살피는 상담부터 시작합니다. 시술을 고려할 때는 통증과 붓기, 회복 기간을 방법별로 안내합니다.'};
 const freq={pain:'처음에는 한 번 방문해 상태를 확인합니다. 통증의 기간과 움직임을 살핀 뒤 다음 평가 시점을 정하고, 그때 방문 간격을 조정합니다.',accident:'사고의 충격과 증상 변화에 따라 다릅니다. 첫 평가 뒤 다음 방문 시점을 정하고 생활 복귀 경과를 함께 봅니다.',herbal:'처방을 선택하면 복용 기간과 첫 경과 확인일을 함께 정합니다. 불편감이 생기면 그 전에 상담하세요.',wellness:'상담은 한 번부터 가능합니다. 시술 횟수와 간격은 피부 상태, 방법, 회복 여건을 확인한 뒤 안내합니다.'};
 const insurance=key==='accident'?'자동차보험은 보험사의 지급보증과 진료 항목에 따라 달라집니다. 대인 접수번호가 없어도 예약 상담은 가능합니다.':key==='wellness'?'미용 목적 시술은 일반적으로 비급여입니다. 항목과 금액은 시술을 결정하기 전에 확인하세요.':key==='herbal'?'건강보험 적용 여부는 처방 종류와 대상 질환 등 요건에 따라 다릅니다. 처방 전에 본인부담금과 비급여 금액을 확인하세요.':'침·추나는 급여 요건과 환자 상황에 따라 본인부담금이 달라질 수 있습니다. 약침 등 비급여 항목은 시행 전에 비용을 안내합니다.';
 return [['처음인데 아프거나 무섭지 않을까요?',first[key]],['몇 회 정도 받아야 하나요?',freq[key]],['건강보험이 적용되나요?',insurance+' <a class="plainlink" href="#fees">비용 안내 '+icon('chev',12)+'</a>']];}
function urgentFor(key,id){if(key==='accident')return '사고 뒤 팔다리에 새로 힘이 빠지거나 감각이 둔해지면 응급실로 가세요. 머리를 다친 뒤 두통이 심해지거나 반복해서 토하거나 의식이 흐려져도 즉시 119 또는 응급실을 이용하세요.';if(id==='back')return '회음부 감각이 둔해지거나 소변이 나오지 않는 등 대소변 조절에 갑자기 문제가 생기면 즉시 응급실로 가세요.';if(id==='menopause')return '폐경 후 질 출혈은 갱년기 증상으로 넘기지 말고 산부인과에서 확인하세요.';return '';}
function detail(key,r){const [id,label,title,scope,drawing,persona,quote,body,signals]=r,d=departments[key],urgent=urgentFor(key,id);return topBanner(d.name+' · '+id,title,scope)+crumb(key,label)+
section('01','증상 이야기',`<div class="s1"><div><div class="persona">문진 예시 · ${persona}</div><h3>“${quote}”</h3><p class="body">${body}</p><p class="caption">증상 이해를 돕기 위한 예시이며 실제 환자 사례가 아닙니다.</p></div><div class="ill">${art(drawing)}<span class="ill-label">${label} · ${id.toUpperCase()}</span></div></div>`)+
section('02','이런 신호가 있다면',`<div class="sig">${signals.split('|').map(s=>`<div class="c">${icon('check',17)}<span>${s}</span></div>`).join('')}</div>${urgent?`<aside class="urgent"><strong>${id==='menopause'?'먼저 확인하세요':'예약보다 응급 평가가 먼저인 경우'}</strong>${urgent}</aside>`:''}`)+section('03','진료는 이렇게 진행해요',steps(careSteps[key]))+section('04','자주 묻는 질문',faq(faqsFor(key)))+band(key);}
function doctor(){
 const education=cvList([
 '경희대학교 한의과대학원 본초학교실 박사과정 재학',
 '경희대학교 한의과대학원 본초학교실 석사 졸업',
 '동국대학교 한의과대학 졸업'
 ]);
 const experience=cvList([
 '장성공립노인전문요양병원 한방과장',
 '강남자생한방병원 진료원장 · TA센터 진료원장',
 '강남자생한방병원 외래 대진 · 병동 주치의',
 '강남자생한방병원 국제진료센터 외국인 진료 · 몽골 해외출장진료',
 '자생 메디컬 아카데미 원장 · Project Manager',
 '해외 의료 연수단 교육 · ACCME 인증 관리 · 병원 투어 · 의료진 교육 자료 제작',
 '전라남도 공중보건한의사 대표',
 '네이버 지식iN 상담한의사',
 '무주 세계 태권도 그랑프리 한의 진료실 의무위원',
 '한의 일차의료 가이드라인 교과서 집필진 — 불면증 · 암 관련 증상'
 ]);
 const certifications=cvList([
 '미국 근골격계초음파 (RMSK) 인증',
 '미국 교정운동전문가 NASM-CES',
 'NSCA 상급 스포츠영양학 코치',
 'FIFA Diploma in Football Medicine',
 '대한스포츠한의학회 공인 팀닥터 프로그램 수료',
 '척추신경추나의학회 정규과정 수료',
 '한방비만치료 전문가 과정 수료',
 '미국 미시간주립대학교 정골의과대학(MSUCOM) 고급 정골의학 연수 완료',
 '베트남 의사 예비면허 취득'
 ]);
 const societies=cvList([
 '대한스포츠한의학회 예비기획위원 활동',
 '한방재활의학과학회 평생회원',
 '한방비만학회 정회원',
 '대한동의방약학회 정회원',
 '대한한의약해외의료봉사단(KOMSTA) 정회원'
 ]);
 const papers=[
 ['만성 경항통 환자의 건강 관련 삶의 질 평가','Comparison of preference-based health-related quality of life measures for chronic neck pain: a pooled analysis of data from three RCTs','BMJ Open','https://pubmed.ncbi.nlm.nih.gov/39725423/'],
 ['포공영의 전립선비대증 동물모델 연구','Effects of Taraxaci Herba (Dandelion) on Testosterone Propionate-Induced Benign Prostatic Hyperplasia in Rats','Nutrients','https://pubmed.ncbi.nlm.nih.gov/38674879/'],
 ['암 환자 보완치료에 관한 체계적 문헌고찰 개요','An Overview of Systematic Reviews: Complementary Therapies for Cancer Patients','Integrative Cancer Therapies','https://pubmed.ncbi.nlm.nih.gov/31876212/']
 ];
 return topBanner('People at JJUK','의료진 이야기','환자의 이야기를 듣고, 더 나은 일상을 함께 생각합니다.')+crumb('','의료진')+
 section('01','이성민 원장',`<div class="story doctor-story"><img src="${media.main}" alt="이성민 원장 메인 프로필"><div><div class="kicker">LEE SEONG MIN · K.M.D.</div><h2>편안하게 이야기하고,<br>충분히 이해할 수 있도록.</h2><p>어디가 아픈지, 어떤 순간이 불편한지, 다시 하고 싶은 일은 무엇인지 묻겠습니다. 진료 과정과 치료 방향을 알기 쉽게 설명하며 함께 살피겠습니다.</p><h3 class="credentials-heading">주요 약력</h3>${credentials}</div></div>`)+
 section('02','진료와 배움의 현장',`<div class="doctor-film-intro"><div><div class="kicker" lang="en">LEARNING & CARING</div><h2>배움을 이어가고,<br>현장에서 함께합니다.</h2></div><p>미시간주립대학교 연수부터<br>무주 태권도 진료 현장까지.</p></div><figure class="doctor-film"><video id="doctor-story-film" src="${media.story}" poster="${media.storyPoster}" autoplay muted playsinline webkit-playsinline loop preload="metadata" disablepictureinpicture tabindex="-1" aria-label="쭉한의원 이성민 원장의 연수와 진료 현장 영상" aria-describedby="doctor-film-caption"><a href="${media.story}">진료 현장 영상 보기</a></video><figcaption id="doctor-film-caption"><span>연수와 진료 현장의 기록</span><button type="button" class="film-motion-toggle" data-doctor-motion-toggle aria-controls="doctor-story-film">움직임 멈춤</button></figcaption></figure>`)+
 section('03','학력·경력·자격',`<div class="cv-groups">${cvGroup('학력','경희대학교 · 동국대학교',education,true)}${cvGroup('진료·교육·대외활동','임상 진료와 의료 교육, 지역사회 활동',experience,true)}${cvGroup('자격 및 연수','근골격계 초음파 · 교정운동 · 스포츠의학 · 추나',certifications,true)}${cvGroup('학회 활동','학회 회원 및 위원 활동',societies)}</div>`)+
 section('04','수상 및 연구 이력',`<div class="award-grid"><article class="award-feature"><span class="award-year">AWARD</span><h3>보건복지부장관 표창</h3><p>일차의료건강증진사업</p></article><article class="award-secondary"><span class="award-year">AWARD</span><h3>KIOM 글로벌 원정대 대상</h3><p>한국한의학연구원 글로벌 원정대<br>팀장 역임 및 대상 수상</p></article></div><div class="research-heading"><h3>주요 연구 및 학술활동</h3><p>SCI(E) 논문 3편 · KCI 논문 5편 게재<br>ISPOR ASIA Tokyo 학회 포스터 제1저자 발표</p></div><div class="paper-list">${papers.map((paper,i)=>`<article class="paper-card"><span class="paper-number">0${i+1}</span><div><p class="paper-journal">${paper[2]}</p><h4>${paper[0]}</h4><p class="paper-title" lang="en">${paper[1]}</p><a href="${paper[3]}" target="_blank" rel="noopener noreferrer" class="plainlink">논문 정보 보기 ${icon('north',13)}<span class="sr-only">(새 창)</span></a></div></article>`).join('')}</div>`)+
 section('05','배움을 진료로 이어갑니다',`<div class="field doctor-training"><div><div class="kicker" lang="en">CONTINUING EDUCATION</div><h2>움직임을 이해하는 배움</h2><p>미국 미시간주립대학교 정골의과대학(MSUCOM)의 고급 정골의학 연수를 이수했습니다. 척추와 골반의 움직임을 평가하는 수기치료 과정을 통해 진료에 필요한 관점을 넓혔습니다.</p></div><figure><img src="${media.training}" loading="lazy" alt="미시간주립대학교 정골의학 연수 수료증을 들고 촬영한 이성민 원장"><figcaption>미시간주립대학교 정골의과대학(MSUCOM) 연수 수료</figcaption></figure></div>`)+
 section('06','현장에서 나누는 진료 경험',`<div class="field doctor-training"><div><div class="kicker" lang="en">CLINICAL EDUCATION</div><h2>설명하고, 함께 살피는 진료</h2><p>자생 메디컬 아카데미에서 해외 의료진 연수단 교육을 담당했습니다. 진료 경험을 나누고 치료 과정을 설명하며, 임상에서의 배움을 이어왔습니다.</p></div><figure><img src="${media.education}" loading="lazy" alt="해외 의료진 연수단을 대상으로 진료 과정을 설명하는 이성민 원장"><figcaption>해외 의료진 대상 임상 교육 현장</figcaption></figure></div>`)+band(null);
}
function infoPage(id){let title=names[id],content='';
 if(id==='first')content=section('01','첫 방문 전에 궁금한 점',faq([['한 번 방문하면 얼마나 걸리나요?',escapeHTML(clinic.visitDuration)+' 초진에는 문진과 움직임 평가가 포함됩니다.'],['몇 번 방문해야 하나요?','첫 방문에서 생활 목표를 정하고, 증상과 재평가 결과에 따라 방문 간격을 상의합니다.'],['침이나 추나가 아플까 걱정돼요.','먼저 진찰을 받고 방법을 결정할 수 있습니다. 바늘이나 특정 동작이 두렵다면 진료 전에 말씀해 주세요.'],['보험과 비용은 어떻게 확인하나요?','진료 항목에 따라 급여 여부와 본인부담금이 달라집니다. <a class="plainlink" href="#fees">비급여 비용 안내 '+icon('chev',13)+'</a>'],['차를 가져가도 되나요?',escapeHTML(clinic.parking)||'주차 여부·대수·비용은 개원 장소 확정 후 오시는 길에 안내합니다.'],['무엇을 준비할까요?','복용 중인 약 목록과 기존 검사 결과가 있다면 가져오세요. 교통사고 상담은 대인 접수번호가 있으면 함께 준비해 주세요.']]));
 if(id==='hours')content=section('01','요일별 진료시간',hoursTable()+'<p class="note">'+hourNote()+'</p>');
 if(id==='visit')content=section('01','방문 전 확인할 정보',visitTable()+(clinic.exteriorPhoto?`<img width="320" alt="한의원 건물 외관" src="${escapeHTML(clinic.exteriorPhoto)}">`:'<p class="note">건물 외관 사진과 출입구 안내는 개원 장소가 정해지면 등록합니다.</p>')+(secureUrl(clinic.mapUrl)?`<a class="plainlink" href="${escapeHTML(clinic.mapUrl)}">지도에서 보기 ${icon('north',14)}</a>`:''))+section('02','진료시간',hoursTable()+'<p class="note">'+hourNote()+'</p>');
 if(id==='fees')content=section('01','비급여 항목과 금액',`<p>${ready?'항목별 고지 금액입니다.':'개원 전 검토 중인 항목입니다. 세부 항목과 실제 금액은 확정 후 게시합니다.'}</p><table class="fees"><thead><tr><th>구분</th><th>단위</th><th>금액</th></tr></thead><tbody>${clinic.fees.map(row=>'<tr>'+row.map(s=>'<td>'+escapeHTML(s)+'</td>').join('')+'</tr>').join('')}</tbody></table><p class="note">건강보험 급여 항목은 본인부담금 기준이며 환자 상황과 적용 요건에 따라 달라질 수 있습니다.</p>`);
 if(id==='privacy')content=section('01',ready?'예약 개인정보 처리 안내':'개원 전 미리보기의 개인정보 처리',ready?`<p style="white-space:pre-line">${escapeHTML(clinic.booking.privacyText)}</p>`:`<div class="info-block"><h2>입력과 저장</h2><p>미리보기의 이름과 연락처는 예시값으로 고정되어 있습니다. 희망일과 시간은 현재 화면에만 표시되며, 예약 정보는 전송하거나 저장하지 않습니다.</p></div><div class="info-block"><h2>외부 서비스</h2><p>온라인에서 열면 서체 표시를 위해 Google Fonts에 연결될 수 있습니다. 이 페이지는 방문 통계 도구나 광고 쿠키를 사용하지 않습니다.</p></div><div class="info-block"><h2>실제 접수 시작 전</h2><p>예약 수집 항목과 목적, 보유 기간과 파기 방법, 수탁자와 국외 이전 해당 여부, 이용자 권리 및 담당자 연락처를 확정해 게시합니다.</p></div>`);
 return topBanner('Patient information',title,'')+crumb('',title)+content+band(null);}
function renderSlots(date,keep){
  const available=availableHours(date,clinic);
 if(!available.length)return '<p>선택할 수 있는 시간이 없습니다. 다른 날짜를 선택해 주세요.</p>';
 return [['오전',available.filter(h=>h<13)],['오후',available.filter(h=>h>13)]].filter(([,hours])=>hours.length).map(([label,hours])=>'<div class="slot-group"><span class="slot-label">'+label+'</span><div class="slot-options">'+hours.map(hour=>`<label class="slot"><input type="radio" name="time" value="${hour}" ${String(hour)===String(keep)?'checked':''} required><span>${String(hour).padStart(2,'0')}:00</span></label>`) .join('')+'</div></div>').join('');
}
function booking(key){
 const d=departments[key];const today=koreaNow().date,next=firstBookDate(clinic);
 const sample=ready?'':' readonly';
 return topBanner('Appointment',d?d.name+' 진료 예약':'진료 예약',ready?'희망 일정을 남겨 주세요. 담당자 연락 후 예약이 확정됩니다.':'개원 전 미리보기 · 예약 절차를 살펴보세요.')+crumb(d?key:'','진료 예약')+
 `<section class="pad form-section"><div class="form-intro"><strong>${ready?'예약 요청 안내':'예약 미리보기'}</strong><p>${ready?'담당자가 영업일 기준 '+clinic.booking.replyHours+'시간 이내에 연락드립니다.':'이름과 연락처는 예시로 표시됩니다. 날짜와 시간을 골라 다음 화면을 확인해 보세요. 실제 접수나 연락은 이루어지지 않습니다.'}</p></div><form id="appointment" data-key="${d?key:'general'}"><div class="form-grid">
 <div class="form-field wide"><label for="dept">진료 분야</label><select id="dept" name="department"><option value="general">아직 정하지 않았어요</option>${departmentKeys.map(k=>`<option value="${k}" ${key===k?'selected':''}>${departments[k].name}</option>`).join('')}</select></div>
 <div class="form-field"><label for="patient">이름</label><input id="patient" name="patient" type="text" maxlength="50" required autocomplete="${ready?'name':'off'}" ${sample} ${ready?'':'value="예시 방문자"'}></div>
 <div class="form-field"><label for="tel">연락처</label><input id="tel" name="phone" type="tel" ${ready?'inputmode="tel"':''} required autocomplete="${ready?'tel':'off'}" maxlength="22" ${sample} ${ready?'':'value="010-****-****"'}></div>
 <div class="form-field wide"><label for="date">희망일</label><input id="date" name="date" type="date" required min="${today}" value="${next}"></div>
 <fieldset class="wide"><legend>희망시간</legend><div id="slots" class="slots">${renderSlots(next)}</div><p class="note">한국 시간 기준 · 일요일, 휴진일, 점심시간 제외</p></fieldset>
 <div class="form-field wide" id="insurance-group" ${key==='accident'?'':'hidden'}><label for="insurance">보험 접수번호 (선택)</label><input id="insurance" name="insurance" maxlength="60" ${sample} placeholder="${ready?'접수번호가 있으면 입력하세요':'미리보기에서는 입력하지 않습니다'}"></div>
 <div class="form-field wide" id="accdate-group" ${key==='accident'?'':'hidden'}><label for="accdate">사고일자 (선택)</label><input id="accdate" name="accidentDate" type="date" max="${today}"></div>
 ${ready?`<div class="wide"><details><summary>예약 정보 수집 및 이용 안내</summary><p style="white-space:pre-line">${escapeHTML(clinic.booking.privacyText)}</p></details><label class="checklabel"><input type="checkbox" required name="consent" value="yes">예약 정보 수집·이용에 동의합니다.</label></div>`:''}</div><div class="formactions"><button class="btn" id="submit-book" type="submit">${ready?'예약 신청 보내기':'선택한 일정 확인하기'}${icon('arrow',16)}</button></div><div id="form-feedback" class="feedback" role="status"></div></form><div id="receipt" class="response" tabindex="-1" hidden></div></section>`;
}
function bindForm(){
 const form=byId('appointment');if(!form)return;
 const date=byId('date'),dept=byId('dept'),submit=byId('submit-book'),feedback=byId('form-feedback');
 const slots=byId('slots');
 function refresh(){const keep=form.elements.time?.value;slots.innerHTML=renderSlots(date.value,keep);submit.disabled=!availableHours(date.value,clinic).length;feedback.textContent='';}
 date.addEventListener('change',refresh);
 dept.addEventListener('change',()=>{const visible=dept.value==='accident';for(const name of ['insurance','accdate']){const el=byId(name);el.disabled=!visible;el.closest('.form-field').hidden=!visible;if(!visible)el.value='';}history.replaceState(null,'','#'+bookingLink(dept.value));const title=departments[dept.value]?.name;document.querySelector('.hero h1').textContent=(title?title+' ':'')+'진료 예약';document.title=(title?title+' ':'')+'진료 예약 | '+clinic.brand;linkBooking(dept.value);document.querySelector('.bc').outerHTML=crumb(departments[dept.value]?dept.value:'','진료 예약');document.querySelectorAll('[data-nav]').forEach(a=>{if(a.dataset.nav===dept.value)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});});
 form.addEventListener('submit',async event=>{
   event.preventDefault();if(submit.disabled||!form.reportValidity())return;
   const hour=form.elements.time?.value;
   if(!hour||!availableHours(date.value,clinic).includes(Number(hour))){refresh();feedback.textContent='선택할 수 있는 시간을 다시 확인해 주세요.';return;}
   const displayDate=date.value.replace(/-/g,'. '),displayTime=String(hour).padStart(2,'0')+':00', chosen=departments[dept.value]?.name||'진료 분야 미정';
   const receipt=byId('receipt');
   function finish(title,body){form.hidden=true;receipt.hidden=false;receipt.innerHTML=`<h2>${title}</h2><p><strong>${chosen} · ${displayDate} · ${displayTime}</strong></p><p>${body}</p><div class="actions">${ready?'':'<button type="button" class="btn2" id="revise">일정 다시 선택</button>'}${button('홈으로','home',true,'home')}</div>`;const revise=byId('revise');if(revise)revise.onclick=()=>{receipt.hidden=true;form.hidden=false;refresh();date.focus();};receipt.focus();}
   if(!ready){finish('선택한 예시 일정입니다','예약 절차 미리보기를 마쳤습니다. 실제 예약 요청은 접수되지 않았습니다.');return;}
   if(form.elements.patient.value.trim()===''||!/^\+?\d{8,15}$/.test(form.elements.phone.value.replace(/[\s()-]/g,''))){feedback.textContent='이름과 연락 가능한 전화번호를 확인해 주세요.';return;}
   const data=Object.fromEntries(new FormData(form));data.time=displayTime;
   if(dept.value!=='accident'){delete data.insurance;delete data.accidentDate;}
   for(const control of form.elements)control.disabled=true;
   feedback.textContent='예약 요청을 전송하고 있습니다.';
   try{const result=await fetch(clinic.booking.endpoint,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(data),credentials:'omit',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(15000)});if(!result.ok)throw Error('delivery');
     finish('예약 요청을 보냈습니다',`아직 확정 전입니다. 접수 담당자가 영업일 기준 ${clinic.booking.replyHours}시간 이내에 입력하신 연락처로 확인 연락을 드립니다.`);form.reset();
   }catch{feedback.innerHTML=`접수 여부를 확인할 수 없습니다. 다시 보내기 전에 <a href="tel:${escapeHTML(clinic.phone.replace(/[^+\d]/g,''))}">대표전화 ${escapeHTML(clinic.phone)}</a>로 확인해 주세요.`;}
   finally{for(const control of form.elements)control.disabled=false;}
 });
 refresh();
}
function layout(){
 byId('site-header').innerHTML=`<div class="utility"><span><i class="dot"></i>${ready?'진료·예약 안내':'개원 준비 중'}</span><a href="#hours">${icon('clock',13)}진료시간 안내</a><button class="util-phone" data-contact="phone">${clinic.phone?escapeHTML(clinic.phone):'대표전화 개설 예정'}</button></div><div class="top">${wordmark()}<nav class="nav" aria-label="주 메뉴">${menus}</nav><a class="btn top-book" href="#booking/general">${icon('book',16)} 진료 예약</a><button class="hamb" type="button" id="hamb" aria-label="메뉴 열기" aria-expanded="false" aria-controls="drawer">${icon('menu',22)}</button></div><nav id="drawer" class="drawer" aria-label="모바일 주 메뉴" hidden>${navItems.map(([id,n])=>`<a href="#${id}" data-nav="${id}">${n}${icon('chev',14)}</a>`).join('')}</nav>`;
 byId('site-footer').innerHTML=`<div class="footer-top"><span class="footer-brand" role="img" aria-label="쭉한의원">${brandWordmark()}</span><nav class="footlinks" aria-label="이용 안내"><a href="#fees">비급여 진료비용</a><a href="#privacy">개인정보처리방침</a><a href="#first">초진 안내</a></nav></div><p>상호 쭉한의원 · 대표자 이성민 · 사업자등록번호 ${escapeHTML(clinic.business)||'개원 시 공지'} · 개설신고번호 ${escapeHTML(clinic.permit)||'개원 시 공지'}</p><p>주소 ${escapeHTML(clinic.address)||'개원 장소 확정 후 안내'} · 대표전화 ${escapeHTML(clinic.phone)||'개설 후 안내'}</p>`;
 byId('mobilebar').innerHTML=contact('phone')+contact('chat')+`<a class="reserve top-book" href="#booking/general">${icon('book')}예약</a><a href="#visit">${icon('pin')}오시는 길</a>`;
}
function linkBooking(key){document.querySelectorAll('.top-book').forEach(a=>a.href='#'+bookingLink(key));}
function setMenu(open){const btn=byId('hamb');byId('drawer').hidden=!open;btn.setAttribute('aria-expanded',String(open));btn.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');btn.innerHTML=icon(open?'close':'menu',22);}
function renderRoute(focus=true){
 const [id='home',part='']=location.hash.slice(1).split('/');let html,title,axis=null;
 if(departments[id]){axis=id;const row=topics[id].find(x=>x[0]===part);html=row?detail(id,row):hub(id);title=row?row[2]:departments[id].name;}
 else if(id==='booking'){axis=departments[part]?part:null;html=booking(axis);title=(axis?departments[axis].name+' ':'')+'진료 예약';}
 else if(id==='doctor'){html=doctor();title='의료진';}
 else if(Object.hasOwn(names,id)){html=infoPage(id);title=names[id];}
 else{html=home();title='다시, 편안하게. 아픔 없이 쭉.';}
 const film=byId('film-dialog');if(film.open)film.close();
 const dialog=byId('dialog');if(dialog.open)dialog.close();setMenu(false);const app=byId('app');app.innerHTML=html;document.title=title+' | '+clinic.brand;
 document.querySelectorAll('[data-nav]').forEach(a=>{if(a.dataset.nav===(axis||id))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 linkBooking(axis);bindForm();if(focus){app.focus({preventScroll:true});window.scrollTo(0,0);}
 initHomeMotion();initDoctorFilm();
}

// Use the supplied clinical footage; clinic.video may override the default loop.
// The brand scene remains available if the video cannot load.
let userPaused=matchMedia('(prefers-reduced-motion: reduce)').matches;
let motionObserver=null, revealObserver=null, heroInView=true, homeFilm=null;
let doctorFilm=null, doctorFilmObserver=null, doctorFilmInView=false;
let doctorFilmUserPaused=matchMedia('(prefers-reduced-motion: reduce)').matches;
function applyDoctorFilmMotion(){
 const video=doctorFilm;if(!video?.isConnected)return;
 const button=document.querySelector('[data-doctor-motion-toggle]');
 if(button){button.textContent=doctorFilmUserPaused?'움직임 재생':'움직임 멈춤';button.setAttribute('aria-label',doctorFilmUserPaused?'진료 현장 영상 재생':'진료 현장 영상 일시정지');}
 if(doctorFilmUserPaused||!doctorFilmInView||document.hidden){video.pause();return;}
 if(video.paused)video.play().catch(error=>{
  if(error.name==='AbortError'||video!==doctorFilm||!video.isConnected)return;
  // Keep the poster and a quiet text control if the browser blocks autoplay.
  doctorFilmUserPaused=true;applyDoctorFilmMotion();
 });
}
function initDoctorFilm(){
 if(doctorFilmObserver)doctorFilmObserver.disconnect();
 if(doctorFilm)doctorFilm.pause();
 doctorFilm=byId('doctor-story-film');doctorFilmInView=false;
 if(!doctorFilm)return;
 doctorFilm.muted=true;doctorFilm.defaultMuted=true;doctorFilm.playsInline=true;
 if(doctorFilmUserPaused)doctorFilm.autoplay=false;
 const rect=doctorFilm.getBoundingClientRect();
 doctorFilmInView=rect.bottom>0&&rect.top<window.innerHeight;
 if('IntersectionObserver' in window){
  doctorFilmObserver=new IntersectionObserver(entries=>{
   const entry=entries[0];doctorFilmInView=entry.isIntersecting&&entry.intersectionRatio>=.15;
   applyDoctorFilmMotion();
  },{threshold:[0,.15]});
  doctorFilmObserver.observe(doctorFilm);
 }
 document.querySelector('[data-doctor-motion-toggle]').addEventListener('click',()=>{
  doctorFilmUserPaused=!doctorFilmUserPaused;applyDoctorFilmMotion();
 });
 applyDoctorFilmMotion();
}
function applyMotion(){
 const hero=document.querySelector('.cinema'); if(!hero)return;
 const paused=userPaused||!heroInView||document.hidden||byId('film-dialog').open;
 hero.classList.toggle('is-paused',paused);
 const button=hero.querySelector('[data-motion-toggle]');
 button.textContent=userPaused?'▷':'Ⅱ';button.setAttribute('aria-label',userPaused?'움직임 재생':'움직임 일시정지');
 const video=hero.querySelector('video');
 if(video&&!video.hidden){
  if(paused)video.pause();
  else video.play().catch(error=>{
   // Pausing or leaving the page can interrupt play(); this is not a failure.
   if(error.name==='AbortError'||!hero.isConnected||video.hidden)return;
   if(video.error){showBrandFallback(hero,video);return;}
   userPaused=true;applyMotion();
  });
 }
}
function showBrandFallback(hero,video){
 video.hidden=true;video.pause();hero.classList.remove('has-video');
 hero.querySelector('[data-film-open]').innerHTML=icon('plus',14)+'쭉한의원 만나보기';
 if(hero.isConnected)applyMotion();
}
function initHomeMotion(){
 if(motionObserver)motionObserver.disconnect();if(revealObserver)revealObserver.disconnect();
 if(homeFilm)homeFilm.pause();homeFilm=null;
 heroInView=true;const hero=document.querySelector('.cinema');
 if(!hero)return;
 const video=hero.querySelector('video');
 if(video){
  homeFilm=video;video.muted=true;video.defaultMuted=true;video.playsInline=true;
  video.autoplay=!userPaused;
  video.addEventListener('error',()=>showBrandFallback(hero,video),true);
 }
 if('IntersectionObserver' in window){
  motionObserver=new IntersectionObserver(entries=>{heroInView=entries[0].isIntersecting;applyMotion();},{threshold:.05});motionObserver.observe(hero);
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
   revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}}),{threshold:.08});
   document.querySelectorAll('#app>.pad,#app>.clinic-values').forEach(el=>{if(el.getBoundingClientRect().top>window.innerHeight){el.classList.add('reveal-pending');revealObserver.observe(el);}});
  }
 }
 applyMotion();
}
function openFilm(){
 const dialog=byId('film-dialog');const hero=document.querySelector('.cinema');
 const hasVideo=Boolean(homeVideo&&hero?.classList.contains('has-video'));
 byId('film-dialog-content').innerHTML=hasVideo?`<video class="film-dialog-video" src="${escapeHTML(homeVideo)}" poster="${media.heroPoster}" muted playsinline controls aria-label="쭉한의원 소개 영상"></video><h2 id="film-dialog-title" class="film-video-caption">다시, 편안하게. 아픔 없이.</h2>`:`<div class="clinic-dialog"><div class="clinic-dialog-mark brand-emblem" aria-hidden="true">${brandGlyph()}</div><div class="kicker" lang="en">HELLO, WE ARE JJUK</div><h2 id="film-dialog-title">진심 어린 건강 관리,<br>쭉.</h2><p>아픈 곳도, 걱정되는 마음도 편하게 이야기하세요.<br>충분히 듣고, 세심하게 살피고, 알기 쉽게 설명하겠습니다.</p><div class="dialog-principles"><span>진심 어린 건강 관리</span><span>전문적인 실력</span><span>끊임없는 발전</span></div><a class="btn" href="#first">첫 방문 안내 ${icon('arrow',16)}</a></div>`;
 dialog.showModal();applyMotion();
 if(hasVideo)dialog.querySelector('video').play().catch(()=>{});
}
byId('film-dialog').addEventListener('close',()=>{const v=byId('film-dialog').querySelector('video');if(v)v.pause();applyMotion();});
byId('film-dialog').addEventListener('click',e=>{if(e.target===byId('film-dialog')){const rect=e.target.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)e.target.close();}});
document.addEventListener('visibilitychange',applyMotion);
document.addEventListener('visibilitychange',applyDoctorFilmMotion);
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',e=>{userPaused=e.matches;doctorFilmUserPaused=e.matches;document.querySelectorAll('.reveal-pending').forEach(el=>el.classList.add('is-visible'));applyMotion();applyDoctorFilmMotion();});
document.addEventListener('click',e=>{
 if(e.target.closest('[data-motion-toggle]')){userPaused=!userPaused;applyMotion();}
 if(e.target.closest('[data-film-open]'))openFilm();
 if(e.target.closest('[data-film-close]'))byId('film-dialog').close();
});

layout();renderRoute(false);
window.addEventListener('hashchange',()=>renderRoute());
document.addEventListener('click',e=>{
 if(e.target.closest('.skip')){e.preventDefault();byId('app').focus();return;}
 const hamburger=e.target.closest('#hamb');if(hamburger){setMenu(byId('drawer').hidden);return;}
 const target=e.target.closest('[data-contact]');
 if(target){if(target.dataset.contact==='phone'&&clinic.phone){location.href='tel:'+clinic.phone.replace(/[^+\d]/g,'');return;}const isPhone=target.dataset.contact==='phone';byId('dialog-title').textContent=isPhone?'대표전화 안내':'카카오톡 상담 안내';byId('dialog-text').textContent=isPhone?'개원 전으로, 대표번호는 개설 후 이곳에 안내합니다.':'개원 전으로, 상담 채널은 개설 후 이곳에 안내합니다.';byId('dialog').showModal();return;}
 const a=e.target.closest('a[href^="#"]');if(a&&a.hash===location.hash){setMenu(false);if(a.hash!=='#app'){e.preventDefault();window.scrollTo(0,0);}}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!byId('drawer').hidden){setMenu(false);byId('hamb').focus();}});
byId('dismiss').onclick=()=>byId('dialog').close();

