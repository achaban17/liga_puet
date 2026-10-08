/* Модуль «Практика бакалаврів» (віртуальне підприємство) у складі платформи Ліга ПУЕТ. Працює всередині оболонки: авторизацію, профіль і сховище дає платформа. */
const PRACTICE=(function(){

'use strict';
/* ========= ДАНІ ========= */
const MONTHS=['Січень','Лютий','Березень','Квітень','Травень','Червень','Липень'];
const MONTHS_GEN=['січня','лютого','березня','квітня','травня','червня','липня'];
const MON_SHORT=['Січ','Лют','Бер','Кві','Тра','Чер','Лип'];
const DAYS=[31,28,31,30,31,30,31];
const TOTAL_MONTHS=7;

const PROGRAMS=[
 {id:'GRS',short:'ГРС',name:'Готельно-ресторанна справа',code:'J2'},
 {id:'RT',short:'РТ',name:'Ресторанні технології',code:'G13'},
 {id:'HT',short:'ХТІ',name:'Харчові технології та інженерія',code:'G13'},
 {id:'TUR',short:'ТУР',name:'Туризм',code:'J3'},
 {id:'TTP',short:'ТТП',name:'Товарознавство і торговельне підприємництво',code:'D7'},
 {id:'PTL',short:'ПТЛ',name:'Підприємництво, торгівля та логістика',code:'D7'},
 {id:'MAR',short:'МАР',name:'Маркетинг',code:'D5'},
 {id:'IM',short:'ІМ',name:'Інтернет-маркетинг',code:'D5'},
 {id:'OA',short:'ОА',name:'Облік і аудит',code:'D1'},
 {id:'FBS',short:'ФБС',name:'Фінанси, банківська справа та страхування',code:'D2'},
 {id:'MEN',short:'МЕН',name:'Менеджмент',code:'D3'},
 {id:'UP',short:'УП',name:'Управління персоналом міжнародних корпорацій',code:'C1'},
 {id:'PRA',short:'ПРА',name:'Право',code:'D8'},
 {id:'KN',short:'КН',name:'Комп’ютерні науки',code:'F3'}
];
const PROG=Object.fromEntries(PROGRAMS.map(p=>[p.id,p]));
const NEXT_WAVE=['Економіка','Міжнародні економічні відносини','Бізнес-адміністрування','Експертиза та митна справа','Германські мови та літератури (переклад)'];

const ROLES={
 dir:{label:'Директор',programs:['MEN','UP'],trainers:['Стратегічні цілі і KPI','Управлінські рішення в умовах ризику']},
 fin:{label:'Фінансовий менеджер',programs:['FBS','OA'],trainers:['Беззбитковість і маржинальний аналіз','Бюджет руху грошових коштів']},
 acc:{label:'Бухгалтер',programs:['OA','FBS'],trainers:['Звіт про фінансові результати','Податок на прибуток']},
 mkt:{label:'Маркетолог',programs:['MAR','IM'],trainers:['Сегментація і позиціонування','Медіапланування']},
 hr:{label:'HR-менеджер',programs:['UP','MEN'],trainers:['Нарахування заробітної плати','Мотивація персоналу']},
 chef:{label:'Шеф-технолог',programs:['RT','HT'],trainers:['Технологічні карти','Калькуляція собівартості страв']},
 svc:{label:'Менеджер із сервісу',programs:['GRS','TUR'],trainers:['Стандарти обслуговування','Управління доходами']},
 com:{label:'Товарознавець',programs:['TTP'],trainers:['ABC- і XYZ-аналіз','Експертиза якості товарів']},
 log:{label:'Логіст із закупівель',programs:['PTL','TTP'],trainers:['Управління запасами','Вибір постачальника']},
 qa:{label:'Менеджер з якості',programs:['HT','TTP','RT'],trainers:['Система HACCP','Вхідний контроль якості']},
 law:{label:'Юрист',programs:['PRA'],trainers:['Господарські договори','Трудові спори']},
 it:{label:'Digital-менеджер',programs:['KN','IM'],trainers:['Веб-аналітика і воронки','Автоматизація бізнес-процесів']}
};

const TYPES={
 restaurant:{name:'Кафе-ресторан',icon:'cup',desc:'Кухня, зал, меню і гості',names:['«Зелена липа»','«Сім ложок»','«Кулінарний двір»','«Смачна Ворскла»','«Липневий сад»','«Гостинна хата»'],
  required:['chef','svc','mkt','fin'],optional:['dir','acc','hr','log','it','law','qa'],labels:{svc:'Менеджер залу'},progs:{chef:['RT','HT']},
  unit:'гостей',priceLabel:'Середній чек',price:[300,360,440],qualityLabel:'Рівень продуктів у меню',qualityOpts:['Економ','Стандарт','Преміум'],
  unitCost:[105,135,175],staffOpts:[10,12,14],capacity:[2250,2700,3150],salary:22000,fixed:165000,base:2250,
  season:[0.86,0.9,1.0,1.04,1.1,1.14,1.12],chFit:[1.0,1.1,0.8],startCash:350000,target:0.07,qualityRoles:['chef','qa'],channelRoles:['mkt','it']},
 hotel:{name:'Міні-готель',icon:'bed',desc:'30 номерів, бронювання, сервіс',names:['«Корпусний сад»','«Полтавські зорі»','«Ворскла Інн»','«Тиха вулиця»','«Старий парк»','«Каштановий двір»'],
  required:['svc','mkt','fin'],optional:['dir','hr','it','chef','acc','law','log'],labels:{svc:'Менеджер готелю',chef:'Шеф кухні сніданків'},progs:{svc:['GRS','TUR']},
  unit:'ночей',priceLabel:'Ціна номера за ніч',price:[1300,1650,2100],qualityLabel:'Рівень сервісу і сніданків',qualityOpts:['Базовий','Стандарт','Комфорт+'],
  unitCost:[520,650,840],staffOpts:[8,10,12],capacity:[720,810,880],salary:21000,fixed:340000,base:600,
  season:[0.78,0.82,0.92,1.0,1.08,1.18,1.25],chFit:[0.9,1.15,1.0],startCash:600000,target:0.06,qualityRoles:['svc','chef'],channelRoles:['mkt','it']},
 retail:{name:'Магазин біля дому',icon:'basket',desc:'Асортимент, закупівлі, каса',names:['«Свій кошик»','«Поруч»','«Щодня»','«Комора»','«Сусідська крамниця»','«Повна торба»'],
  required:['com','log','mkt','fin'],optional:['dir','it','hr','acc','law','qa'],labels:{com:'Категорійний менеджер'},progs:{},
  unit:'чеків',priceLabel:'Середній чек',price:[232,250,280],qualityLabel:'Асортимент',qualityOpts:['Базовий','Збалансований','Розширений'],
  unitCost:[172,186,206],staffOpts:[6,8,10],capacity:[6800,8200,9600],salary:20000,fixed:220000,base:7200,
  season:[0.95,0.93,1.0,1.0,1.03,1.02,1.0],chFit:[0.85,1.1,0.9],startCash:500000,target:0.025,qualityRoles:['com','log'],channelRoles:['mkt','it']},
 production:{name:'Кондитерський цех',icon:'factory',desc:'Десерти для кав’ярень міста',names:['«Солодка Полтава»','«Десертна лабораторія»','«Медова пекарня»','«Карамель»','«Вишневий цех»','«Пряник і Ко»'],
  required:['chef','qa','log','fin'],optional:['mkt','dir','acc','hr','it','law'],labels:{chef:'Технолог виробництва',log:'Менеджер зі збуту'},progs:{chef:['HT','RT'],log:['PTL','MAR','TTP'],qa:['TTP','HT','RT']},
  unit:'порцій',priceLabel:'Ціна для кав’ярень',price:[55,64,76],qualityLabel:'Сировина',qualityOpts:['Економ','Стандарт','Преміум'],
  unitCost:[27,31,39],staffOpts:[5,6,8],capacity:[8200,10000,13000],salary:21000,fixed:105000,base:9000,
  season:[0.9,1.0,0.95,1.0,1.05,1.0,0.95],chFit:[0.6,0.7,1.25],startCash:250000,target:0.04,qualityRoles:['chef','qa'],channelRoles:['mkt','log']}
};
const TYPE_ORDER=['restaurant','retail','hotel','production'];

const CENTER_GROUP={OA:'audit',PRA:'law',KN:'it',FBS:'bank',MAR:'mkt',IM:'mkt',UP:'hr',MEN:'consult'};
const CENTERS={
 audit:{name:'Аудиторська фірма',role:'Аудитор',serves:'Щомісяця перевіряє звіти компаній-клієнтів.'},
 law:{name:'Юридична фірма',role:'Юрист-консультант',serves:'Супроводжує договори, претензії і спори компаній.'},
 it:{name:'IT-студія',role:'Розробник',serves:'Робить сайти й автоматизацію на замовлення компаній.'},
 bank:{name:'Банк «ПУЕТ-Кредит»',role:'Кредитний аналітик',serves:'Оцінює фінансовий стан і кредитні заявки компаній.'},
 mkt:{name:'Маркетингова агенція',role:'Маркетолог агенції',serves:'Веде рекламні кампанії для кількох компаній.'},
 hr:{name:'Кадрове агентство',role:'Рекрутер',serves:'Добирає персонал і готує кадрові політики.'},
 consult:{name:'Консалтингова агенція',role:'Консультант',serves:'Аналізує стратегії компаній і дає рекомендації.'}
};

const LEVELS={
 1:{title:'Стажер',events:1,hints:true,text:'Ціну, якість і бюджет задано умовами практики. Команда керує персоналом і каналом просування, реагує на одну подію на тиждень. Біля кожного варіанта є підказка.'},
 2:{title:'Фахівець',events:2,hints:true,text:'Додаються ціна і якість продукту. Дві події на тиждень, підказки залишаються.'},
 3:{title:'Керівник відділу',events:2,hints:false,text:'Повний контроль операційних рішень, включно з маркетинговим бюджетом. Дві події на тиждень, без підказок.'},
 4:{title:'Директор',events:3,hints:false,text:'Інвестиції. Три події на тиждень, кризові сценарії, без підказок.'}
};

const BUDGETS=[0,15000,30000,50000];
const CHANNELS=['Соцмережі й короткі відео','Онлайн-карти і відгуки','Партнерства з бізнесом'];
const INVESTS=[
 {id:'none',label:'Без інвестицій',cost:0,hint:'Гроші залишаються в резерві.'},
 {id:'online',label:'Онлайн-замовлення і сайт',cost:45000,hint:'Плюс 5% клієнтів, починаючи з цього місяця.'},
 {id:'gen',label:'Генератор і акумулятори',cost:120000,hint:'Відключення світла більше не зупиняють роботу.'},
 {id:'training',label:'Програма навчання персоналу',cost:30000,hint:'Рейтинг зростає на 0,15, мораль на 8 пунктів.'}
];
const DECISIONS={
 price:{minLevel:2,roles:['fin','dir','acc']},
 quality:{minLevel:2,roles:null},
 staff:{minLevel:1,roles:['hr','svc','dir']},
 budget:{minLevel:3,roles:['mkt','it','fin']},
 channel:{minLevel:1,roles:null},
 invest:{minLevel:4,roles:['dir','fin']}
};
const DEC_ORDER=['price','quality','staff','budget','channel','invest'];
const DEC_PKG={price:['fin'],quality:['chef','com','qa'],staff:['svc','hr'],budget:['mkt'],channel:['mkt'],invest:['dir','fin']};

const EVENTS=[
{id:'supplier',title:'Постачальник підняв ціни на 15%',roles:['log','chef','com','fin'],sev:'warn',learn:'Закупівлі і собівартість',
 text:'Основний постачальник повідомив про підвищення закупівельних цін з наступного тижня. Альтернативні постачальники є, але їх треба перевірити.',
 options:[
  {label:'Прийняти нові ціни',hint:'Нічого не зупиниться, але собівартість зросте надовго.',eff:{costMult:1.02,persist:{costMult:1.05}}},
  {label:'Провести тендер серед трьох постачальників',hint:'Займе час, зате збереже маржу. Є ризик зриву першої поставки.',eff:{cash:-4000,persist:{costMult:1.01}},chance:{p:0.25,eff:{rep:-0.1,capMult:0.95},note:'Новий постачальник один раз зірвав поставку.'}},
  {label:'Переглянути рецептури чи асортимент під нові ціни',hint:'Частково компенсує подорожчання, клієнти можуть помітити зміни.',eff:{cash:-2000,rep:-0.04,persist:{costMult:1.025}}}]},
{id:'inspection',title:'Планова перевірка безпечності харчових продуктів',roles:['qa','chef','com','svc','dir'],sev:'warn',learn:'Система HACCP і готовність до перевірок',
 text:'Через два тижні очікується планова державна перевірка безпечності продукції і санітарних норм.',
 options:[
  {label:'Провести внутрішній аудит HACCP заздалегідь',hint:'Невеликі витрати, перевірка мине спокійно.',eff:{cash:-8000,rep:0.04}},
  {label:'Працювати як завжди',hint:'Без витрат, але є ризик штрафу.',eff:{},chance:{p:0.45,eff:{cash:-34000,rep:-0.25},note:'Інспектор зафіксував порушення умов зберігання: штраф і згадка в місцевих медіа.'}}]},
{id:'review',types:['restaurant','hotel','retail'],title:'Блогер опублікував негативний відгук',roles:['mkt','it','svc'],sev:'bad',learn:'Репутація і робота з відгуками',
 text:'Популярний полтавський блогер поскаржився на обслуговування. Допис зібрав тисячі переглядів, у коментарях сперечаються.',
 options:[
  {label:'Публічно подякувати, розібратися і запросити знову',hint:'Коштує недорого, репутація навіть зростає.',eff:{cash:-3000,rep:0.06}},
  {label:'Не реагувати',hint:'Нічого не коштує, але рейтинг просяде.',eff:{rep:-0.15}},
  {label:'Сперечатися в коментарях',hint:'Ризиковано: скандал відлякає частину клієнтів.',eff:{rep:-0.3,demandMult:0.96}}]},
{id:'staffquit',title:'Двоє досвідчених працівників звільняються',roles:['hr','dir','svc'],sev:'bad',learn:'Утримання персоналу і мотивація',
 text:'Працівники отримали пропозицію від конкурента з вищою зарплатою. Решта персоналу стежить, як відреагує керівництво.',
 options:[
  {label:'Підняти зарплату всій команді на 8%',hint:'Дорожче надовго, але команда залишиться і мотивація зросте.',eff:{morale:12,persist:{salaryMult:1.08}}},
  {label:'Терміново найняти через кадрове агентство',hint:'Разові витрати, новачкам потрібен час.',eff:{cash:-18000,morale:-3,capMult:0.97}},
  {label:'Перерозподілити обов’язки між іншими',hint:'Економія, але навантаження і втома зростуть.',eff:{capMult:0.9,morale:-12}}]},
{id:'outage',requiresNot:'gen',title:'Графіки відключень світла на два тижні',roles:['dir','fin','log','it'],sev:'bad',learn:'Безперервність бізнесу',
 text:'Енергетики оголосили відключення до 8 годин на добу. Без резервного живлення частину часу доведеться не працювати.',
 options:[
  {label:'Орендувати генератор на місяць',hint:'Працюєте майже повноцінно, але оренда дорога.',eff:{cash:-28000,capMult:0.97}},
  {label:'Купити власний генератор і акумулятори',hint:'Великі витрати зараз, зате наступні відключення не страшні.',eff:{cash:-120000,persist:{flag:'gen'}}},
  {label:'Працювати за графіком',hint:'Без витрат, але втрачаєте частину клієнтів.',eff:{capMult:0.78,rep:-0.05}}]},
{id:'tax',title:'Податкова надіслала запит щодо розбіжностей',roles:['acc','fin','law'],sev:'warn',learn:'Податковий облік і звітність',
 text:'Дані касових апаратів не збігаються з декларацією за минулий період. На відповідь дають 10 робочих днів.',
 options:[
  {label:'Звірити облік і надати пояснення вчасно',hint:'Потрібна робота бухгалтерії, мінімальні витрати.',eff:{cash:-2000}},
  {label:'Відкласти до наступного місяця',hint:'Зараз не витрачаєте час, але ризикуєте штрафом.',eff:{},chance:{p:0.7,eff:{cash:-25500},note:'Строк відповіді пропущено, нараховано штраф.'}}]},
{id:'corp_rest',types:['restaurant'],title:'Компанія замовляє банкет на 120 гостей',roles:['svc','chef','mkt'],sev:'good',learn:'Банкетне обслуговування і навантаження',
 text:'Велика полтавська компанія хоче провести корпоратив у суботу. Залу вистачає, але кухня і сервіс працюватимуть на межі.',
 options:[
  {label:'Прийняти замовлення силами команди',hint:'Добрий дохід, але персонал втомиться.',eff:{revenueAdd:72000,extraCost:30000,morale:-6}},
  {label:'Прийняти і доплатити персоналу за вихідний',hint:'Менше прибутку, зате команда задоволена.',eff:{revenueAdd:72000,extraCost:42000,morale:3,rep:0.03}},
  {label:'Відмовити',hint:'Ризиків немає, доходу теж.',eff:{}}]},
{id:'corp_hotel',types:['hotel'],title:'Туроператор просить знижку 25% для групи',roles:['svc','mkt','fin'],sev:'good',learn:'Робота з туроператорами і ціноутворення',
 text:'Туроператор хоче розмістити групу на тиждень, але просить знижку на чверть від ціни.',
 options:[
  {label:'Прийняти умови',hint:'Гарантоване завантаження, менша ціна за ніч.',eff:{revenueAdd:95000,extraCost:40000,rep:-0.02}},
  {label:'Торгуватися за знижку 15%',hint:'Більший дохід, але туроператор може піти.',eff:{revenueAdd:108000,extraCost:40000},chance:{p:0.25,eff:{revenueAdd:-108000,extraCost:-40000},note:'Туроператор пішов до конкурента.'}},
  {label:'Відмовити',hint:'Номери залишаються для гостей за повною ціною.',eff:{}}]},
{id:'corp_retail',types:['retail'],title:'Служба доставки пропонує стати точкою видачі',roles:['log','com','mkt'],sev:'good',learn:'Партнерства і трафік у рітейлі',
 text:'Сервіс онлайн-замовлень шукає точку видачі посилок у вашому районі. Це приведе відвідувачів, але навантаження на касирів зросте.',
 options:[
  {label:'Погодитись',hint:'Більше відвідувачів надовго, персонал навантажений.',eff:{morale:-4,persist:{boost:1.04}}},
  {label:'Погодитись за оплату за кожну посилку',hint:'Менший ефект, але є додатковий дохід.',eff:{revenueAdd:12000,persist:{boost:1.02}},chance:{p:0.3,eff:{revenueAdd:-12000,persist:{boost:1/1.02}},note:'Сервіс обрав іншу точку.'}},
  {label:'Відмовитись',hint:'Нічого не змінюється.',eff:{}}]},
{id:'corp_prod',types:['production'],title:'Мережа кав’ярень хоче пробну поставку',roles:['log','mkt','chef'],sev:'good',learn:'B2B-продажі і переговори',
 text:'Мережа з п’яти кав’ярень шукає нового постачальника десертів і просить пробну партію.',
 options:[
  {label:'Зробити безкоштовну пробну партію',hint:'Витрати зараз, добрий шанс на довгий контракт.',eff:{cash:-9000},chance:{p:0.65,eff:{persist:{boost:1.09}},note:'Мережа кав’ярень уклала з вами договір.'}},
  {label:'Запропонувати знижку 10% на перший місяць',hint:'Гарантований, але менший контракт.',eff:{revenueAdd:-8000,persist:{boost:1.05}}},
  {label:'Не відволікатися від поточних клієнтів',hint:'Без ризиків і без зростання.',eff:{}}]},
{id:'credit',minLevel:4,title:'Банк пропонує кредит 300 тис. грн',roles:['fin','dir'],sev:'info',learn:'Боргове фінансування і грошовий потік',
 text:'За умовою: кредит на 12 місяців під 22% річних, щомісячний платіж близько 28 тис. грн, перший платіж — наступного місяця. Гроші можна вкласти в розвиток або тримати як резерв.',
 options:[
  {label:'Взяти кредит',hint:'Більше грошей зараз, щомісячні платежі потім.',eff:{loan:300000,persist:{loan:{payment:28100,months:12,interest:3100}}}},
  {label:'Відмовитись',hint:'Без боргу, але й без резерву.',eff:{}}]},
{id:'rent',title:'Орендодавець піднімає ставку на 20%',roles:['law','dir','fin'],sev:'warn',learn:'Договірне право і переговори',
 text:'Орендодавець надіслав лист про підвищення орендної плати. У договорі є пункт про порядок зміни ставки.',
 options:[
  {label:'Погодитись',hint:'Без конфлікту, але витрати зростуть надовго.',eff:{persist:{rentFrac:0.12}}},
  {label:'Вести переговори з опорою на договір',hint:'Потрібна юридична робота з договором, підвищення буде меншим.',eff:{cash:-3000,persist:{rentFrac:0.04}}},
  {label:'Шукати нове приміщення',hint:'Дорогий переїзд, частина клієнтів загубиться.',eff:{cash:-40000,capMult:0.85,rep:-0.05,persist:{rentFrac:-0.03}}}]},
{id:'holiday',title:'Місто проводить фестиваль на вихідних',roles:['mkt','svc','chef','com'],sev:'good',learn:'Подієвий маркетинг',
 text:'У центрі Полтави пройде фестиваль, очікують тисячі гостей з області. Можна підготувати спеціальну пропозицію.',
 options:[
  {label:'Підготувати спецпропозицію і промо',hint:'Додаткові витрати, більше клієнтів цього місяця.',eff:{cash:-10000,demandMult:1.07}},
  {label:'Працювати як завжди',hint:'Без витрат і без ефекту.',eff:{}}]},
{id:'training',title:'Персонал просить навчання',roles:['hr','svc','dir'],sev:'info',learn:'Розвиток персоналу',
 text:'Працівники кажуть, що не знають нових стандартів і програм, і просять короткий тренінг.',
 options:[
  {label:'Організувати тренінг',hint:'Витрати зараз, вища мотивація і рейтинг.',eff:{cash:-12000,morale:8,rep:0.05}},
  {label:'Відкласти',hint:'Економія, але команда розчарована.',eff:{morale:-6}}]},
{id:'inventory',types:['restaurant','retail','production'],title:'Інвентаризація показала нестачу на 21 тис. грн',roles:['acc','com','log','fin'],sev:'bad',learn:'Облік запасів і внутрішній контроль',
 text:'Фактичні залишки менші за облікові. Невідомо, чи це крадіжка, псування чи помилки обліку.',
 options:[
  {label:'Розслідувати і змінити систему обліку',hint:'Витрати на процедури, втрати надалі зменшаться.',eff:{cash:-6000,persist:{costMult:0.99}}},
  {label:'Списати нестачу',hint:'Швидко, але причина залишається.',eff:{cash:-21000}},
  {label:'Утримати суму із зарплати персоналу',hint:'Юридично ризиковано і б’є по мотивації.',eff:{morale:-15},chance:{p:0.45,eff:{cash:-15000},note:'Працівник оскаржив утримання: компенсація і юридичні витрати.'}}]},
{id:'itfail',title:'Збій онлайн-оплат на вихідних',roles:['it','fin','acc'],sev:'bad',learn:'Цифрова інфраструктура і ризики',
 text:'Платіжний термінал і онлайн-оплата не працюють із п’ятниці. Частина клієнтів не має готівки.',
 options:[
  {label:'Терміново викликати підрядника',hint:'Платно, але проблема зникає за день.',eff:{cash:-7000}},
  {label:'Приймати тільки готівку до понеділка',hint:'Без витрат, але частина клієнтів піде.',eff:{demandMult:0.96,rep:-0.03}}]},
{id:'delivery',types:['restaurant','production'],title:'Сервіс доставки пропонує підключення',roles:['mkt','it','fin'],sev:'info',learn:'Канали збуту і юніт-економіка',
 text:'Агрегатор доставки бере комісію 30% із замовлення, але дає доступ до тисяч нових клієнтів.',
 options:[
  {label:'Підключитися до агрегатора',hint:'Більше замовлень, але нижча маржа.',eff:{persist:{boost:1.07,costMult:1.035}}},
  {label:'Запустити власну доставку',hint:'Витрати на старт, менше охоплення, без комісії.',eff:{cash:-25000,persist:{boost:1.03}}},
  {label:'Відмовитись',hint:'Нічого не змінюється.',eff:{}}]},
{id:'booking',types:['hotel'],title:'Платформа бронювання опустила готель у пошуку',roles:['svc','it','mkt'],sev:'bad',learn:'Онлайн-дистрибуція в готельному бізнесі',
 text:'Через повільні відповіді на запити гостей онлайн-платформа бронювання опустила готель у видачі.',
 options:[
  {label:'Налаштувати стандарти й автовідповіді',hint:'Невеликі витрати, позиції відновляться.',eff:{cash:-5000,demandMult:1.02}},
  {label:'Платити підвищену комісію за просування',hint:'Швидкий ефект, але кожен продаж дорожчий.',eff:{persist:{costMult:1.03,boost:1.05}}},
  {label:'Нічого не робити',hint:'Бронювань стане менше.',eff:{demandMult:0.9}}]},
{id:'competitor',types:['retail','restaurant'],title:'Конкурент поруч оголосив знижки 20%',roles:['com','mkt','fin'],sev:'warn',learn:'Конкурентна стратегія',
 text:'Новий конкурент за 200 метрів відкрився з агресивними знижками на базові позиції.',
 options:[
  {label:'Відповісти власною акцією',hint:'Утримаєте клієнтів, але маржа впаде цього місяця.',eff:{costMult:1.05,demandMult:1.02}},
  {label:'Запустити програму лояльності',hint:'Витрати зараз, стабільніші клієнти надовго.',eff:{cash:-12000,persist:{boost:1.02}}},
  {label:'Не реагувати',hint:'Частина клієнтів піде до конкурента.',eff:{demandMult:0.93}}]}
];
const EV=Object.fromEntries(EVENTS.map(e=>[e.id,e]));

/* ========= ДОПОМІЖНІ ========= */
function rng(seed){let a=seed>>>0;return function(){a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hashStr(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function shuffle(arr,r){const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const fmtN=n=>(Math.round(n)||0).toLocaleString('uk-UA').replace('-','−');
const fmtD=(n,d=2)=>Number(n).toLocaleString('uk-UA',{maximumFractionDigits:d}).replace('-','−');
const money=n=>(n<0?'−':'')+fmtN(Math.abs(n))+' грн';
const kU=n=>(n<0?'−':'')+fmtN(Math.abs(n)/1000)+' тис. грн';
const sK=n=>(n>0?'+':n<0?'−':'')+fmtN(Math.abs(n)/1000)+' тис.';
const r2=n=>n.toFixed(2).replace('.',',');
const pct=x=>(x*100).toFixed(1).replace('.',',').replace('-','−')+'%';
const sgn2=d=>{const v=Math.round(d*100)/100;return v===0?'0,00':(v>0?'+':'−')+r2(Math.abs(v));};
const sgn0=d=>{const v=Math.round(d);return v===0?'0':(v>0?'+':'−')+Math.abs(v);};
const lc=s=>{s=String(s);return /^[A-ZА-ЯІЇЄҐ][a-zа-яіїєґ’]/.test(s)?s[0].toLowerCase()+s.slice(1):s;};
const UNIT_F={'гостей':['гість','гості','гостей'],'ночей':['ніч','ночі','ночей'],'чеків':['чек','чеки','чеків'],'порцій':['порція','порції','порцій']};
const unitW=(u,n)=>isFinite(n)&&UNIT_F[u]?plural(n,UNIT_F[u]):u;
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const initials=n=>String(n||'?').split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
const roleProgs=(type,role)=>(TYPES[type].progs&&TYPES[type].progs[role])||ROLES[role].programs;
function roleName(type,role){return role==='audit'?'Аудитор':(TYPES[type].labels[role]||ROLES[role].label);}
function roleLabel(type,m){if(m.role==='guest')return CENTERS[m.center]?CENTERS[m.center].role+' · '+CENTERS[m.center].name:'Консультант';return roleName(type,m.role)+(m.assistant?' (асистент)':'');}
function pkgRole(m){if(m.role!=='guest')return m.role;return m.center==='audit'?'audit':({law:'law',it:'it',mkt:'mkt',hr:'hr',bank:'fin',consult:'dir'}[m.center]||'dir');}
function trainerFor(m,month){const r=pkgRole(m);return r==='audit'?'Аудит фінансової звітності':ROLES[r].trainers[month%2];}
function parseNum(s){if(s==null||s==='')return NaN;return parseFloat(String(s).replace(/[−–—]/g,'-').replace(/[\s  ]/g,'').replace(',','.'));}
const plural=(n,f)=>{n=Math.abs(Math.round(n));const a=n%10,b=n%100;return f[a===1&&b!==11?0:a>=2&&a<=4&&(b<12||b>14)?1:2];};
const balW=n=>n+' '+plural(n,['бал','бали','балів']);
const roundNice=x=>Math.abs(x)>=100?Math.round(x):Math.round(x*100)/100;

/* ========= ФОРМУВАННЯ КОМАНД ========= */
const SAMPLE_COUNTS={
 1:{GRS:16,RT:9,HT:6,TUR:5,TTP:7,PTL:6,MAR:11,IM:5,OA:13,FBS:7,MEN:12,UP:4,PRA:9,KN:8},
 2:{GRS:14,RT:8,HT:5,TUR:4,TTP:6,PTL:5,MAR:9,IM:4,OA:12,FBS:6,MEN:10,UP:3,PRA:7,KN:6},
 3:{GRS:11,RT:7,HT:4,TUR:3,TTP:5,PTL:4,MAR:8,IM:3,OA:9,FBS:5,MEN:8,UP:3,PRA:6,KN:5},
 4:{GRS:9,RT:5,HT:3,TUR:3,TTP:4,PTL:3,MAR:6,IM:3,OA:8,FBS:4,MEN:7,UP:2,PRA:5,KN:4}
};
const FIRST=['Олена','Андрій','Марія','Дмитро','Катерина','Богдан','Анастасія','Максим','Юлія','Владислав','Софія','Назар','Дарина','Ярослав','Вікторія','Олександр','Ірина','Тарас','Аліна','Роман','Христина','Денис','Валерія','Артем'];
const LASTI=['К.','Л.','М.','Ш.','Д.','П.','С.','Г.','Т.','Б.','Р.','В.','Н.','Ч.'];
const personName=i=>FIRST[(i*7+3)%FIRST.length]+' '+LASTI[(i*5+1)%LASTI.length];

function formTeams(countsIn,course){
 const counts={};PROGRAMS.forEach(p=>counts[p.id]=Math.max(0,Math.round(+countsIn[p.id]||0)));
 const pool={...counts};const total=Object.values(counts).reduce((a,b)=>a+b,0);
 const teams=[];const typeCount={restaurant:0,hotel:0,retail:0,production:0};
 const tryFill=(type,tmp)=>{const res=[];for(const r of TYPES[type].required){const p=roleProgs(type,r).find(p=>tmp[p]>0);if(!p)return null;tmp[p]--;res.push({role:r,prog:p});}return res;};
 for(let g=0;g<300;g++){
  let best=null;
  for(const t of TYPE_ORDER){const res=tryFill(t,{...pool});if(res&&(!best||typeCount[t]<typeCount[best.t]))best={t,res};}
  if(!best)break;
  best.res.forEach(m=>pool[m.prog]--);typeCount[best.t]++;
  teams.push({id:'K'+course+'-'+(teams.length+1),type:best.t,members:best.res});
 }
 let changed=true;
 while(changed&&teams.length){changed=false;
  for(const t of [...teams].sort((a,b)=>a.members.length-b.members.length)){
   if(t.members.length>=5)continue;
   for(const r of TYPES[t.type].optional){
    if(t.members.some(m=>m.role===r))continue;
    const p=roleProgs(t.type,r).find(p=>pool[p]>0);
    if(p){pool[p]--;t.members.push({role:r,prog:p});changed=true;break;}
   }
  }
 }
 const centers=[];const groups={};
 if(teams.length){
  for(const p of Object.keys(pool)){const g=CENTER_GROUP[p];if(g&&pool[p]>0){(groups[g]=groups[g]||[]).push(...Array(pool[p]).fill(p));}}
  for(const g of Object.keys(groups)){
   const arr=groups[g];if(arr.length<2)continue;
   const k=Math.ceil(arr.length/6);
   for(let i=0;i<k;i++){const part=arr.filter((_,j)=>j%k===i);centers.push({id:'C'+course+'-'+(centers.length+1),group:g,members:part.map(p=>({prog:p}))});}
   arr.forEach(p=>pool[p]--);
  }
 }
 const unplaced={};
 for(const p of Object.keys(pool)){
  while(pool[p]>0){
   const cand=teams.filter(t=>t.members.length<7).sort((a,b)=>a.members.length-b.members.length);
   let placed=false;
   for(const t of cand){const T=TYPES[t.type];const role=[...T.required,...T.optional].find(r=>roleProgs(t.type,r).includes(p));if(role){t.members.push({role,prog:p,assistant:true});placed=true;break;}}
   if(!placed&&cand.length&&CENTER_GROUP[p]){cand[0].members.push({role:'guest',prog:p,center:CENTER_GROUP[p]});placed=true;}
   if(!placed){unplaced[p]=pool[p];pool[p]=0;break;}
   pool[p]--;
  }
 }
 const tc={};
 teams.forEach(t=>{const T=TYPES[t.type];const k=tc[t.type]=(tc[t.type]||0)+1;const nm=T.names[(k-1)%T.names.length];t.name=nm+(k>T.names.length?' '+Math.ceil(k/T.names.length):'');});
 let gi=course*1000;
 teams.forEach(t=>t.members.forEach(m=>m.name=personName(gi++)));
 centers.forEach(c=>c.members.forEach(m=>m.name=personName(gi++)));
 const byGroup={};centers.forEach(c=>(byGroup[c.group]=byGroup[c.group]||[]).push(c));
 Object.values(byGroup).forEach(list=>list.forEach((c,i)=>{c.clients=teams.filter((_,j)=>j%list.length===i).map(t=>t.id);}));
 return{teams,centers,unplaced,total,counts};
}

/* ========= РОБОЧІ ПАКЕТИ ========= */
const PKG_EFFECT={
 fin:'Точність фінансового плану визначає, чи вистачить грошей на всі платежі місяця. Помилки коштують компанії незапланованих відсотків і комісій банку.',
 acc:'Помилки у звітності означають штраф. Звіт без помилок захищає компанію.',
 mkt:'Бал пакета визначає, яку частку можливого ефекту дасть маркетинговий бюджет компанії.',
 chef:'Помилки в техкарті означають перевитрату продуктів і нестабільну якість.',
 qa:'Пропущені порушення знижують рейтинг клієнтів.',
 svc:'Від точності розрахунку залежить, скільки клієнтів команда реально обслужить.',
 hr:'Помилки в зарплаті знижують мораль персоналу.',
 com:'Правильний асортимент приводить більше покупців.',
 log:'Неправильна точка замовлення означає порожні полиці й дорожчі термінові закупівлі.',
 law:'Юридичний супровід зменшує втрати компанії від штрафів, претензій і договірних спорів.',
 it:'Точний аналіз воронки приводить додаткові онлайн-замовлення.',
 dir:'Правильно визначений пріоритет підвищує злагодженість команди: мораль і рейтинг.',
 audit:'Аудит зменшує штрафи компанії-клієнта за помилки обліку.'
};
const DISHES={
 restaurant:{name:'Деруни з грибами і сметаною',sale:95,ing:[['Картопля',220,18,25],['Печериці',80,160,0],['Сметана',40,110,0],['Цибуля ріпчаста',20,22,15],['Олія соняшникова',15,75,0]]},
 hotel:{name:'Сніданок «Континентальний»',sale:220,ing:[['Апельсин',150,60,30],['Круасан',70,170,0],['Сир твердий',40,360,0],['Шинка',40,310,0],['Масло вершкове',15,380,0]]},
 production:{name:'Чизкейк, порція 120 г',sale:0,ing:[['Яйце (без шкаралупи)',15,95,12],['Сир вершковий',60,320,0],['Печиво пісочне',22,120,0],['Масло вершкове',10,380,0],['Цукор',15,38,0]]}
};
const QA_POOL=[
 {p:'Температура в холодильній камері для молочних продуктів',norm:'від +2 до +6 °C',okv:'+4 °C',badv:'+9 °C'},
 {p:'Температура в морозильній камері',norm:'не вище −18 °C',okv:'−20 °C',badv:'−12 °C'},
 {p:'Залишок терміну придатності партії при прийманні',norm:'не менше 50% терміну',okv:'70% терміну',badv:'25% терміну'},
 {p:'Маркування партії',norm:'склад, дата виготовлення, термін придатності, виробник',okv:'усі дані є',badv:'немає дати виготовлення'},
 {p:'Температура гарячих страв при видачі',norm:'не нижче +65 °C',okv:'+72 °C',badv:'+50 °C'},
 {p:'Розділення сирої і готової продукції',norm:'окремі дошки і зони',okv:'окремі дошки з кольоровим маркуванням',badv:'одна дошка для сирого м’яса і салатів'},
 {p:'Журнал санобробки обладнання',norm:'заповнюється кожну зміну',okv:'заповнено за всі зміни',badv:'пропущено 4 зміни'},
 {p:'Документ про якість від постачальника',norm:'є для кожної партії',okv:'є',badv:'відсутній'}
];
const LAW_POOL=[
 {q:'У договорі оренди: «Плата змінюється не частіше одного разу на рік за письмовим повідомленням не пізніше ніж за 60 днів». Лист про підвищення прийшов за 20 днів, попереднє підвищення було 5 місяців тому. Як діяти?',o:['Письмово відповісти, що зміна не відповідає умовам договору','Погодитись, бо орендодавець — власник приміщення','Припинити оплату оренди до кінця спору']},
 {q:'Договір поставки: «Претензії щодо якості приймаються протягом 3 робочих днів після отримання товару». Брак виявили на 6-й робочий день. Що найімовірніше?',o:['Постачальник має підстави відхилити претензію','Постачальник зобов’язаний замінити товар у будь-якому разі','Можна не платити за всю партію']},
 {q:'Працівник допустив нестачу. Керівник хоче утримати всю суму із зарплати одразу, без розслідування і згоди працівника. Що порадить юрист?',o:['Спершу службове розслідування, утримання лише в порядку і межах, визначених законом','Утримати всю суму, якщо нестача підтверджена інвентаризацією','Одразу звільнити працівника']},
 {q:'Клієнт скасував банкет за 2 дні. Договір передбачає утримання 50% передоплати при скасуванні пізніше ніж за 7 днів. Клієнт вимагає повернути все. Як відповісти?',o:['Повернути 50% передоплати відповідно до договору','Повернути 100%, щоб уникнути конфлікту','Нічого не повертати']},
 {q:'Новий постачальник просить 100% передоплату 120 тис. грн лише за рахунком, без договору. Що порадить юрист?',o:['Укласти договір з умовами поставки і відповідальністю, перевірити контрагента','Оплатити, бо так швидше','Оплатити половину готівкою без документів']},
 {q:'Блогер опублікував неправдиве твердження про антисанітарію в закладі, перевірки цього не підтверджують. Перший крок?',o:['Зафіксувати допис і надіслати вимогу про спростування','Одразу подати позов без жодних кроків','Відповісти погрозами в коментарях']}
];
const LOG_ITEM={restaurant:['Картопля','кг',30,45],hotel:['Туалетний папір','рул.',40,70],retail:['Молоко 2,5%','пак.',100,160],production:['Сир вершковий','кг',14,22]};
const ABC_GROUPS=['Молочні продукти','Хліб і випічка','Напої','Бакалія','Побутова хімія','Снеки і солодощі'];
const DIR_RISKS=['Нестача грошей','Нестача потужності: клієнти йдуть','Втома і мотивація персоналу','Репутація компанії','Зростання попиту і маркетинг'];
const daysWord=n=>n+(n>=5?' днів':' дні');

function forecastUnits(T,st,m){return Math.round(T.base*T.season[m]*st.boost*(0.62+0.1*st.rep)*1.1/10)*10;}

function buildPackage(team,role,st,m,dec,full){
 const T=TYPES[team.type],r=rng(hashStr(team.id+':pkg:'+role+':'+m));
 const ri=(a,b)=>a+Math.floor(r()*(b-a+1));
 const C=Math.round(T.unitCost[dec.quality]*st.costMult);let pIdx=dec.price;while(pIdx<2&&T.price[pIdx]-C<=0)pIdx++;
 const P=T.price[pIdx],staff=Math.round(T.staffOpts[dec.staff]*T.salary*st.salaryMult),fixed=Math.round(T.fixed+st.rentAdd),B=BUDGETS[dec.budget];
 const fc=forecastUnits(T,st,m),u=T.unit;
 let o;
 switch(role){
 case 'fin':{const mg=Math.max(1,P-C),fix=fixed+staff+B,be=Math.ceil(fix/mg);
  o={title:'Точка беззбитковості на місяць',brief:`Фінансовий план на ${MONTHS[m].toLowerCase()}. Розрахуйте, який обсяг продажів (${u}) потрібен компанії, щоб покрити всі витрати, і порівняйте його з прогнозом попиту.${pIdx!==dec.price?' За поточної ціни продаж був би дешевшим за собівартість, тому план складено для вищого рівня ціни.':''}`,
   data:[[T.priceLabel,money(P)],['Змінні витрати на одиницю',money(C)],['Оренда і комунальні',money(fixed)],['Фонд оплати праці',money(staff)],['Маркетинговий бюджет',money(B)],['Прогноз попиту',fmtN(fc)+' '+u]],
   qs:[{t:'num',label:'Маржинальний дохід з однієї одиниці, грн',ans:mg,tol:0.01},{t:'num',label:`Точка беззбитковості, ${u} (округліть угору до цілого)`,ans:be,tol:0.02},
    {t:'choice',label:'Чи вийде компанія на прибуток за прогнозом попиту?',options:['Так, прогноз перевищує точку беззбитковості більш ніж на 10%','Так, але перевищення не більше 10%','Ні, прогноз нижчий за точку беззбитковості'],ans:fc>be*1.1?0:fc>=be?1:2}],
   meta:{u,fc}};
  if(full)finFull(o,T,st,P,C,staff,fixed,B,fc,r,u);break;}
 case 'acc':{const R=Math.round(fc*P/1000)*1000,cg=Math.round(fc*C/1000)*1000,oth=ri(5,20)*1000,gross=R-cg,ebt=gross-staff-fixed-B-oth,tax=ebt>0?Math.round(ebt*0.18):0;
  o={title:'Звіт про фінансові результати',brief:`Попередні дані бухгалтерії за ${MONTHS[m].toLowerCase()}. Складіть основні рядки звіту. Прибуток до оподаткування = валовий прибуток − оплата праці − оренда і комунальні − маркетинг − інші витрати. Якщо прибутку немає, податок дорівнює нулю.`,
   data:[['Виручка',money(R)],['Собівартість реалізації',money(cg)],['Фонд оплати праці',money(staff)],['Оренда і комунальні',money(fixed)],['Маркетинг',money(B)],['Інші витрати',money(oth)],['Ставка податку на прибуток (за умовою)','18%']],
   qs:[{t:'num',label:'Валовий прибуток, грн',ans:gross,tol:0.002,tolAbs:100},{t:'num',label:'Прибуток до оподаткування, грн',ans:ebt,tol:0.002,tolAbs:100},{t:'num',label:'Податок на прибуток, грн',ans:tax,tol:0.005,tolAbs:100}],meta:{}};break;}
 case 'mkt':{const base=[800,300,120];
  const ch=[0,1,2].map(i=>{const views=Math.round(base[i]*(0.9+0.2*r()));const cl=10*T.chFit[i]*(0.97+0.06*r());const conv=Math.round(cl/views*10000)/100;return{views,conv,per:views*conv/100};});
  let best=0;ch.forEach((c,i)=>{if(c.per>ch[best].per)best=i;});const Bq=B||15000;
  o={title:'Медіаплан місяця',brief:`Результати тестових кампаній: скільки переглядів дає кожна 1 000 грн і яка частка переглядів стає клієнтами. Нові клієнти = перегляди × конверсія. Оберіть найефективніший канал і порахуйте результат для бюджету ${money(Bq)}.`,
   data:[...ch.map((c,i)=>[CHANNELS[i],`${fmtN(c.views)} переглядів · конверсія ${fmtD(c.conv,2)}%`]),['Бюджет для розрахунку',money(Bq)]],
   qs:[{t:'choice',label:'Який канал дає найбільше нових клієнтів на 1 000 грн?',options:CHANNELS.slice(),ans:best},
    {t:'num',label:'Скільки нових клієнтів дає 1 000 грн у цьому каналі?',ans:ch[best].per,tol:0.03,tolAbs:0.3},
    {t:'num',label:`Скільки нових клієнтів дасть увесь бюджет у цьому каналі?`,ans:ch[best].per*Bq/1000,tol:0.03,tolAbs:1}],meta:{}};break;}
 case 'chef':{const D=DISHES[team.type]||DISHES.restaurant;
  const ing=D.ing.map(([n,g,p,w])=>({n,g,p:Math.round(p*(0.92+0.16*r())),w}));
  const wi=Math.max(0,ing.findIndex(x=>x.w>0)),br=x=>x.g/(1-x.w/100);
  const cost=ing.reduce((a,x)=>a+br(x)/1000*x.p,0);
  const sale=team.type==='production'?P:Math.round(D.sale*(0.95+0.1*r()));
  o={title:'Технологічна карта і собівартість',brief:`Страва: ${D.name}. Маса брутто = нетто ÷ (1 − відходи). Собівартість рахується за масою брутто.`,
   data:[...ing.map(x=>[x.n,`${x.g} г нетто · ${x.p} грн/кг${x.w?` · відходи ${x.w}%`:''}`]),[team.type==='production'?'Ціна для кав’ярень':'Ціна порції в меню',money(sale)]],
   qs:[{t:'num',label:`Маса брутто: ${ing[wi].n.toLowerCase()}, г`,ans:br(ing[wi]),tol:0.02,tolAbs:0.5},{t:'num',label:'Собівартість порції, грн',ans:cost,tol:0.03,tolAbs:0.2},{t:'num',label:'Фудкост (частка собівартості в ціні), %',ans:cost/sale*100,tol:0.04,tolAbs:0.3}],meta:{}};break;}
 case 'qa':{const items=shuffle(QA_POOL,r).slice(0,5).map(x=>({...x,bad:r()<0.45}));
  if(!items.some(i=>i.bad))items[0].bad=true;if(items.every(i=>i.bad))items[1].bad=false;
  o={title:'Вхідний контроль і HACCP',brief:'Результати перевірок за тиждень. Порівняйте факт із нормою плану HACCP компанії і позначте порушення.',
   data:items.map(x=>[x.p,`норма: ${x.norm} · факт: ${x.bad?x.badv:x.okv}`]),
   qs:items.map(x=>({t:'choice',label:x.p,options:['Відповідає нормі','Порушення'],ans:x.bad?1:0})),meta:{}};break;}
 case 'svc':{
  if(team.type==='hotel'){const days=DAYS[m],nights=Math.min(fc,30*days-ri(20,60)),rev=nights*P;
   o={title:'Завантаженість і дохід на номер',brief:'Прогноз продажів номерів на місяць. Розрахуйте ключові готельні показники.',
    data:[['Номерний фонд','30 номерів'],['Днів у місяці',String(days)],['Продано номероночей (прогноз)',fmtN(nights)],['Середня ціна за ніч',money(P)]],
    qs:[{t:'num',label:'Завантаженість номерного фонду, %',ans:nights/(30*days)*100,tol:0.02,tolAbs:0.3},{t:'num',label:'Дохід на доступний номер (RevPAR), грн',ans:rev/(30*days),tol:0.02,tolAbs:2},{t:'num',label:'Скільки номерів у середньому зайнято за добу?',ans:nights/days,tol:0.03,tolAbs:0.3}],meta:{hotel:1}};
  }else{const g=Math.round(fc/30*(1.3+0.3*r())),k=ri(24,34),kk=ri(40,55);
   o={title:'Розрахунок персоналу на зміну',brief:'Прогноз гостей на найзавантаженіший день тижня і норми обслуговування. Розрахуйте потрібний персонал, округлюючи вгору до цілого.',
    data:[['Прогноз гостей на п’ятницю',fmtN(g)],['Норма на офіціанта за зміну',`до ${k} гостей`],['Норма на кухаря за зміну',`до ${kk} гостей`]],
    qs:[{t:'num',label:'Скільки офіціантів потрібно на п’ятницю?',ans:Math.ceil(g/k),tolAbs:0.4},{t:'num',label:'Скільки кухарів потрібно?',ans:Math.ceil(g/kk),tolAbs:0.4},{t:'num',label:'Скільки гостей обслужать 4 офіціанти?',ans:4*k,tolAbs:0.4}],meta:{}};}
  break;}
 case 'hr':{const N=T.staffOpts[dec.staff],sal=Math.round(T.salary*st.salaryMult/100)*100,hr=Math.round(sal/168),H=ri(12,40),fop=N*sal,ot=H*hr*2;
  o={title:'Фонд оплати праці',brief:'Нарахуйте зарплату за місяць. За умовою понаднормова робота оплачується в подвійному розмірі годинної ставки.',
   data:[['Працівників у штаті',String(N)],['Оклад',money(sal)],['Годинна ставка',money(hr)],['Понаднормові години за місяць (разом)',String(H)],['Ставка ЄСВ роботодавця (за умовою)','22%']],
   qs:[{t:'num',label:'Фонд окладів, грн',ans:fop,tol:0.002,tolAbs:10},{t:'num',label:'Доплата за понаднормові, грн',ans:ot,tol:0.01,tolAbs:5},{t:'num',label:'ЄСВ з усього фонду оплати (оклади + понаднормові), грн',ans:0.22*(fop+ot),tol:0.01,tolAbs:10}],meta:{}};break;}
 case 'com':{const sh=[36,26,16,10,7,5].map(s=>s*(0.9+0.2*r())),ssum=sh.reduce((a,b)=>a+b,0),total=fc*P;
  const groups=shuffle(ABC_GROUPS,r).map((n,i)=>({n,v:Math.round(total*sh[i]/ssum/1000)}));
  const sum=groups.reduce((a,g)=>a+g.v,0);let cum=0;[...groups].sort((a,b)=>b.v-a.v).forEach(g=>{cum+=g.v;g.cls=cum/sum<=0.8?0:cum/sum<=0.95?1:2;});
  const disp=shuffle(groups,r);
  o={title:'ABC-аналіз асортименту',brief:'Виручка за товарними групами. Відсортуйте групи від найбільшої і рахуйте накопичену частку виручки. Група належить до A, якщо накопичена частка разом із нею не перевищує 80%; до B — якщо не перевищує 95%; решта — C.',
   data:disp.map(g=>[g.n,fmtN(g.v)+' тис. грн']),qs:disp.map(g=>({t:'choice',label:g.n,options:['A','B','C'],ans:g.cls})),meta:{}};break;}
 case 'log':{const it=LOG_ITEM[team.type]||LOG_ITEM.retail,U=ri(it[2],it[3]),L=ri(2,5),SS=U*ri(1,2),rop=U*L+SS;
  let X=Math.round(rop*(r()<0.5?0.7+0.2*r():1.1+0.2*r()));if(X===rop)X++;
  o={title:'Точка замовлення і запаси',brief:'Точка замовлення = витрата за день × термін поставки + страховий запас. Замовлення оформлюють, коли залишок не перевищує точку замовлення. Визначте, коли й скільки замовляти.',
   data:[['Товар',it[0]],['Середня витрата за день',`${U} ${it[1]}`],['Термін поставки',daysWord(L)],['Страховий запас',`${SS} ${it[1]}`],['Залишок на складі сьогодні',`${X} ${it[1]}`]],
   qs:[{t:'num',label:`Точка замовлення, ${it[1]}`,ans:rop,tolAbs:0.4},{t:'num',label:`Обсяг замовлення на 14 днів, ${it[1]}`,ans:U*14,tolAbs:0.4},{t:'choice',label:'Що робити сьогодні?',options:['Оформити замовлення','Ще не потрібно'],ans:X<=rop?0:1}],meta:{unit:it[1]}};break;}
 case 'law':{const base=shuffle(LAW_POOL,rng(hashStr(team.id+':lawpool'))),pick=[0,1,2].map(i=>base[(m*3+i)%base.length]);
  o={title:'Правовий супровід',brief:'Три ситуації цього тижня. Оберіть дію, яку порадить юрист компанії.',data:[],
   qs:pick.map(x=>{const idx=shuffle([0,1,2],r);return{t:'choice',label:x.q,options:idx.map(i=>x.o[i]),ans:idx.indexOf(0)};}),meta:{}};break;}
 case 'it':{const V=ri(2500,6000);let p1=ri(40,65),p2=ri(15,32),p3=ri(45,75),w=0;
  for(let g=0;g<30;g++){const x=[p1/50,p2/25,p3/60],srt=x.slice().sort((a,b)=>a-b);w=x.indexOf(srt[0]);if(srt[1]-srt[0]>=0.04)break;if(w===0)p1--;else if(w===1)p2--;else p3--;}
  const orders=Math.round(V*p1*p2*p3/1e6);
  o={title:'Воронка онлайн-замовлень',brief:'Дані веб-аналітики за тиждень. Порахуйте замовлення і знайдіть найслабший крок воронки: той, де фактичний показник найбільше відстає від орієнтира (факт ÷ орієнтир найменший).',
   data:[['Відвідувань сайту',fmtN(V)],['Переглянули меню чи каталог',p1+'%'],['Із них додали в кошик',p2+'%'],['Із них оплатили',p3+'%'],['Орієнтири (за умовою)','перегляд 50%, кошик 25%, оплата 60%']],
   qs:[{t:'num',label:'Скільки оплачених замовлень?',ans:orders,tol:0.02,tolAbs:1},{t:'num',label:'Конверсія сайту (оплачені замовлення ÷ відвідування), %',ans:orders/V*100,tol:0.04,tolAbs:0.05},{t:'choice',label:'Який крок воронки найслабший відносно орієнтира?',options:['Перегляд меню чи каталогу','Додавання в кошик','Оплата'],ans:w}],meta:{}};break;}
 case 'dir':{const last=st.history[st.history.length-1];
  const rev=last?last.revenue:Math.round(fc*P/1000)*1000,prof=last?last.profit:Math.round(rev*0.06/1000)*1000,load=last?last.load:fc/T.capacity[dec.staff];
  const loadPct=Math.round(load*100),ans=st.cash<0.3*T.startCash?0:loadPct>103?1:Math.round(st.morale)<55?2:Math.round(st.rep*100)/100<3.6?3:4;
  o={title:'Пріоритети місяця і звіт для власника',brief:'Оцініть стан компанії і визначте головний пріоритет для команди за правилом нижче: умови перевіряються зліва направо, пріоритетом стає перша, що виконується.',
   data:[[last?'Виручка минулого місяця':'Виручка (план)',money(rev)],[last?'Прибуток минулого місяця':'Прибуток (план)',money(prof)],['Гроші на рахунку',money(st.cash)],['Стартовий капітал',money(T.startCash)],['Завантаження потужності',loadPct+'%'],['Мораль персоналу',Math.round(st.morale)+'%'],['Рейтинг клієнтів',r2(st.rep)],['Правило пріоритету','гроші < 30% стартових → потужність > 103% → мораль < 55% → рейтинг < 3,6 → інакше зростання']],
   qs:[{t:'num',label:'Рентабельність продажів (прибуток ÷ виручка), %',ans:rev?prof/rev*100:0,tolAbs:0.3},{t:'choice',label:'Головний пріоритет на місяць',options:DIR_RISKS.slice(),ans}],meta:{}};break;}
 case 'audit':{const R=Math.round(fc*P/1000)*1000,cg=Math.round(fc*C/1000)*1000,op=staff+fixed+B+ri(5,20)*1000;
  const wrong=ri(0,2),delta=ri(2,6)*10000*(r()<0.5?-1:1);
  const g2=R-cg+(wrong===0?delta:0),e2=g2-op+(wrong===1?delta:0),t2=(e2>0?Math.round(e2*0.18):0)+(wrong===2?delta:0);
  const right=[R-cg,g2-op,e2>0?Math.round(e2*0.18):0][wrong];
  o={title:'Аудит звіту клієнта',brief:'Компанія-клієнт подала звіт. Один рядок пораховано з помилкою, решта узгоджені з рядками над ними. За умовою податок на прибуток — 18%, без прибутку податок дорівнює нулю.',
   data:[['Виручка',money(R)],['Собівартість',money(cg)],['Валовий прибуток',money(g2)],['Операційні витрати',money(op)],['Прибуток до оподаткування',money(e2)],['Податок на прибуток',money(t2)]],
   qs:[{t:'choice',label:'У якому рядку помилка?',options:['Валовий прибуток','Прибуток до оподаткування','Податок на прибуток'],ans:wrong},{t:'num',label:'Правильне значення цього рядка, грн',ans:right,tol:0.002,tolAbs:100}],meta:{}};break;}
 }
 const base={role,title:o.title,brief:o.brief,data:o.data,qs:o.qs,meta:o.meta,answers:{},submitted:false,score:null,auto:false};
 if(o.cf)Object.assign(base,{full:true,cf:o.cf,banks:o.banks,qs4:o.qs4,colleagues:o.colleagues,cfAns:{},memo:'',req:{},rec:{level:null,text:''},ans4:{},part:0,done:{},parts:null});
 return base;
}
const FIN_PARTS=[['Розрахунки','1,5–2 год','автоперевірка'],['Бюджет руху грошей','2–3 год','таблиця (авто) + записка кураторові'],['Робота з колегами','1–2 год','запити (авто) + рекомендація кураторові'],['Аналіз ринку','1 год','автоперевірка']];
function finFull(o,T,st,P,C,staff,fixed,B,fc,r,u){
 const ri=(a,b)=>a+Math.floor(r()*(b-a+1));
 const rev=fc*P,cogs=fc*C,shares=[0.22,0.24,0.26,0.28],cogsW=Math.round(cogs/4),salHalf=Math.round(staff/2);
 let bal=st.cash;
 const rows=shares.map((sh,i)=>{const inflow=Math.round(rev*sh);const out=cogsW+(i===0?fixed+B:0)+(i===1||i===3?salHalf:0);bal=bal+inflow-out;return{inflow,out,bal};});
 const minI=rows.reduce((a,x,i)=>x.bal<rows[a].bal?i:a,0);
 const scen=Math.round(fc*0.85*(P-C)-fixed-staff-B);
 o.title='Фінансовий план місяця';
 o.brief=`Повний тижневий пакет фінансової ролі на ${MONTHS[st.month].toLowerCase()}: чотири частини, разом 6–8 годин. Розрахунки й таблицю перевіряє система, записку та обґрунтування рекомендації оцінює куратор практики.`;
 o.data.push(['Гроші на початок місяця',money(st.cash)],['Виручка місяця','прогноз попиту × ціна'],['Надходження по тижнях','22% · 24% · 26% · 28% виручки'],['Оплата постачальникам','щотижня по чверті собівартості (прогноз попиту × змінні витрати)'],['Оренда і маркетинг','оплата на 1-му тижні'],['Зарплата','половинами на 2-му і 4-му тижні']);
 o.qs.push({t:'num',label:'Найнижчий залишок грошей на кінець тижня протягом місяця, грн',ans:rows[minI].bal,tol:0.01,tolAbs:400},
  {t:'choice',label:'На якому тижні залишок найнижчий?',options:['1-й','2-й','3-й','4-й'],ans:minI},
  {t:'choice',label:'Чи потрібен компанії овердрафт цього місяця?',options:['Ні, залишок завжди додатний','Так, залишок іде в мінус'],ans:rows[minI].bal<0?1:0},
  {t:'num',label:'Прибуток до оподаткування (зі знаком «−», якщо збиток), якщо попит буде на 15% нижчим за прогноз, грн',ans:scen,tol:0.01,tolAbs:300});
 o.cf={rows,start:st.cash,cogsW,rent:fixed,mkt:B,salHalf,minI};
 const banks=[{n:'Банк А',rate:ri(22,26),fee:0.5,limit:200000},{n:'Банк Б',rate:ri(18,22),fee:0.8,limit:150000},{n:'Банк В',rate:ri(30,38),fee:0,limit:120000}];
 const need=100000,days=30;
 banks.forEach(b=>b.cost=need*b.rate/100*days/365+b.fee/100*b.limit);
 const best=banks.reduce((a,b,i)=>b.cost<banks[a].cost?i:a,0);
 o.banks={list:banks,need,days,best};
 o.qs4=[{t:'choice',label:'Який банк найдешевший для цього випадку?',options:banks.map(b=>b.n),ans:best},{t:'num',label:'Повна вартість овердрафту в найдешевшому банку за 30 днів, грн',ans:banks[best].cost,tol:0.01,tolAbs:20}];
 o.colleagues={cost:`Собівартість однієї одиниці продажу на ${MONTHS[st.month].toLowerCase()} — ${money(C)}. Ціни на сировину нестабільні, тому закладайте невеликий запас.`,log:`Постачальники працюють з відстрочкою 7 днів, передоплата не потрібна. Оплати йдуть рівними частинами щотижня, нових великих закупівель цього місяця не плануємо.`};
}
function cfCells(p){const out=[];p.cf.rows.forEach((r,i)=>{out.push({key:i+'-in',q:{t:'num',ans:r.inflow,tol:0.01,tolAbs:150}},{key:i+'-out',q:{t:'num',ans:r.out,tol:0.01,tolAbs:150}},{key:i+'-bal',q:{t:'num',ans:r.bal,tol:0.01,tolAbs:400}});});return out;}
function scoreFull(p){
 /* автоматично оцінюються лише розрахунки, таблиця, запити, вибір рівня ціни й аналіз банків (разом 80 балів → шкала 0–100).
    Записку й обґрунтування рекомендації оцінює куратор: за довжину тексту балів немає. */
 const s1=p.qs.reduce((a,q,i)=>a+gradeQ(q,p.answers[i]),0)/p.qs.length*40;
 const cells=cfCells(p),s2=cells.reduce((a,c)=>a+gradeQ(c.q,p.cfAns[c.key]),0)/cells.length*15;
 const s3=(p.req.cost&&p.req.log?5:0)+(p.rec.level!=null?5:0);
 const s4=p.qs4.reduce((a,q,i)=>a+gradeQ(q,p.ans4[i]),0)/p.qs4.length*15;
 return{parts:[Math.round(s1),Math.round(s2),s3,Math.round(s4)],max:[40,15,10,15],total:Math.round((s1+s2+s3+s4)/80*100)};
}
function gradeQ(q,a){
 if(q.t==='choice')return a===q.ans?1:0;
 const x=parseNum(a);if(!isFinite(x))return 0;
 const tol=Math.max((q.tol||0)*Math.abs(q.ans),q.tolAbs!=null?q.tolAbs:0.5),d=Math.abs(x-q.ans);
 return d<=tol?1:d<=tol*3?0.5:0;
}
function scorePkg(p){if(p.full)return scoreFull(p).total;return Math.round(p.qs.reduce((a,q,i)=>a+gradeQ(q,p.answers[i]),0)/p.qs.length*100);}
function autoFill(p,seed){
 const r=rng(seed),skill=0.55+0.4*r();
 p.qs.forEach((q,i)=>{
  if(r()<skill)p.answers[i]=q.t==='num'?String(roundNice(q.ans)):q.ans;
  else if(q.t==='num')p.answers[i]=String(roundNice(q.ans*(1+(r()<0.5?-1:1)*(0.12+0.25*r()))+(q.ans===0?1000:0)));
  else p.answers[i]=(q.ans+1+Math.floor(r()*(q.options.length-1)))%q.options.length;
 });
 p.submitted=true;p.auto=true;p.score=scorePkg(p);
}
function genPackages(team,st,m,dec){
 const pk={};
 team.members.forEach((mem,i)=>{const role=pkgRole(mem);const p=buildPackage(team,role,st,m,dec,mem.user&&role==='fin');if(!mem.user)autoFill(p,hashStr(team.id+':auto:'+i+':'+m));pk[i]=p;});
 return pk;
}
function pkgInsight(p){
 const a=p.answers||{},v=i=>p.qs[i].t==='num'?parseNum(a[i]):a[i],n=x=>isFinite(x)?fmtN(x):'—';
 switch(p.role){
  case 'fin':return `точка беззбитковості — ${n(v(1))} ${unitW(p.meta.u,v(1))}, прогноз попиту — ${fmtN(p.meta.fc)}`;
  case 'mkt':return `найефективніший канал — ${CHANNELS[v(0)]?lc(CHANNELS[v(0)]):'не визначено'}; нових клієнтів на 1 000 грн: ${isFinite(v(1))?fmtD(v(1),1):'—'}`;
  case 'chef':return `фудкост страви ${isFinite(v(2))?fmtD(v(2),1):'—'}%`;
  case 'svc':return p.meta.hotel?`завантаженість ${isFinite(v(0))?fmtD(v(0),1):'—'}%`:`на п’ятницю потрібно: офіціантів — ${n(v(0))}, кухарів — ${n(v(1))}`;
  case 'hr':return `фонд окладів ${isFinite(v(0))?money(v(0)):'—'}`;
  case 'com':return `група A: ${p.qs.map((q,i)=>v(i)===0?q.label.toLowerCase():null).filter(Boolean).join(', ')||'не визначено'}`;
  case 'qa':return `порушень знайдено: ${p.qs.filter((q,i)=>v(i)===1).length} з ${p.qs.length} перевірок`;
  case 'log':return `точка замовлення ${n(v(0))} ${p.meta.unit}`;
  case 'dir':return `головний пріоритет — ${(DIR_RISKS[v(1)]||'не визначено').toLowerCase()}`;
  default:return '';
 }
}

/* ========= СИМУЛЯЦІЯ ========= */
/* ========= БОРГ, КРЕДИТ І НЕПЛАТОСПРОМОЖНІСТЬ (усі ставки, строки й ліміти — за умовою практики) ========= */
const FIN={odLimitShare:0.4,odRate:0.03,loanRate:0.02,loanTerm:6,loanLimitShare:0.6,loanBonus:0.2,sanWeeks:2,sanPenalty:10,sanBudgetMax:1,recoverShare:0.5};
const p0=x=>String(Math.round(x*1000)/10).replace('.',',')+'%';
const odLimit=T=>Math.round(T.startCash*FIN.odLimitShare/1000)*1000;
function normState(st){if(st.od==null)st.od=0;if(!st.insolv)st.insolv={stage:0,weeks:0};if(st.cash<0){st.od+=-st.cash;st.cash=0;}return st;}
const stageOf=st=>(st.insolv&&st.insolv.stage)||0;
const loanBal=l=>!(l.left>0)?0:l.bal!=null?l.bal:Math.max(0,(l.payment-l.interest)*l.left);
const debtOf=st=>st.loans.reduce((a,l)=>a+loanBal(l),0);
const newLoan=(amt,m)=>({bal:amt,amount:amt,left:FIN.loanTerm,term:FIN.loanTerm,rate:FIN.loanRate,inst:Math.round(amt/FIN.loanTerm),from:m});
/* наступний плановий платіж за всіма кредитами: [тіло, відсотки] */
function nextPay(st){let pr=0,it=0;st.loans.forEach(l=>{if(!(l.left>0))return;if(l.bal==null){pr+=l.payment-l.interest;it+=l.interest;}else{pr+=l.left===1?l.bal:Math.min(l.bal,l.inst);it+=Math.round(l.bal*l.rate);}});return[pr,it];}
/* кредитний ліміт залежить від масштабу компанії та її результатів */
function creditLimit(st,T){
 if(stageOf(st)>0)return 0;
 let k=FIN.loanLimitShare;const h=st.history.slice(-3);
 if(h.length&&h.reduce((a,x)=>a+x.profit,0)>0)k+=FIN.loanBonus;
 if(st.rep<3)k-=0.2;
 if((st.od||0)>odLimit(T)*0.5)k-=0.2;
 return Math.max(0,Math.floor((T.startCash*k-debtOf(st))/10000)*10000);
}
function loanSchedule(amt){const rows=[];let bal=amt;const inst=Math.round(amt/FIN.loanTerm);for(let i=1;i<=FIN.loanTerm;i++){const it=Math.round(bal*FIN.loanRate),pr=i===FIN.loanTerm?bal:Math.min(bal,inst);bal-=pr;rows.push({i,pr,it,pay:pr+it,bal});}return rows;}
/* показники ліквідності для попереджень */
function liqInfo(st,T,dec){
 normState(st);const ODL=odLimit(T),stage=stageOf(st),debt=debtOf(st),np=nextPay(st);
 const oblig=Math.round(T.fixed+st.rentAdd+T.staffOpts[dec&&dec.staff!=null?dec.staff:1]*T.salary*st.salaryMult+np[0]+np[1]);
 const free=st.cash+Math.max(0,ODL-st.od),cover=oblig>0?free/oblig:9;
 const last=st.history[st.history.length-1],burn=last?last.profit-np[0]:0,proj=st.cash-st.od+Math.min(burn,0);
 let risk='ok';
 if(stage===2)risk='bk';else if(stage===1)risk='san';else if(last&&proj< -ODL)risk='next';else if(st.od>0)risk='od';else if(last&&(proj<0||cover<1))risk='low';
 return{ODL,stage,debt,np,oblig,free,cover,proj,risk,od:st.od,weeks:st.insolv.weeks||0};
}
function newState(type){const T=TYPES[type];return{month:0,cash:T.startCash,rep:3.8,morale:70,boost:1,costMult:1,salaryMult:1,rentAdd:0,flags:{},loans:[],invested:[],used:[],history:[],cumProfit:0,cumRevenue:0,od:0,insolv:{stage:0,weeks:0}};}
function defaultDec(){return{price:1,quality:1,staff:1,budget:1,channel:0,invest:0,loan:0,repay:false};}
function resolveDec(level,dec){const d=defaultDec();for(const k of DEC_ORDER){if(DECISIONS[k].minLevel<=level&&dec[k]!=null)d[k]=dec[k];}return d;}
function applyEff(acc,st,eff,T){
 if(!eff)return;
 acc.cash+=eff.cash||0;acc.rep+=eff.rep||0;acc.morale+=eff.morale||0;
 acc.demandMult*=eff.demandMult||1;acc.capMult*=eff.capMult||1;acc.costMult*=eff.costMult||1;
 acc.revenueAdd+=eff.revenueAdd||0;acc.extraCost+=eff.extraCost||0;acc.cashIn+=eff.loan||0;
 const p=eff.persist;if(!p)return;
 if(p.boost)st.boost*=p.boost;if(p.costMult)st.costMult*=p.costMult;if(p.salaryMult)st.salaryMult*=p.salaryMult;
 if(p.rentFrac)st.rentAdd+=Math.round(T.fixed*p.rentFrac);if(p.flag)st.flags[p.flag]=true;
 if(p.loan)st.loans.push({payment:p.loan.payment,left:p.loan.months,interest:p.loan.interest});
}
// вплив робочих пакетів ролей на модель компанії; rs — бали ролей від 0 до 1
function roleEffects(acc,rs){
 const c=[],has=k=>rs[k]!=null;
 if(has('mkt')){acc.mktFactor=0.4+0.6*rs.mkt;c.push({role:'mkt',s:rs.mkt,text:acc.budget===0?'Маркетингового бюджету цього місяця не було, тож медіаплан не вплинув на попит.':`Реклама дала ${Math.round(acc.mktFactor*100)}% можливого ефекту.`});}
 if(has('chef')){const over=(1-rs.chef)*0.08;acc.costMult*=1+over;acc.rep+=(rs.chef-0.7)*0.06;c.push({role:'chef',s:rs.chef,text:over>0.005?`Перевитрата продуктів: собівартість +${pct(over)}.`:'Собівартість за техкартами під контролем.'});}
 if(has('qa')){const dr=(rs.qa-0.7)*0.1;acc.rep+=dr;c.push({role:'qa',s:rs.qa,text:dr>=0?'Контроль якості підтримав рейтинг клієнтів.':'Пропущені порушення знизили рейтинг клієнтів.'});}
 if(has('svc')){const f=0.92+0.08*rs.svc;acc.capMult*=f;acc.rep+=(rs.svc-0.7)*0.05;c.push({role:'svc',s:rs.svc,text:f<0.995?`Неточний розрахунок персоналу: потужність −${pct(1-f)}.`:'Персонал розставлено точно.'});}
 if(has('hr')){const dm=(rs.hr-0.6)*12,rd=Math.round(dm);acc.morale+=dm;c.push({role:'hr',s:rs.hr,text:rd===0?'Точність зарплат: мораль без змін.':`Точність зарплат: мораль ${rd>0?'+':'−'}${Math.abs(rd)}.`});}
 if(has('fin')){const x=Math.round((1-rs.fin)*14000);acc.extraCost+=x;c.push({role:'fin',s:rs.fin,text:x>500?`Неточний фінансовий план: незаплановані відсотки й комісії банку ${money(x)}.`:'Грошовий потік сплановано без розривів.'});}
 if(has('acc')){let x=rs.acc>=0.9?0:Math.round((1-rs.acc)*22000);if(has('audit'))x=Math.round(x*(1-0.5*rs.audit));acc.extraCost+=x;c.push({role:'acc',s:rs.acc,text:x>0?`Штраф за помилки у звітності ${money(x)}.`:'Звітність без штрафів.'});}
 if(has('audit'))c.push({role:'audit',s:rs.audit,text:has('acc')?`Аудит зменшив штрафи за помилки обліку на ${pct(0.5*rs.audit)}.`:'У команді немає бухгалтерської ролі, тож аудит цього місяця не вплинув на штрафи.'});
 if(has('com')){const f=0.97+0.05*rs.com;acc.demandMult*=f;c.push({role:'com',s:rs.com,text:Math.abs(f-1)<0.0005?'Асортимент не змінив попит.':`Асортимент: попит ${f>=1?'+':'−'}${pct(Math.abs(f-1))}.`});}
 if(has('log')){const f=0.95+0.05*rs.log;acc.capMult*=f;acc.costMult*=1+(1-rs.log)*0.03;c.push({role:'log',s:rs.log,text:f<0.995?`Перебої з поставками: потужність −${pct(1-f)}.`:'Поставки без перебоїв.'});}
 if(has('it')){const f=1+0.03*rs.it;acc.demandMult*=f;c.push({role:'it',s:rs.it,text:f-1<0.0005?'Онлайн-воронка не додала замовлень.':`Онлайн-замовлення: попит +${pct(f-1)}.`});}
 if(has('dir')){const dm=(rs.dir-0.5)*6;acc.morale+=dm;acc.rep+=(rs.dir-0.5)*0.04;c.push({role:'dir',s:rs.dir,text:dm>0.5?'Чіткі пріоритети підвищили злагодженість команди.':dm<-0.5?'Нечіткі пріоритети знизили злагодженість команди.':'Пріоритети визначено лише частково: злагодженість команди без змін.'});}
 return c;
}
function effectPreview(role,s){
 if(role==='law')return `Зменшить втрати від штрафів, претензій і договірних спорів на ${pct(0.4*s)}.`;
 const c=roleEffects({rep:0,morale:0,demandMult:1,capMult:1,costMult:1,extraCost:0},{[role]:s});
 if(role==='audit')return `Зменшить штрафи компанії-клієнта за помилки обліку на ${pct(0.5*s)}.`;
 return(c.find(x=>x.role===role)||{text:''}).text;
}
function pickEvents(teamId,type,st,level){
 const n=LEVELS[level].events;
 /* подію «credit» більше не видаємо: кредит став постійним рішенням фінансової ролі */
 const elig=EVENTS.filter(e=>e.id!=='credit'&&(!e.types||e.types.includes(type))&&(e.minLevel||1)<=level&&!(e.requiresNot&&st.flags[e.requiresNot]));
 const sh=shuffle(elig,rng(hashStr(teamId+':ev:'+st.month)));
 const pick=[...sh.filter(e=>!st.used.includes(e.id)),...sh.filter(e=>st.used.includes(e.id)).sort((a,b)=>st.used.indexOf(a.id)-st.used.indexOf(b.id))].slice(0,n);
 pick.forEach(e=>{const i=st.used.indexOf(e.id);if(i>=0)st.used.splice(i,1);st.used.push(e.id);});
 return pick.map(e=>e.id);
}
function simulateMonth(st,type,d0,evs,seedKey,rs){
 rs=rs||{};normState(st);
 const T=TYPES[type],m=st.month,r=rng(hashStr(seedKey+':m:'+m)),ODL=odLimit(T),ins=st.insolv,stage0=ins.stage;
 const d={...d0};
 /* санація: без інвестицій, маркетинг не вище обмеження, без нових кредитів */
 if(stage0===1){d.invest=0;if(d.budget>FIN.sanBudgetMax)d.budget=FIN.sanBudgetMax;d.loan=0;}
 const acc={cash:0,rep:0,morale:0,demandMult:1,capMult:1,costMult:1,revenueAdd:0,extraCost:0,cashIn:0,mktFactor:1,budget:BUDGETS[d.budget]};
 const loansBefore=st.loans.length,debtBefore=debtOf(st);let legal=0;
 const notes=[];
 let loanIn=0;
 if(d.loan>0){const amt=Math.min(Math.round(d.loan),creditLimit(st,T));if(amt>0){st.loans.push(newLoan(amt,m));loanIn=amt;notes.push(`Отримано банківський кредит ${money(amt)}: ${FIN.loanTerm} щомісячних платежів, перший — у наступному місяці компанії.`);}}
 let investCost=0;const inv=INVESTS[d.invest]||INVESTS[0];
 if(inv.id!=='none'&&!st.invested.includes(inv.id)&&!(inv.id==='gen'&&st.flags.gen)){
  investCost=inv.cost;st.invested.push(inv.id);
  if(inv.id==='online')st.boost*=1.05;if(inv.id==='gen')st.flags.gen=true;if(inv.id==='training'){acc.rep+=0.15;acc.morale+=8;}
  notes.push('Інвестиція: '+inv.label.toLowerCase()+'.');
 }
 for(const {ev,opt} of evs){
  const o=ev.options[opt==null?ev.options.length-1:opt];applyEff(acc,st,o.eff,T);
  if(ev.roles.includes('law')&&o.eff&&o.eff.cash<0)legal-=o.eff.cash;
  if(o.chance&&r()<o.chance.p){applyEff(acc,st,o.chance.eff,T);notes.push(o.chance.note);if(o.chance.eff.cash<0)legal-=o.chance.eff.cash;}
 }
 loanIn+=acc.cashIn; /* кредит зі старої події «credit» у збережених проходженнях */
 const contrib=[];
 if(rs.law!=null){const saved=Math.round(legal*0.4*rs.law);acc.cash+=saved;contrib.push({role:'law',s:rs.law,text:saved>0?`Юридичний супровід зменшив втрати від штрафів, претензій і договірних спорів на ${money(saved)}.`:legal>0?'Штрафи, претензії й договірні витрати сплачено повністю: юридичний пакет їх не зменшив.':'Цього місяця штрафів, претензій і договірних витрат не було.'});}
 contrib.push(...roleEffects(acc,rs));
 const budget=BUDGETS[d.budget];
 const priceMult=([1.14,1.0,0.74][d.price]+(d.price===2?0.07*(st.rep-3.5):0))*(d.quality<d.price?1-0.15*(d.price-d.quality):1);
 const qualMult=[0.95,1.0,1.04][d.quality];
 const mktEff=1+0.22*(1-Math.exp(-budget/22000))*T.chFit[d.channel]*acc.mktFactor;
 const repMult=0.62+0.1*st.rep,noise=0.94+r()*0.12;
 const demand=T.base*T.season[m]*priceMult*qualMult*mktEff*repMult*st.boost*acc.demandMult*noise;
 const cap=T.capacity[d.staff]*(st.morale<50?0.92:1)*acc.capMult;
 const units=Math.round(Math.min(demand,cap)),lost=Math.max(0,Math.round(demand-cap));
 const revenue=Math.round(units*T.price[d.price]+acc.revenueAdd);
 const cogs=Math.round(units*T.unitCost[d.quality]*st.costMult*acc.costMult);
 const staffCost=Math.round(T.staffOpts[d.staff]*T.salary*st.salaryMult);
 const fixed=Math.round(T.fixed+st.rentAdd);
 /* планові платежі за кредитами, виданими раніше; новий кредит починає гаситися з наступного місяця */
 let loanInt=0,principal=0;
 st.loans.forEach((l,i)=>{if(i>=loansBefore||!(l.left>0))return;
  if(l.bal==null){loanInt+=l.interest;principal+=l.payment-l.interest;l.left--;}
  else{const it=Math.round(l.bal*l.rate),pr=l.left===1?l.bal:Math.min(l.bal,l.inst);loanInt+=it;principal+=pr;l.bal-=pr;l.left--;if(l.bal<=0){l.bal=0;l.left=0;}}});
 const odBefore=st.od,odInt=Math.round(odBefore*FIN.odRate),interest=loanInt+odInt;
 const other=Math.round(acc.extraCost+Math.max(0,-acc.cash)+investCost);
 const ebt=revenue-cogs-staffCost-fixed-budget-other-interest;
 const tax=ebt>0?Math.round(ebt*0.18):0,profit=ebt-tax,cashBefore=st.cash;
 let cash=Math.round(st.cash+profit-principal+loanIn+Math.max(0,acc.cash)),od=odBefore,repaid=0;
 /* касовий розрив покриває овердрафт; вільні гроші спершу гасять овердрафт */
 if(cash<0){od+=-cash;cash=0;}else if(od>0){const pay=Math.min(cash,od);od-=pay;cash-=pay;}
 if(d.repay&&od===0){let free=cash-(fixed+staffCost);st.loans.forEach(l=>{if(l.left>0&&l.bal!=null&&free>0){const pay=Math.min(l.bal,free);l.bal-=pay;free-=pay;cash-=pay;repaid+=pay;if(l.bal<=0){l.bal=0;l.left=0;}else l.inst=Math.ceil(l.bal/l.left);}});if(repaid>0)notes.push(`Достроково погашено ${money(repaid)} кредиту.`);}
 st.cash=cash;st.od=od;
 if(od>odBefore)notes.push(`Грошей на всі платежі не вистачило: ${money(od-odBefore)} покрито овердрафтом (за умовою — ${p0(FIN.odRate)} за місяць компанії, ліміт ${kU(ODL)}).`);
 else if(odBefore>0&&od<odBefore)notes.push(od===0?'Овердрафт повністю погашено.':`Овердрафт зменшено на ${money(odBefore-od)}.`);
 const over=od>ODL;
 if(stage0===0){if(over){ins.stage=1;ins.weeks=0;ins.since=m;st.sanPenalty=true;notes.push(`Борг за овердрафтом ${kU(od)} перевищив ліміт ${kU(ODL)}: компанія переходить під зовнішнє управління (санацію). На наступний тиждень потрібен план оздоровлення; інвестиції й нові кредити заборонено, маркетинг обмежено.`);}}
 else if(stage0===1){
  if(od<=ODL*FIN.recoverShare){ins.stage=0;ins.weeks=0;ins.recovered=m;notes.push(`Санацію завершено: борг за овердрафтом не перевищує ${kU(ODL*FIN.recoverShare)}. Обмеження знято, штраф до результату команди залишається.`);}
  else{ins.weeks++;const drop=odBefore-od;
   /* ліквідація: минуло щонайменше sanWeeks тижнів санації, борг вищий за ліміт і за останній тиждень не зменшився */
   if(ins.weeks>=FIN.sanWeeks&&over&&drop<=0){ins.stage=2;ins.liquidated=m;notes.push(`Після ${ins.weeks} ${plural(ins.weeks,['тижня','тижнів','тижнів'])} санації борг за овердрафтом ${kU(od)} усе ще вищий за ліміт ${kU(ODL)} і за останній тиждень не зменшився: компанію ліквідовано. Операційна діяльність припиняється.`);}
   else notes.push(over?`Санація триває: борг за овердрафтом ${kU(od)} вищий за ліміт ${kU(ODL)}. ${ins.weeks+1>=FIN.sanWeeks?'Якщо наступного тижня він залишиться вищим за ліміт і не зменшиться, компанію буде ліквідовано.':'Скорочуйте борг: після другого тижня санації відсутність прогресу означає ліквідацію.'}`:`Санація триває: борг за овердрафтом ${kU(od)} уже в межах ліміту. Для виходу із санації його треба зменшити до ${kU(ODL*FIN.recoverShare)}.`);}}
 const repBefore=st.rep,morBefore=st.morale,load=demand/cap;
 let dRep=0.1*(d.quality-d.price)+acc.rep;
 if(load>1.06)dRep-=Math.min(0.25,0.35*(load-1));
 if(d.channel===1&&budget>0)dRep+=0.03;
 if(d.staff===2&&load<0.95)dRep+=0.03;
 if(st.morale<50)dRep-=0.05;
 if(over)dRep-=0.1;
 const dMor=acc.morale+(load>1.06?-8:load>0.97?-3:0)+(d.staff===2?2:0);
 st.rep=clamp(st.rep+dRep,1,5);
 st.morale=clamp(st.morale+dMor+(70-st.morale)*0.08,5,100);
 const rp={month:m,units,demand:Math.round(demand),cap:Math.round(cap),lost,revenue,cogs,staffCost,fixed,mkt:budget,other,interest,tax,profit,cash:st.cash,cashBefore,
  od,odBefore,odInterest:odInt,loanInterest:loanInt,debt:debtOf(st),debtBefore,loanIn,principal:principal+repaid,stage:ins.stage,
  rep:st.rep,repDelta:st.rep-repBefore,morale:st.morale,moraleDelta:st.morale-morBefore,load,notes,contrib,dec:{...d}};
 rp.analysis=analyze(rp,T,d,m,type);
 st.history.push(rp);st.cumProfit+=profit;st.cumRevenue+=revenue;st.month++;
 return rp;
}
function analyze(rp,T,d,m,type){
 const a=[];
 if(rp.lost>rp.demand*0.04)a.push({t:'bad',s:rp.demand<=T.capacity[d.staff]?`Потужність просіла через події місяця і неточні пакети ролей: втрачено близько ${fmtN(rp.lost)} ${T.unit}. Штату зміни за звичайних умов вистачило б.`:`Не вистачило потужності: втрачено близько ${fmtN(rp.lost)} ${T.unit}. ${d.staff<2?'Додайте персонал у зміні.':'Зміна вже найбільша: шукайте втрати потужності в подіях і робочих пакетах або стримуйте попит ціною.'}`});
 if(d.quality<d.price)a.push({t:'bad',s:'Якість нижча, ніж клієнти очікують за таку ціну: частина клієнтів іде одразу, а рейтинг знижується.'});
 else if(d.quality>d.price)a.push({t:'info',s:'Якість вища за ціновий рівень: рейтинг росте, але маржа з кожного продажу менша.'});
 if(d.price===2&&rp.rep<3.9)a.push({t:'warn',s:'Висока ціна при рейтингу нижче 3,9 відлякує частину клієнтів.'});
 if(BUDGETS[d.budget]===0)a.push({t:'warn',s:'Без маркетингового бюджету попит тримається лише на репутації.'});
 if(rp.morale<50)a.push({t:'bad',s:'Мораль персоналу нижче 50%: продуктивність падає. Варто зайнятися мотивацією.'});
 else if(rp.moraleDelta<=-6)a.push({t:'warn',s:`Мораль персоналу впала на ${Math.round(-rp.moraleDelta)} п. Перевірте навантаження зміни і рішення щодо персоналу в подіях.`});
 if(rp.repDelta<=-0.12&&!(d.quality<d.price))a.push({t:'warn',s:`Рейтинг клієнтів упав на ${r2(-rp.repDelta)}. Причини шукайте у відповідях на події, контролі якості та перевантаженні персоналу.`});
 if(rp.load<0.72)a.push({t:'info',s:d.staff>0?`Персонал завантажений лише на ${Math.round(rp.load*100)}%: можна зменшити зміну і зекономити на зарплатах.`:`Потужність завантажена лише на ${Math.round(rp.load*100)}%, хоча зміна вже найменша: попиту замало. Перегляньте ціну, якість і просування.`});
 if(rp.other>=30000&&rp.other>=0.05*rp.revenue)a.push({t:'info',s:`Разові витрати місяця (події, інвестиції, помилки в пакетах) — ${kU(rp.other)}: це помітна частина результату.`});
 if(rp.profit<0){if(type==='hotel'&&m<=2&&rp.profit>-0.12*rp.revenue)a.push({t:'info',s:'Для готелю початок року — низький сезон. Збиток у ці місяці типовий, важливо мати запас грошей до літа.'});else a.push({t:'bad',s:'Місяць збитковий. Подивіться, яка стаття витрат зросла найбільше.'});}
 if(!a.length)a.push({t:'good',s:'Рішення збалансовані: компанія працює стабільно.'});
 const ord={bad:0,warn:1,info:2,good:3};
 return a.map((x,i)=>[x,i]).sort((p,q)=>ord[p[0].t]-ord[q[0].t]||p[1]-q[1]).map(x=>x[0]).slice(0,5);
}
function botRoleScores(team,month){
 const r=rng(hashStr(team.id+':skill')),skill=0.55+0.35*r(),r2_=rng(hashStr(team.id+':rs:'+month)),rs={},cnt={};
 team.members.forEach(m=>{const k=pkgRole(m);const s=clamp(skill+(r2_()-0.5)*0.3,0.2,1);rs[k]=(rs[k]||0)+s;cnt[k]=(cnt[k]||0)+1;});
 Object.keys(rs).forEach(k=>rs[k]/=cnt[k]);return rs;
}
function botMonth(st,team,level){
 normState(st);
 if(st.insolv.stage===2){st.month++;return null;} /* ліквідована компанія більше не працює */
 const r=rng(hashStr(team.id+':bot:'+st.month)),T=TYPES[team.type];
 const w=ws=>{let x=r()*ws.reduce((a,b)=>a+b,0);for(let i=0;i<ws.length;i++){x-=ws[i];if(x<=0)return i;}return ws.length-1;};
 const bp=w([1,4,1]),bq=r()<0.85?bp:w([1,2,1]);
 const dec={price:bp,quality:bq,staff:w([1,2,1]),budget:w([1,3,2,1]),channel:w([1,1,1]),invest:r()<0.25?1+Math.floor(r()*3):0};
 const rs=botRoleScores(team,st.month);
 const ids=pickEvents(team.id,team.type,st,level);
 const evs=ids.map(id=>({ev:EV[id],opt:Math.floor(r()*EV[id].options.length)}));
 const d=resolveDec(level,dec);
 /* команди-приклади беруть кредит на половину ліміту, коли грошей менше ніж на пів місяця обов'язкових платежів */
 if(st.insolv.stage===0&&debtOf(st)===0&&(st.od>0||st.cash<0.5*(T.fixed+T.staffOpts[1]*T.salary)))d.loan=Math.round(creditLimit(st,T)/2/10000)*10000;
 return simulateMonth(st,team.type,d,evs,team.id,rs);
}
function leagueRows(L){
 const rows=L.F.teams.map(t=>{const st=L.states[t.id],margin=st.cumRevenue?st.cumProfit/st.cumRevenue:0;return{t,st,cum:st.cumProfit,margin,rel:margin-TYPES[t.type].target,rep:st.rep,mor:st.morale,bk:stageOf(st)===2,san:!!st.sanPenalty,stage:stageOf(st)};});
 const live=rows.filter(r=>!r.bk),mn=live.length?Math.min(...live.map(r=>r.rel)):0,mx=live.length?Math.max(...live.map(r=>r.rel)):0;
 /* банкрут отримує мінімальний бал; санація знімає FIN.sanPenalty балів */
 rows.forEach(r=>{const pf=mx>mn?(r.rel-mn)/(mx-mn):0.5;r.score=r.bk?0:Math.max(0,Math.round(pf*40+(r.rep-1)/4*35+r.mor/100*25)-(r.san?FIN.sanPenalty:0));});
 rows.sort((a,b)=>(a.bk-b.bk)||b.score-a.score||b.rel-a.rel);return rows;
}
/* ========= СТАН ========= */
const KEY='puet-ve-practice-v5';
function initState(){return{v:5,view:'login',user:{name:'',group:'',prog:'FBS',course:2},coordCourse:2,counts:JSON.parse(JSON.stringify(SAMPLE_COUNTS)),
 L:null,tab:'overview',demoAll:true,viewAs:0,dec:defaultDec(),evc:{},sub:{},tasks:{},pk:{},hist:{},pkErr:'',report:null,loginError:''};}
let host=null,S=null;
function save(){if(host)host.save();}
/* прив'язка до сховища платформи: для студента — його профіль (u.practice), для координатора — спільне сховище курсу */
function bind(h,store,user){host=h;S=store;coordMode=!user;if(!S.v){Object.assign(S,initState());}
 if(user){const prog=mapProg(user.program);S.user={name:user.name||'',group:user.group||'',prog,course:+user.course||1,progName:user.program||''};migrateStore(S);}
 return S;}
const PROG_ALIAS={'Економіка':'FBS','Бізнес-адміністрування':'MEN','Експертиза та митна справа':'TTP','Міжнародні економічні відносини':'MAR','Германські мови та літератури (переклад)':'UP'};
function mapProg(name){const p=PROGRAMS.find(x=>x.name===name);if(p)return p.id;return PROG_ALIAS[name]||'MEN';}

/* ========= ІКОНКИ ========= */
const IC={
 cup:'<path d="M4 9h12v4.5A4.5 4.5 0 0 1 11.5 18h-3A4.5 4.5 0 0 1 4 13.5z"/><path d="M16 10.5h1.5a2 2 0 0 1 0 4H16"/><path d="M8 3.5v2.5M12 3.5v2.5"/><path d="M3 21h15"/>',
 bed:'<path d="M3 19V6"/><path d="M3 15h18v4"/><path d="M21 15v-2.5A3.5 3.5 0 0 0 17.5 9H11v6"/><circle cx="7" cy="11.5" r="1.8"/>',
 basket:'<path d="M3.5 10h17l-1.6 9.2a1 1 0 0 1-1 .8H6.1a1 1 0 0 1-1-.8z"/><path d="M8.5 10l3-6M15.5 10l-3-6"/><path d="M9 14v2.5M15 14v2.5"/>',
 factory:'<path d="M3 20V10.5l5 3v-3l5 3V6h4.5l1.5 14z"/><path d="M3 20h18"/><path d="M7 17h2M12 17h2"/>',
 home:'<path d="M4 11l8-6 8 6v8.5a.5.5 0 0 1-.5.5H15v-6H9v6H4.5a.5.5 0 0 1-.5-.5z"/>',
 clip:'<rect x="5.5" y="4.5" width="13" height="16" rx="2"/><path d="M9.5 4.5V3.5h5v1"/><path d="M9 10h6M9 13.5h6M9 17h4"/>',
 sliders:'<path d="M5 4v16M12 4v16M19 4v16"/><circle cx="5" cy="9" r="2.2"/><circle cx="12" cy="15" r="2.2"/><circle cx="19" cy="7" r="2.2"/>',
 bolt:'<path d="M13 3L5 13.5h6L10 21l8-10.5h-6z"/>',
 users:'<circle cx="9" cy="8.5" r="3.2"/><path d="M3 19.5c.6-3.2 3-5 6-5s5.4 1.8 6 5"/><path d="M16 5.6a3 3 0 0 1 0 5.8M18 14.6c1.6.6 2.7 2.2 3 4.9"/>',
 chart:'<path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/>',
 star:'<path d="M12 4l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 16.4l-4.8 2.5.9-5.4-3.9-3.8 5.4-.8z"/>',
 trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4"/><path d="M12 13v4M8.5 20h7"/>',
 cal:'<rect x="4" y="5.5" width="16" height="14.5" rx="2"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>',
 check:'<path d="M5 12.5l4.2 4L19 7"/>',
 grid:'<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
 building:'<path d="M5 20V5.5A1.5 1.5 0 0 1 6.5 4h7A1.5 1.5 0 0 1 15 5.5V20"/><path d="M15 10h3.5A1.5 1.5 0 0 1 20 11.5V20"/><path d="M3 20h18M8.5 8h3M8.5 12h3M8.5 16h3"/>'
};
const icon=(k,s=20)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[k]||''}</svg>`;

/* ========= ВИГЛЯДИ ========= */
function render(){if(host)host.render();}
const scoreChip=s=>s==null?'<span class="chip">не здано</span>':`<span class="chip ${s>=80?'good':s>=60?'warn':'bad'} num">${balW(s)}</span>`;

/* --- вхід --- */
function viewLogin(){
 const u=S.user;
 const progOpts=PROGRAMS.map(p=>`<option value="${p.id}" ${p.id===u.prog?'selected':''}>${p.short} · ${esc(p.name)}</option>`).join('');
 const courseSeg=[1,2,3,4].map(c=>`<button type="button" class="seg ${+u.course===c?'on':''}" data-act="lg-course" data-v="${c}">${c} курс<small>${LEVELS[c].title}</small></button>`).join('');
 return `<div class="login">
 <section class="hero">
  <div class="brand"><div class="mark">ВП</div><div><b>Віртуальне підприємство</b><span>ПУЕТ · зимова практика бакалаврів</span></div></div>
  <h1>Керуйте компанією разом зі студентами інших програм</h1>
  <p class="lead">Вісім тижнів дистанційної практики. Кожен тиждень дорівнює місяцю роботи компанії. Ваш робочий пакет визначає, як спрацюють рішення команди, а команда разом відповідає за результат.</p>
  <div class="types">${TYPE_ORDER.map(k=>`<div class="type-tile"><div class="ic">${icon(TYPES[k].icon)}</div><div><b>${TYPES[k].name}</b><span>${TYPES[k].desc}</span></div></div>`).join('')}</div>
  <div class="facts"><div><b class="num">5</b><span>кредитів ЄКТС</span></div><div><b class="num">8</b><span>тижнів практики</span></div><div><b class="num">14</b><span>освітніх програм</span></div><div><b class="num">12</b><span>ролей у компаніях</span></div></div>
 </section>
 <form class="form stack" id="loginForm" autocomplete="off">
  <div><div class="eyebrow">Вхід до практики</div><h2 style="margin-top:6px">Ім’я і група, без пароля</h2></div>
  <div class="field"><label for="f-name">Ім’я та прізвище</label><input class="input" id="f-name" data-u="name" value="${esc(u.name)}" required></div>
  <div class="field"><label for="f-group">Академічна група</label><input class="input" id="f-group" data-u="group" value="${esc(u.group)}" required></div>
  <div class="field"><label for="f-prog">Освітня програма</label><select class="input" id="f-prog" data-u="prog">${progOpts}</select></div>
  <div class="field"><label>Курс</label><div class="segrow wrap4" style="--n:4">${courseSeg}</div></div>
  ${S.loginError?`<div class="err">${esc(S.loginError)}</div>`:''}
  <button class="btn primary" type="submit">Увійти до своєї компанії</button>
  <p class="note">Демонстраційна версія: склад команд сформовано з прикладу даних, пакети колег заповнюються автоматично. Повний тижневий пакет на 6–8 годин зроблено для фінансової ролі: увійдіть із програмою «Фінанси, банківська справа та страхування».</p>
  <button class="btn" type="button" data-act="go-coord">${icon('grid',18)} Кабінет координатора практики</button>
 </form>
 </div>`;
}

/* --- застосунок студента --- */
const myTeam=()=>S.L.F.teams.find(t=>t.id===S.L.myId);
function decRoles(k,T){return k==='quality'?T.qualityRoles:k==='channel'?T.channelRoles:DECISIONS[k].roles;}
function respIdx(team,roles){for(const pass of[false,true]){for(const r of roles){const i=team.members.findIndex(m=>m.role===r&&(pass||!m.assistant));if(i>=0)return i;}}return team.members.findIndex(m=>m.role!=='guest');}
const decResp=(team,k)=>respIdx(team,decRoles(k,TYPES[team.type]));
const evResp=(team,ev)=>respIdx(team,ev.roles);
const canEdit=i=>S.demoAll||S.viewAs===i;
const activeDecs=level=>DEC_ORDER.filter(k=>DECISIONS[k].minLevel<=level);

function decMeta(k,T,st){
 if(k==='price')return{title:T.priceLabel,opts:T.price.map((p,i)=>({l:['Нижче ринку','Ринкова','Вище ринку'][i],s:money(p)})),hints:['Більше клієнтів, менша маржа з кожного продажу.','Баланс між обсягом і маржею.','Вища маржа, але менше клієнтів; потрібні висока репутація і відповідна якість.']};
 if(k==='quality')return{title:T.qualityLabel,opts:T.qualityOpts.map((q,i)=>({l:q,s:'собів. '+fmtN(T.unitCost[i])+' грн'})),hints:['Дешевше, але якщо ціна не низька, клієнти йдуть і рейтинг падає.','Відповідає ринковій ціні.','Рейтинг росте, собівартість вища.']};
 if(k==='staff')return{title:'Персонал у зміні',opts:T.staffOpts.map((n,i)=>({l:n+' осіб',s:'до '+fmtN(T.capacity[i])+' '+T.unit})),hints:['Економія на зарплатах, ризик черг і втрачених клієнтів.','Стандартне навантаження.','Запас потужності і кращий сервіс, вищий фонд оплати.']};
 if(k==='budget')return{title:'Маркетинговий бюджет',opts:BUDGETS.map((b,bi)=>({l:b?fmtN(b/1000)+' тис.':'Без бюджету',s:b?'грн на місяць':'лише репутація',dis:stageOf(st)===1&&bi>FIN.sanBudgetMax})),hints:['Попит тримається лише на репутації.','Підтримує впізнаваність.','Помітне зростання попиту.','Максимальне охоплення, віддача кожної гривні нижча.']};
 if(k==='channel')return{title:'Головний канал просування',opts:CHANNELS.map(c=>({l:c,s:''})),hints:['Швидке охоплення молодої аудиторії.','Пошук поруч і рейтинг на картах.','Стабільні замовлення від бізнесу.']};
 if(k==='invest')return{title:'Інвестиція місяця',opts:INVESTS.map(v=>({l:v.label,s:v.cost?fmtN(v.cost/1000)+' тис. грн':'',dis:v.id!=='none'&&(stageOf(st)===1||st.invested.includes(v.id)||(v.id==='gen'&&st.flags.gen))})),hints:INVESTS.map(v=>v.hint)};
}

/* ========= РОБОТИ ДЛЯ КУРАТОРА =========
   Тренажери, звіти ролі, записку й рекомендацію фінансової ролі та план оздоровлення оцінює куратор практики (0–100).
   Роботи лежать у сховищі студента: S.work[key]={kind,m,i,text,extra,status,at,score,comment,by,byName,gradedAt}.
   status: draft → submitted → graded | returned (на доопрацювання). Автоматичних балів за ці роботи немає. */
const WK={
 tr:{name:'Тематичний тренажер',min:80,minExtra:3,rubric:[['0–40','відповідність темі тренажера: що саме відпрацьовано'],['0–40','результат або підтвердження (бал, кількість завдань, файл чи посилання)'],['0–20','короткий висновок: що вдалося, що ні']]},
 rep:{name:'Звіт ролі',min:300,rubric:[['0–30','конкретність: що зроблено за роллю цього тижня'],['0–40','числа: результат із цифрою, що збігається з даними компанії'],['0–30','висновок і наступний крок']]},
 memo:{name:'Пояснювальна записка до бюджету',min:400,rubric:[['0–30','правильно названо тиждень із найнижчим залишком і пояснено причину'],['0–30','запропоновано конкретний захід: перенести оплату, домовитися про відстрочку, зменшити зміну'],['0–20','числа в записці збігаються з таблицею'],['0–20','чіткий висновок для директора: що робити і коли']]},
 rec:{name:'Рекомендація щодо ціни',min:200,rubric:[['0–40','обґрунтування через точку беззбитковості й залишок грошей'],['0–30','враховано собівартість із відповіді колеги'],['0–30','чітка рекомендація з наслідками для команди']]},
 plan:{name:'План оздоровлення компанії',min:300,rubric:[['0–30','причина неплатоспроможності з числами зі звітів'],['0–40','конкретні заходи на два тижні та їх очікуваний ефект у гривнях'],['0–30','контрольна точка: який борг очікується через тиждень']]}
};
let coordMode=false;
const nowIso=()=>new Date().toISOString();
const fmtAt=s=>{if(!s)return'';const d=new Date(s);if(isNaN(d))return'';const z=n=>String(n).padStart(2,'0');return `${z(d.getDate())}.${z(d.getMonth()+1)}.${d.getFullYear()}, ${z(d.getHours())}:${z(d.getMinutes())}`;};
const teamOf=P=>P.L.F.teams.find(t=>t.id===P.L.myId);
const userIdxOf=P=>{const t=teamOf(P);return t?t.members.findIndex(m=>m.user):-1;};
const wkKey=(i,m,kind)=>kind==='plan'?`${m}-plan`:`${i}-${m}-${kind}`;
function parseWk(key){let x=/^(\d+)-plan$/.exec(key);if(x)return{m:+x[1],kind:'plan',i:null};x=/^(\d+)-(\d+)-(tr|rep|memo|rec)$/.exec(key);return x?{i:+x[1],m:+x[2],kind:x[3]}:null;}
/* сумісність зі старими збереженнями: додаємо поля, нічого не видаляємо */
function migrateStore(P){
 if(!P||!P.L)return P;
 if(!P.work)P.work={};
 Object.values(P.L.states).forEach(normState);
 if(P.dec&&P.dec.loan==null){P.dec.loan=0;P.dec.repay=false;}
 const ui=userIdxOf(P);if(ui<0)return P;
 const mark=(m,kind)=>{const k=wkKey(ui,m,kind);if(!P.work[k])P.work[k]={kind,m,i:ui,text:'',extra:'',status:'submitted',legacy:true,at:null};};
 /* раніше тренажери і звіти позначалися галочкою: тепер це «подано раніше (без тексту)» і чекає оцінки куратора */
 const hu=P.hist&&P.hist[ui]||{};
 Object.keys(hu).forEach(m=>{const h=hu[m];if(h.v===2)return;if(h.tr===true)mark(+m,'tr');if(h.rep===true)mark(+m,'rep');});
 Object.keys(P.tasks||{}).forEach(k=>{if(!P.tasks[k])return;const x=/^(\d+)-(\d+)-(tr|rep)$/.exec(k);if(x&&+x[1]===ui)mark(+x[2],x[3]);});
 return P;
}
function wkStatus(it){
 if(!it||it.status==='draft')return{k:it?'draft':'none',chip:'',label:it?'Чернетка · ще не подано':'Не подано'};
 if(it.status==='graded')return{k:'graded',chip:it.score>=80?'good':it.score>=60?'warn':'bad',label:`Оцінено: ${it.score} зі 100`};
 if(it.status==='returned')return{k:'returned',chip:'warn',label:'Повернено на доопрацювання'};
 return{k:'submitted',chip:'acc',label:(it.legacy&&!(it.text||'').trim()?'Подано раніше (без тексту)':it.late?'Подано із запізненням':'Подано')+' · очікує оцінки куратора'};
}
function wkPrompt(kind,team,mem,m,st){
 if(kind==='tr')return `Тренажер «${trainerFor(mem,m)}». Напишіть, що саме відпрацьовано (тема, тип завдань) і що вдалося чи не вдалося. Щонайменше ${WK.tr.min} знаків. В окремому полі вкажіть результат або підтвердження: бал, кількість виконаних завдань, назву файла чи посилання.`;
 if(kind==='plan')return `План оздоровлення для зовнішнього управління: 1) причина неплатоспроможності з числами зі звітів; 2) три конкретні заходи на найближчі два тижні (ціна, витрати, персонал, борг) з очікуваним ефектом у гривнях; 3) контрольна точка — який борг за овердрафтом очікуєте через тиждень. Щонайменше ${WK.plan.min} знаків.`;
 if(kind==='rep')return stageOf(st)===2&&m>=((st.insolv.liquidated!=null?st.insolv.liquidated:99)+1)?`Компанію ліквідовано, тому звіт цього тижня — аналіз причин банкрутства з погляду вашої ролі: 1) які рішення й показники до нього привели (з числами зі звітів); 2) що ваша роль могла зробити інакше; 3) висновок на майбутнє. Щонайменше ${WK.rep.min} знаків.`:`Звіт ролі за тиждень: 1) що зроблено за вашою роллю; 2) результат із числом — із робочого пакета чи звіту компанії; 3) висновок: що варто змінити наступного тижня. Щонайменше ${WK.rep.min} знаків.`;
 if(kind==='memo')return 'Пояснювальна записка до бюджету руху грошей: текст подано з робочого пакета. До оцінювання його можна уточнити.';
 return 'Обґрунтування рекомендації щодо ціни: текст подано з робочого пакета. До оцінювання його можна уточнити.';
}
function wkTitle(kind,mem,m){return kind==='tr'?`Тематичний тренажер: «${trainerFor(mem,m)}»`:WK[kind].name;}
/* картка однієї роботи у студента */
function workCard(team,st,mem,key,canWrite){
 const pk=parseWk(key),kind=pk.kind,m=pk.m,W=WK[kind],it=(S.work||{})[key],sx=wkStatus(it),ed=canWrite&&sx.k!=='graded';
 const txt=it?it.text||'':'',len=txt.trim().length,err=S.wErr&&S.wErr.key===key?S.wErr.msg:'';
 const btn=sx.k==='returned'?'Подати повторно':sx.k==='submitted'?'Зберегти зміни':'Подати куратору';
 return `<div class="card" id="wk-${key}">
  <div class="card-h"><div><div class="eyebrow">Тиждень ${m+1} · ${MONTHS[m]} · оцінює куратор, 0–100</div><h3 style="margin-top:4px">${esc(wkTitle(kind,mem,m))}</h3></div><span class="chip ${sx.chip}">${esc(sx.label)}</span></div>
  ${ed?`<p class="small muted" style="margin:8px 0">${esc(wkPrompt(kind,team,mem,m,st))}</p>
   <label class="small muted" for="wt-${key}">Текст роботи</label>
   <textarea class="ta" id="wt-${key}" data-prin="w|${key}|text" style="min-height:${kind==='tr'?90:140}px" placeholder="${kind==='tr'?'Що відпрацьовано і що вийшло':'Що зроблено · результат із числом · висновок'}">${esc(txt)}</textarea>
   <div class="cnt-ch num">${len} / ${W.min} знаків</div>
   ${kind==='tr'?`<div class="field" style="margin-top:8px"><label for="we-${key}">Результат або підтвердження</label><input class="input" id="we-${key}" data-prin="w|${key}|extra" value="${esc(it?it.extra||'':'')}" placeholder="Наприклад: 8 із 10 завдань, 84%; файл «tk-deruny.xlsx»"></div>`:''}
   ${sx.k==='returned'&&it.comment?`<div class="insight miss" style="margin-top:10px"><b>Коментар куратора.</b> ${esc(it.comment)}${it.byName?` <span class="small muted">· ${esc(it.byName)}, ${fmtAt(it.returnedAt)}</span>`:''}</div>`:''}
   ${err?`<div class="err" style="margin-top:8px">${esc(err)}</div>`:''}
   <div class="row" style="margin-top:10px"><button class="btn primary" data-act="w-submit" data-v="${key}">${btn}</button><span class="small muted">${sx.k==='submitted'?'Редагувати можна, доки куратор не поставить оцінку.':sx.k==='returned'?'Після повторного подання робота знову потрапить до куратора.':'Після подання роботу побачить куратор практики.'}</span></div>`
  :`${txt.trim()?`<div class="note" style="margin-top:8px;white-space:pre-wrap">${esc(txt)}</div>`:(it?'<p class="small muted" style="margin-top:8px">Тексту немає: роботу позначено як виконану ще до появи письмових звітів.</p>':'<p class="small muted" style="margin-top:8px">Роботу не подано.</p>')}
   ${it&&it.extra?`<p class="small" style="margin-top:6px"><b>Результат або підтвердження:</b> ${esc(it.extra)}</p>`:''}
   ${sx.k==='graded'?`<div class="insight" style="margin-top:10px"><b>Оцінка куратора: ${it.score} зі 100.</b> ${it.comment?esc(it.comment):'Без коментаря.'} <span class="small muted">· ${esc(it.byName||'куратор практики')}, ${fmtAt(it.gradedAt)}</span></div><p class="small muted" style="margin-top:6px">Оцінену роботу змінити не можна. Повторне подання можливе, лише якщо куратор поверне її на доопрацювання.</p>`:''}
   ${!canWrite&&sx.k!=='graded'?'<p class="small muted" style="margin-top:6px">Цю роботу можна подати лише зі своєї ролі.</p>':''}`}
 </div>`;
}
function planNeeded(st){return stageOf(st)===1&&st.month<TOTAL_MONTHS;}
function planDone(st){const it=(S.work||{})[wkKey(null,st.month,'plan')];return !!(it&&(it.status==='submitted'||it.status==='graded'));}
/* які роботи належать користувачеві за тиждень m */
function wkKeysFor(P,ui,m,st){
 const keys=[wkKey(ui,m,'tr'),wkKey(ui,m,'rep')],W=P.work||{};
 for(const k of['memo','rec'])if(W[wkKey(ui,m,k)])keys.push(wkKey(ui,m,k));
 if(W[wkKey(null,m,'plan')]||(m===st.month&&planNeeded(st)))keys.push(wkKey(null,m,'plan'));
 return keys;
}
function tabWorks(team,T,st,level,me,done){
 const ui=team.members.findIndex(m=>m.user),mem=team.members[ui],mine=S.viewAs===ui;
 if(ui<0)return '<div class="card"><p class="muted">У цій команді немає вашої ролі.</p></div>';
 const g=gradeCalc(S,ui);
 const cur=done?[]:wkKeysFor(S,ui,st.month,st);
 const past=[];for(let m=Math.min(st.month,TOTAL_MONTHS)-1;m>=0;m--)wkKeysFor(S,ui,m,st).forEach(k=>past.push(k));
 const open=past.filter(k=>{const s=wkStatus(S.work[k]).k;return s==='returned'||s==='none'||s==='draft';}),closed=past.filter(k=>!open.includes(k));
 return `<div class="card soft"><p style="max-width:76ch">Тренажери, звіти ролі${g.hasFin?', записку й рекомендацію фінансової ролі':''} та план оздоровлення оцінює <b>куратор практики</b> за шкалою 0–100. Автоматичних балів за них немає: неподана робота за закритий тиждень — це 0, подана й ще не оцінена — «не оцінено» і в попередній оцінці не враховується. Подати роботу за минулий тиждень можна й пізніше — куратор побачить позначку про запізнення.</p>
  <div class="row" style="margin-top:10px"><span class="chip acc num">очікують оцінки: ${g.cnt.pending}</span><span class="chip good num">оцінено: ${g.cnt.graded}</span><span class="chip warn num">повернено: ${g.cnt.returned}</span><span class="chip num">не подано: ${g.cnt.none}</span></div>
  ${mine?'':'<p class="small muted" style="margin-top:8px">Ви переглядаєте компанію від імені колеги. Роботи для куратора подаються лише зі своєї ролі — переключіться на неї.</p>'}</div>
 ${cur.length?`<h2 style="margin:6px 0 2px">Цей тиждень</h2>${cur.map(k=>workCard(team,st,mem,k,mine)).join('')}`:''}
 ${open.length?`<h2 style="margin:10px 0 2px">Потребують вашої дії</h2>${open.map(k=>workCard(team,st,mem,k,mine)).join('')}`:''}
 ${closed.length?`<h2 style="margin:10px 0 2px">Подані раніше</h2>${closed.map(k=>workCard(team,st,mem,k,mine)).join('')}`:''}`;
}
function submitWork(key){
 if(coordMode||!S.L)return false;
 const team=myTeam(),st=S.L.states[team.id],ui=team.members.findIndex(m=>m.user),pk=parseWk(key);
 if(!pk||ui<0||S.viewAs!==ui)return false;
 if(pk.kind!=='plan'&&pk.i!==ui)return false;
 if(pk.m>Math.min(st.month,TOTAL_MONTHS-1))return false;
 if(!S.work)S.work={};
 const it=S.work[key];
 if((pk.kind==='memo'||pk.kind==='rec')&&!it)return false; /* ці роботи народжуються лише з робочого пакета */
 if(pk.kind==='plan'&&!it&&!(pk.m===st.month&&planNeeded(st)))return false;
 if(it&&it.status==='graded')return true; /* оцінену роботу студент не змінює */
 const W=WK[pk.kind],txt=it?(it.text||'').trim():'';
 if(txt.length<W.min){S.wErr={key,msg:`Текст має містити щонайменше ${W.min} знаків: зараз ${txt.length}.`};return true;}
 if(pk.kind==='tr'&&(it.extra||'').trim().length<WK.tr.minExtra){S.wErr={key,msg:'Вкажіть результат або підтвердження проходження тренажера.'};return true;}
 const wasReturned=it.status==='returned';
 it.status='submitted';it.at=nowIso();if(pk.m<st.month&&!wasReturned&&!it.legacy)it.late=true;
 if(wasReturned)it.resubmitted=(it.resubmitted||0)+1;
 S.wErr=null;return true;
}
function inputWork(key,field,value){
 if(coordMode||!S.L)return false;
 const team=myTeam(),st=S.L.states[team.id],ui=team.members.findIndex(m=>m.user),pk=parseWk(key);
 if(!pk||ui<0||S.viewAs!==ui||(pk.kind!=='plan'&&pk.i!==ui)||pk.m>Math.min(st.month,TOTAL_MONTHS-1))return false;
 if(field!=='text'&&field!=='extra')return false;
 if(!S.work)S.work={};
 let it=S.work[key];
 if(!it){if(pk.kind==='memo'||pk.kind==='rec')return false;if(pk.kind==='plan'&&!(pk.m===st.month&&planNeeded(st)))return false;it=S.work[key]={kind:pk.kind,m:pk.m,i:ui,text:'',extra:'',status:'draft',at:null};}
 if(it.status==='graded')return false;
 it[field]=String(value).slice(0,6000);return true;
}
/* робота фінансової ролі з повного пакета потрапляє до куратора */
function putPkgWork(kind,m,text){
 const team=myTeam(),ui=team.members.findIndex(x=>x.user);if(ui<0||S.viewAs!==ui)return;
 if(!S.work)S.work={};const key=wkKey(ui,m,kind),it=S.work[key];
 if(it&&it.status==='graded')return;
 S.work[key]=Object.assign(it||{kind,m,i:ui,extra:''},{text,status:'submitted',at:nowIso()});
}

/* ========= ОЦІНКА =========
   Ваги: робочі пакети 40 (авто; у повному пакеті фінансової ролі 80% авто + по 10% записка й рекомендація від куратора),
   тренажери 15 і звіти ролі 15 (куратор), результат компанії 20 (рейтинг курсу), оцінка колег 10 (у демо не виставляється).
   Попередня оцінка рахується лише за оціненою частиною; вага неоціненого показується окремо. */
function gradeCalc(P,idx){
 const L=P.L,team=teamOf(P),st=L.states[team.id],mem=team.members[idx]||team.members[0],isUser=!!mem.user,W=P.work||{};
 const h=P.hist&&P.hist[idx]||{},ms=Object.keys(h).map(Number).sort((a,b)=>a-b),n=ms.length;
 const units=[],cnt={pending:0,graded:0,returned:0,none:0};let hasFin=false;
 const cur=key=>{const s=wkStatus(W[key]);if(s.k==='graded')return[W[key].score,'graded'];if(s.k==='submitted')return[null,'pending'];if(s.k==='returned')return[null,'returned'];return[0,'none'];};
 const add=(c,m,share,sc,state,key)=>units.push({c,m,share,score:sc,state,key});
 ms.forEach(m=>{const x=h[m];
  if(isUser&&x.full){hasFin=true;add('pkg',m,0.8,x.pkg,'auto');for(const k of['memo','rec']){const key=wkKey(idx,m,k),c=cur(key);add('pkg',m,0.1,c[0],c[1],key);}}
  else add('pkg',m,1,x.pkg,'auto');
  if(isUser){for(const k of['tr','rep']){const key=wkKey(idx,m,k),c=cur(key);add(k,m,1,c[0],c[1],key);}
   const pkKey=wkKey(null,m,'plan');if(W[pkKey]){const c=cur(pkKey);add('rep',m,1,c[0],c[1],pkKey);}}
 });
 const WT={pkg:40,tr:15,rep:15,team:20},comps={};
 for(const c of['pkg','tr','rep']){const us=units.filter(u=>u.c===c),sh=us.reduce((a,u)=>a+u.share,0);us.forEach(u=>u.w=sh?WT[c]*u.share/sh:0);
  const gr=us.filter(u=>u.score!=null),gw=gr.reduce((a,u)=>a+u.w,0);
  comps[c]={w:us.length?WT[c]:0,val:gw?gr.reduce((a,u)=>a+u.w*u.score,0)/gw:null,gradedW:gw,pendingW:us.filter(u=>u.score==null).reduce((a,u)=>a+u.w,0),n:us.length};}
 const row=n?leagueRows(L).find(r=>r.t.id===team.id):null;
 comps.team={w:n?WT.team:0,val:row?row.score:null,gradedW:n?WT.team:0,pendingW:0,bk:row?row.bk:false,san:row?row.san:false};
 units.forEach(u=>{if(u.key)cnt[u.state]++;});
 /* роботи поточного (ще не закритого) тижня в оцінку не входять, але їх видно в лічильниках */
 if(isUser&&st.month<TOTAL_MONTHS&&h[st.month]==null)wkKeysFor(P,idx,st.month,st).forEach(k=>{const s=wkStatus(W[k]).k;cnt[s==='submitted'?'pending':s==='draft'?'none':s]++;});
 const gradedW=['pkg','tr','rep','team'].reduce((a,c)=>a+comps[c].gradedW,0),pendingW=['pkg','tr','rep'].reduce((a,c)=>a+comps[c].pendingW,0);
 const total=gradedW?['pkg','tr','rep','team'].reduce((a,c)=>a+(comps[c].val==null?0:comps[c].val*comps[c].gradedW),0)/gradedW:null;
 const done=st.month>=TOTAL_MONTHS;
 return{total,gradedW,pendingW,comps,units,cnt,n,h,ms,isUser,hasFin,done,incomplete:pendingW>0.001,final:done&&pendingW<=0.001&&n>0};
}

/* ========= КУРАТОР: ЧЕРГА ПЕРЕВІРКИ ========= */
function actor(){return host&&host.me?host.me():null;}
function canGrade(){const a=actor();return !!(coordMode&&a&&(a.role==='uni_teacher'||a.role==='admin'));}
function stuList(){
 if(!host||!host.students)return[];
 return host.students().filter(s=>s.practice&&s.practice.L&&s.practice.L.F).map(s=>{const P=migrateStore(s.practice),team=teamOf(P),ui=team?team.members.findIndex(m=>m.user):-1;return{s,P,team,ui,mem:team&&team.members[ui],st:team&&P.L.states[team.id]};}).filter(x=>x.ui>=0);
}
function queueAll(){const out=[];stuList().forEach(x=>{Object.keys(x.P.work||{}).forEach(key=>{const it=x.P.work[key];if(!it||it.status==='draft'||!parseWk(key))return;out.push(Object.assign({key,it},x));});});
 return out.sort((a,b)=>(a.it.at||'')<(b.it.at||'')?-1:1);}
const GQ0={course:'',team:'',week:'',type:'',status:'todo'};
function weekNumbers(x,m){
 const rp=x.st.history.find(r=>r.month===m),h=x.P.hist&&x.P.hist[x.ui]&&x.P.hist[x.ui][m],T=TYPES[x.team.type],out=[];
 if(rp){out.push(['Виручка',money(rp.revenue)],['Прибуток після податку',money(rp.profit)],['Обсяг',fmtN(rp.units)+' '+unitW(T.unit,rp.units)],['Гроші на кінець тижня',money(rp.cash)]);
  if(rp.od!=null)out.push(['Овердрафт і кредит',money((rp.od||0)+(rp.debt||0))]);
  out.push(['Рейтинг клієнтів',r2(rp.rep)],['Мораль персоналу',Math.round(rp.morale)+'%'],['Завантаження потужності',Math.round(rp.load*100)+'%']);
  if(rp.dec)out.push(['Рішення тижня',`ціна: ${['нижче ринку','ринкова','вище ринку'][rp.dec.price]}; якість: ${lc(T.qualityOpts[rp.dec.quality])}; персонал: ${T.staffOpts[rp.dec.staff]}; маркетинг: ${fmtN(BUDGETS[rp.dec.budget]/1000)} тис. грн`]);}
 else out.push(['Тиждень компанії','ще не закрито: фінансових підсумків немає']);
 if(h)out.push(['Бал робочого пакета (авто)',h.pkg+' зі 100']);
 const p=x.P.pk&&x.P.pk[x.ui];
 if(p&&p.full&&x.st.month===m&&p.cf){const r=p.cf.rows,mi=p.cf.minI;out.push(['Еталон бюджету руху грошей',`найнижчий залишок ${money(r[mi].bal)} на ${mi+1}-му тижні місяця`],['Еталон точки беззбитковості',fmtN(p.qs[1].ans)+' '+T.unit+' за прогнозу '+fmtN(p.meta.fc)]);if(p.rec&&p.rec.level!=null)out.push(['Рекомендований рівень ціни',['нижче ринку','ринкова','вище ринку'][p.rec.level]]);}
 return out;
}
function gItem(q){
 const pk=parseWk(q.key),W=WK[pk.kind],it=q.it,sx=wkStatus(it),id=q.s.id+'|'+q.key,dr=(S.gdraft||{})[id]||{},err=S.gErr&&S.gErr.id===id?S.gErr.msg:'';
 const p=PROG[q.mem.prog];
 return `<div class="card gitem" data-gid="${esc(id)}">
  <div class="card-h"><div style="min-width:0"><div class="eyebrow">${esc(W.name)} · тиждень ${pk.m+1} (${MONTHS[pk.m]})</div><h3 style="margin-top:4px">${esc(q.s.name)}</h3>
   <div class="small muted">${esc(q.s.program||(p?p.name:''))} · ${q.P.L.course} курс${q.s.group?' · '+esc(q.s.group):''} · ${esc(q.team.name)} (${TYPES[q.team.type].name}) · роль: ${esc(roleLabel(q.team.type,q.mem))}</div></div><span class="chip ${sx.chip}">${esc(sx.label)}</span></div>
  ${pk.kind==='tr'?`<p class="small" style="margin-top:8px"><b>Тренажер:</b> «${esc(trainerFor(q.mem,pk.m))}»</p>`:''}
  ${(it.text||'').trim()?`<div class="note" style="margin-top:8px;white-space:pre-wrap">${esc(it.text)}</div>`:'<div class="note" style="margin-top:8px">Тексту немає: роботу позначено як виконану до появи письмових звітів. Можна оцінити за підсумками співбесіди або повернути на доопрацювання.</div>'}
  ${it.extra?`<p class="small" style="margin-top:6px"><b>Результат або підтвердження:</b> ${esc(it.extra)}</p>`:''}
  <p class="small muted" style="margin-top:6px">Подано: ${it.at?fmtAt(it.at):'раніше, дата не збереглася'}${it.late?' · із запізненням':''}${it.resubmitted?' · після доопрацювання':''}</p>
  <div class="grid2" style="margin-top:10px">
   <div><div class="eyebrow" style="margin-bottom:6px">Показники компанії студента за цей тиждень</div><div style="display:grid;grid-template-columns:minmax(150px,auto) 1fr;gap:5px 14px;font-size:13.5px">${weekNumbers(q,pk.m).map(r=>`<div class="muted">${esc(r[0])}</div><div class="num" style="font-weight:600">${esc(r[1])}</div>`).join('')}</div></div>
   <div><div class="eyebrow" style="margin-bottom:6px">Рубрика · разом 0–100</div><div class="rubric">${W.rubric.map(r=>`<div><b style="min-width:52px">${r[0]}</b><span>${r[1]}</span></div>`).join('')}</div></div>
  </div>
  ${sx.k==='graded'?`<div class="insight" style="margin-top:10px"><b>Оцінено: ${it.score} зі 100.</b> ${it.comment?esc(it.comment):'Без коментаря.'} <span class="small muted">· ${esc(it.byName||'')}, ${fmtAt(it.gradedAt)}</span></div>`:''}
  ${sx.k==='returned'?`<div class="insight miss" style="margin-top:10px"><b>Повернено на доопрацювання.</b> ${esc(it.comment||'')} <span class="small muted">· ${esc(it.byName||'')}, ${fmtAt(it.returnedAt)}</span></div>`:''}
  ${canGrade()&&sx.k!=='returned'?`<div class="row" style="margin-top:12px;align-items:flex-start">
   <div class="field" style="max-width:150px"><label for="gs-${esc(id)}">Оцінка, 0–100</label><input class="input num" id="gs-${esc(id)}" type="number" min="0" max="100" step="1" inputmode="numeric" data-prin="g|${esc(id)}|score" value="${esc(dr.score!=null?dr.score:(sx.k==='graded'?it.score:''))}"></div>
   <div class="field grow" style="min-width:220px"><label for="gc-${esc(id)}">Коментар для студента</label><textarea class="ta" id="gc-${esc(id)}" style="min-height:70px" data-prin="g|${esc(id)}|comment" placeholder="Що зараховано, чого бракує">${esc(dr.comment!=null?dr.comment:(sx.k==='graded'?it.comment||'':''))}</textarea></div></div>
   ${err?`<div class="err" style="margin-top:8px">${esc(err)}</div>`:''}
   <div class="row" style="margin-top:10px"><button class="btn primary" data-act="g-grade" data-k="${esc(q.s.id)}" data-v="${esc(q.key)}">${sx.k==='graded'?'Змінити оцінку':'Оцінити'}</button><button class="btn" data-act="g-return" data-k="${esc(q.s.id)}" data-v="${esc(q.key)}">Повернути на доопрацювання</button></div>`:''}
 </div>`;
}
function viewQueue(){
 const all=queueAll(),f=Object.assign({},GQ0,S.gq||{}),todo=all.filter(q=>q.it.status==='submitted').length;
 const teams=[...new Set(all.map(q=>q.P.L.course+' курс · '+q.team.name))].sort();
 const list=all.filter(q=>{const pk=parseWk(q.key);
  return(!f.course||q.P.L.course===+f.course)&&(!f.team||q.P.L.course+' курс · '+q.team.name===f.team)&&(f.week===''||pk.m===+f.week)&&(!f.type||pk.kind===f.type)&&(f.status==='all'||(f.status==='todo'?q.it.status==='submitted':q.it.status===f.status));});
 const sel=(k,label,opts)=>`<div class="field" style="min-width:150px;flex:1"><label for="gq-${k}">${label}</label><select class="input" id="gq-${k}" data-act-change="g-f" data-k="${k}">${opts.map(o=>`<option value="${esc(o[0])}" ${String(f[k])===String(o[0])?'selected':''}>${esc(o[1])}</option>`).join('')}</select></div>`;
 return `<div class="card"><div class="card-h"><div><div class="eyebrow">Оцінювання практики</div><h2 style="margin-top:4px">Роботи на перевірку</h2></div><span class="chip ${todo?'warn':'good'} num">не оцінено: ${todo}</span></div>
  <p class="small muted" style="max-width:80ch">Тут зібрано роботи, які студенти подали зі своїх кабінетів: тренажери, звіти ролі, записки й рекомендації фінансової ролі, плани оздоровлення. Шкала єдина — 0–100; у підсумок бал входить із вагою складової. Оцінка, коментар, ваше ім’я і час зберігаються в профілі студента — їх буде видно після входу студента на цьому пристрої.</p>
  <div class="row" style="margin-top:12px;align-items:flex-end">${sel('course','Курс',[['','усі курси'],[1,'1 курс'],[2,'2 курс'],[3,'3 курс'],[4,'4 курс']])}${sel('team','Команда',[['','усі команди'],...teams.map(t=>[t,t])])}${sel('week','Тиждень',[['','усі тижні'],...MONTHS.map((mn,i)=>[i,`${i+1} · ${mn}`])])}${sel('type','Тип роботи',[['','усі типи'],...Object.keys(WK).map(k=>[k,WK[k].name])])}${sel('status','Стан',[['todo','не оцінені'],['graded','оцінені'],['returned','повернені'],['all','усі']])}</div>
  ${canGrade()?'':'<div class="err" style="margin-top:10px">Оцінювати можуть лише куратор практики та адміністратор.</div>'}
 </div>
 ${list.length?list.map(gItem).join(''):`<div class="card"><p class="muted">${all.length?'За цими фільтрами робіт немає.':'Студенти ще не подали жодної роботи. Роботи з’являться тут, щойно студент натисне «Подати куратору» у своєму кабінеті на цьому пристрої.'}</p></div>`}`;
}
function viewStudents(){
 const xs=stuList();
 if(!xs.length)return '<div class="card"><p class="muted">На цьому пристрої ще немає розпочатих практик.</p></div>';
 const cell=c=>c.n===0&&c.w===0?'—':`${c.val==null?'—':Math.round(c.val)}${c.pendingW>0.001?' <span class="small muted">(не оцінено '+Math.round(c.pendingW)+')</span>':''}`;
 const rows=xs.map(x=>{const g=gradeCalc(x.P,x.ui),sc=g.total!=null?scale(g.total):null;
  return `<tr><td class="l"><b>${esc(x.s.name)}</b><div class="small muted">${esc(x.s.program||'')} · ${x.P.L.course} курс</div></td><td class="l">${esc(x.team.name)}<div class="small muted">${esc(roleLabel(x.team.type,x.mem))}${stageOf(x.st)===2?' · банкрут':stageOf(x.st)===1?' · санація':''}</div></td><td>${Math.min(x.st.month,TOTAL_MONTHS)} з ${TOTAL_MONTHS}</td><td>${cell(g.comps.pkg)}</td><td>${cell(g.comps.tr)}</td><td>${cell(g.comps.rep)}</td><td>${g.comps.team.val==null?'—':g.comps.team.val}</td><td><b>${g.total==null?'—':Math.round(g.total)}</b>${sc?' '+sc[0]:''}</td><td>${g.total==null?'—':g.final?'<span class="chip good">остаточна</span>':g.incomplete?`<span class="chip warn">не оцінено ${Math.round(g.pendingW)} із 90</span>`:'<span class="chip acc">попередня</span>'}</td><td>${g.cnt.pending}</td></tr>`;}).join('');
 return `<div class="card"><div class="card-h"><div><div class="eyebrow">Зведення</div><h2 style="margin-top:4px">Оцінки студентів</h2></div></div>
  <p class="small muted" style="max-width:80ch">Складові: робочі пакети 40 (авто), тренажери 15 і звіти ролі 15 (куратор), результат компанії 20 (рейтинг курсу). Оцінка колег (10) у демо не виставляється, тому підсумок рахується з 90 балів ваги. Числа в дужках — вага робіт, які ще чекають вашої оцінки.</p>
  <div class="tbl-wrap" style="margin-top:10px"><table><thead><tr><th class="l">Студент</th><th class="l">Компанія і роль</th><th>Закрито тижнів</th><th>Пакети</th><th>Тренажери</th><th>Звіти</th><th>Компанія</th><th>Оцінка</th><th>Стан</th><th>У черзі</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
}
function gradeAct(sid,key,ret){
 if(!canGrade())return false;
 const a=actor(),x=stuList().find(x=>x.s.id===sid),it=x&&x.P.work&&x.P.work[key],id=sid+'|'+key;
 if(!it||it.status==='draft'||!parseWk(key))return false;
 const dr=(S.gdraft||{})[id]||{},comment=String(dr.comment!=null?dr.comment:(it.status==='graded'?it.comment||'':'')).trim();
 if(ret){
  if(comment.length<10){S.gErr={id,msg:'Щоб повернути роботу, напишіть студентові, що саме доопрацювати (щонайменше 10 знаків).'};return true;}
  if(it.score!=null){it.prevScore=it.score;delete it.score;}
  Object.assign(it,{status:'returned',comment,by:a.id,byName:a.name,returnedAt:nowIso()});
 }else{
  const raw=dr.score!=null?dr.score:(it.status==='graded'?it.score:''),sc=parseNum(raw);
  if(raw===''||!isFinite(sc)||sc<0||sc>100){S.gErr={id,msg:'Вкажіть оцінку від 0 до 100.'};return true;}
  Object.assign(it,{status:'graded',score:Math.round(sc),comment,by:a.id,byName:a.name,gradedAt:nowIso()});
 }
 if(S.gdraft)delete S.gdraft[id];S.gErr=null;if(!S.coordTab)S.coordTab='queue';return true;
}

/* ========= ЛІКВІДНІСТЬ І БОРГ У КАБІНЕТІ СТУДЕНТА ========= */
function finCard(team,T,st){
 const q=liqInfo(st,T,resolveDec(S.L.course,S.dec)),lim=creditLimit(st,T);
 const chip={ok:['good','платоспроможна'],low:['warn','грошей обмаль'],od:['warn','працює в овердрафті'],next:['bad','за тиждень до санації'],san:['bad','санація'],bk:['bad','банкрут']}[q.risk];
 const cov=q.cover>=9?'понад 9 тижнів':fmtD(Math.max(0,q.cover),1)+' тижня';
 const warn={
  low:`Вільних грошей разом з овердрафтом вистачає на ${cov} обов’язкових платежів. Якщо тиждень буде збитковим, компанія піде в овердрафт під ${p0(FIN.odRate)} за місяць компанії.`,
  od:`Компанія користується овердрафтом: ${kU(q.od)} з ліміту ${kU(q.ODL)}. Відсотки — ${p0(FIN.odRate)} за місяць компанії. Якщо борг перевищить ліміт, почнеться санація.`,
  next:`Попередження: якщо наступний тиждень буде таким самим, як минулий, борг за овердрафтом перевищить ліміт ${kU(q.ODL)} і компанія перейде в санацію.`,
  san:`Компанія в санації${q.weeks?` (${q.weeks}-й тиждень позаду)`:''}: інвестиції й нові кредити заборонено, маркетинг — не більше ${fmtN(BUDGETS[FIN.sanBudgetMax]/1000)} тис. грн. Вихід — зменшити борг за овердрафтом до ${kU(q.ODL*FIN.recoverShare)}. Ліквідація — якщо після ${FIN.sanWeeks} тижнів санації борг вищий за ліміт ${kU(q.ODL)} і за тиждень не зменшився.`,
  bk:'Компанію ліквідовано: операційна діяльність припинена, результат компанії в оцінці — 0. Особисті роботи (пакети, тренажери, звіти) тривають і оцінюються.'}[q.risk];
 const todo=q.risk==='low'||q.risk==='od'||q.risk==='next'?`<div class="small" style="margin-top:8px"><b>Що можна зробити:</b> ${lim>0?`взяти банківський кредит (доступно до ${kU(lim)}) у розділі «Рішення відділів»; `:''}зменшити зміну персоналу; прибрати інвестиції та зайвий маркетинг; перевірити, чи якість відповідає ціні; у подіях обирати варіанти без великих разових витрат.</div>`:q.risk==='san'?`<div class="small" style="margin-top:8px"><b>Що потрібно:</b> подати план оздоровлення в розділі «Роботи для куратора» (без нього тиждень не закрити) і скоротити витрати так, щоб тиждень дав плюс.</div>`:'';
 return `<div class="card"><div class="card-h"><div><div class="eyebrow">Ліквідність і борг · ставки за умовою</div><h2 style="margin-top:4px">Чи вистачить грошей</h2></div><span class="chip ${chip[0]}">${chip[1]}</span></div>
  <div class="ddl"><div>Гроші на рахунку</div><div>${money(st.cash)}</div>
   <div>Овердрафт (${p0(FIN.odRate)} за місяць компанії)</div><div>${money(q.od)} із ліміту ${money(q.ODL)}${q.od>q.ODL?` · прострочено ${money(q.od-q.ODL)}`:''}</div>
   <div>Банківський кредит (${p0(FIN.loanRate)} за місяць компанії)</div><div>${q.debt>0?`залишок ${money(q.debt)} · наступний платіж ${money(q.np[0]+q.np[1])}`:'немає'}</div>
   ${q.risk==='bk'?'':`<div>Обов’язкові платежі наступного тижня</div><div>${money(q.oblig)} <span class="muted">(оренда, зарплата, кредит)</span></div>
   <div>Запас ліквідності</div><div>${cov} обов’язкових платежів</div>`}</div>
  ${warn?`<div class="${q.risk==='low'||q.risk==='od'?'insight miss':'err'}" style="margin-top:10px">${warn}</div>`:''}${todo}
 </div>`;
}
function insolvBanner(st,T){
 const s=stageOf(st);if(!s)return'';
 return s===2?`<div class="err" style="margin-bottom:12px"><b>Компанію ліквідовано.</b> Після ${FIN.sanWeeks} і більше тижнів санації борг за овердрафтом залишався вищим за ліміт і перестав скорочуватися. Рішення й події більше не діють, у рейтингу курсу компанія позначена як банкрут. Робочі пакети рахуються на даних останнього робочого місяця; у звіті ролі проаналізуйте причини банкрутства.</div>`
  :`<div class="err" style="margin-bottom:12px"><b>Санація: компанія під зовнішнім управлінням.</b> Борг за овердрафтом ${kU(st.od)} за ліміту ${kU(odLimit(T))}. ${planDone(st)?'План оздоровлення подано.':'Щоб закрити тиждень, подайте план оздоровлення в розділі «Роботи для куратора».'} Штраф до результату команди — ${FIN.sanPenalty} балів.</div>`;
}
function loanCard(team,T,st){
 const stage=stageOf(st),lim=creditLimit(st,T),ri=respIdx(team,['fin','dir']),ed=canEdit(ri)&&stage===0,amt=Math.min(+S.dec.loan||0,lim),debt=debtOf(st),ODL=odLimit(T);
 const opts=[...new Set([0,Math.max(10000,Math.round(lim*0.25/10000)*10000),Math.round(lim*0.5/10000)*10000,lim].filter(x=>x<=lim))];
 const sch=amt>0?loanSchedule(amt):null,act=st.loans.filter(l=>l.left>0);
 return `<div class="card dec">
  <div class="row" style="justify-content:space-between;align-items:flex-start"><h3 class="grow">Банківський кредит</h3><span class="chip ${amt>0?'warn':''}">${amt>0?'буде отримано '+kU(amt):'не береться'}</span></div>
  ${whoHtml(team,ri)}
  <p class="small muted">За умовою: ставка ${p0(FIN.loanRate)} за місяць компанії на залишок боргу, строк ${FIN.loanTerm} місяців компанії, рівні частини тіла, перший платіж — у наступному місяці. Гроші надходять під час закриття цього тижня. Ліміт — ${Math.round(FIN.loanLimitShare*100)}% стартового капіталу (${Math.round((FIN.loanLimitShare+FIN.loanBonus)*100)}%, якщо останні три місяці разом прибуткові; менше — за рейтингу нижче 3,0 чи великого овердрафту) мінус чинний борг. Зараз доступно: <b>${kU(lim)}</b>.</p>
  ${stage>0?'<div class="insight miss">Під час санації та після ліквідації нові кредити не видаються.</div>':lim<=0?'<div class="insight miss">Кредитний ліміт вичерпано.</div>':`<div class="segrow ${opts.length===4?'wrap4':''}" style="--n:${opts.length}" role="radiogroup" aria-label="Сума кредиту">${opts.map(o=>`<button type="button" class="seg ${amt===o?'on':''}" data-act="loan" data-v="${o}" ${ed?'':'disabled'} role="radio" aria-checked="${amt===o}">${o?fmtN(o/1000)+' тис. грн':'Не брати'}</button>`).join('')}</div>`}
  ${sch?`<div class="tbl-wrap" style="margin-top:10px"><table><thead><tr><th class="l">Після отримання</th><th>Тіло, грн</th><th>Відсотки, грн</th><th>Разом, грн</th><th>Залишок, грн</th></tr></thead><tbody>${sch.map(r=>`<tr><td class="l">${r.i}-й місяць</td><td>${fmtN(r.pr)}</td><td>${fmtN(r.it)}</td><td>${fmtN(r.pay)}</td><td>${fmtN(r.bal)}</td></tr>`).join('')}</tbody></table></div><p class="small muted" style="margin-top:6px">Переплата за весь строк — ${money(sch.reduce((a,r)=>a+r.it,0))}.</p>`:''}
  ${act.length?`<div class="ddl" style="margin-top:10px"><div>Чинний борг за кредитами</div><div>${money(debt)}</div><div>Наступний платіж</div><div>${money(nextPay(st)[0])} тіла + ${money(nextPay(st)[1])} відсотків</div><div>Залишилось платежів</div><div>${Math.max(...act.map(l=>l.left))}</div></div>
   <div class="dec-foot"><span class="small muted">Дострокове погашення: під час закриття тижня кредит гаситься з грошей понад резерв на оренду й зарплату, без комісії.</span><button class="btn sm ${S.dec.repay?'primary':''}" data-act="repay" aria-pressed="${!!S.dec.repay}" ${canEdit(ri)&&stage<2?'':'disabled'}>${S.dec.repay?'Дострокове погашення ввімкнено':'Погасити достроково'}</button></div>`:''}
  <p class="small muted" style="margin-top:8px">Овердрафт: якщо під час закриття тижня грошей не вистачає, розрив автоматично покривається овердрафтом під ${p0(FIN.odRate)} за місяць компанії, ліміт ${kU(ODL)} (${Math.round(FIN.odLimitShare*100)}% стартового капіталу). Кредит дешевший за овердрафт.</p>
 </div>`;
}
const RULES_HTML=T=>`<div class="rubric">
 <div><b style="min-width:92px">Овердрафт</b><span>Касовий розрив під час закриття тижня покривається автоматично. За умовою: ${p0(FIN.odRate)} за місяць компанії, ліміт — ${Math.round(FIN.odLimitShare*100)}% стартового капіталу${T?` (${kU(odLimit(T))})`:''}. Вільні гроші спершу гасять овердрафт.</span></div>
 <div><b style="min-width:92px">Кредит</b><span>Бере фінансова роль (або директор) у «Рішеннях відділів». За умовою: ${p0(FIN.loanRate)} за місяць компанії на залишок, ${FIN.loanTerm} місяців, перший платіж наступного місяця, дострокове погашення без комісії. Ліміт — ${Math.round(FIN.loanLimitShare*100)}–${Math.round((FIN.loanLimitShare+FIN.loanBonus)*100)}% стартового капіталу мінус чинний борг.</span></div>
 <div><b style="min-width:92px">Санація</b><span>Починається, коли борг за овердрафтом перевищив ліміт. Обмеження: без інвестицій і нових кредитів, маркетинг не більше ${fmtN(BUDGETS[FIN.sanBudgetMax]/1000)} тис. грн; обов’язковий план оздоровлення; мінус ${FIN.sanPenalty} балів до результату команди. Вихід — борг за овердрафтом не вищий за ${Math.round(FIN.recoverShare*100)}% ліміту.</span></div>
 <div><b style="min-width:92px">Ліквідація</b><span>Якщо після ${FIN.sanWeeks} тижнів санації борг за овердрафтом вищий за ліміт і за останній тиждень не зменшився (перевіряється щотижня, починаючи з другого тижня санації). Компанія припиняє роботу, результат компанії в оцінці — 0, у рейтингу — «банкрут». Особисті роботи тривають до кінця практики й оцінюються.</span></div>
</div>`;
function navItems(){if(!S||!S.L)return[];const L=S.L,team=myTeam(),st=L.states[team.id],level=L.course,done=st.month>=TOTAL_MONTHS,live=!done&&stageOf(st)<2;const myPk=done?null:S.pk[S.viewAs];const myDecs=!live?[]:activeDecs(level).filter(k=>decResp(team,k)===S.viewAs&&!S.sub[k]);const myEvs=!live?[]:L.cur.filter(id=>evResp(team,EV[id])===S.viewAs&&S.evc[id]==null);return[['overview','Моя компанія','home'],['pkg','Робочий пакет','clip',myPk&&!myPk.submitted?1:0],['decisions','Рішення відділів','sliders',myDecs.length],['events','Події тижня','bolt',myEvs.length],['works','Роботи для куратора','clip',worksBadge(team,st,done)],['team','Команда і ролі','users'],['reports','Звіти','chart'],['grade','Моя оцінка','star'],['league','Рейтинг курсу','trophy'],['schedule','Графік практики','cal']];}
function worksBadge(team,st,done){const ui=team.members.findIndex(m=>m.user);if(ui<0||S.viewAs!==ui)return 0;let n=0;const W=S.work||{};
 if(!done)wkKeysFor(S,ui,st.month,st).forEach(k=>{const s=wkStatus(W[k]).k;if(s==='none'||s==='draft')n++;});
 Object.keys(W).forEach(k=>{if(W[k].status==='returned')n++;});return n;}
function appBody(tab){
 S.tab=tab||S.tab||'overview';
 const L=S.L,team=myTeam(),T=TYPES[team.type],st=normState(L.states[team.id]),level=L.course,done=st.month>=TOTAL_MONTHS,stage=stageOf(st);
 const me=team.members[S.viewAs]||team.members[0];
 const nav=navItems(),tabs=nav.map(t=>t[0]==='overview'?['overview','Огляд','home']:t);
 const viewOpts=team.members.map((m,i)=>`<option value="${i}" ${i===S.viewAs?'selected':''}>${esc(m.name)}${m.user?' (ви)':''} · ${esc(roleLabel(team.type,m))}</option>`).join('');
 const title=tabs.find(t=>t[0]===S.tab)||tabs[0];
 const body={overview:tabOverview,pkg:tabPkg,decisions:tabDecisions,events:tabEvents,works:tabWorks,team:tabTeam,reports:tabReports,grade:tabGrade,league:tabLeague,schedule:tabSchedule}[S.tab]||tabOverview;
 return `<div class="pr-head"><div class="pr-co"><div class="ic">${icon(T.icon,20)}</div><div style="min-width:0"><b>${esc(team.name)}</b><span>${T.name} · ${level} курс · ${LEVELS[level].title}${stage===2?' · банкрут':stage===1?' · санація':''}</span></div></div>
  <div class="pr-tools"><label for="viewas" class="small muted">Переглядаєте як</label><select class="input" id="viewas" data-act-change="viewas" style="min-height:38px;font-size:13px;max-width:280px">${viewOpts}</select><button type="button" class="toggle ${S.demoAll?'on':''}" data-act="demo" aria-pressed="${S.demoAll}"><span class="sw"></span><span>Демо: рішення за всю команду</span></button></div></div>
  <div class="top">
   <div><div class="eyebrow">${done?'Тиждень 8 · підсумковий звіт і захист':`Тиждень ${st.month+1} з 8 · ${MONTHS[st.month]}`}</div><h1 style="margin-top:4px">${title[1]}</h1></div>
   <div class="monthbox">
    <div class="dots" aria-label="Прогрес тижнів">${MONTHS.map((_,i)=>`<i class="${i<st.month?'done':i===st.month?'cur':''}"></i>`).join('')}</div>
    ${done?'':closeButton(team,st,level)}
   </div>
  </div>
  ${insolvBanner(st,T)}
  ${body(team,T,st,level,me,done)}
  ${S.report?reportModal(team,T,st):''}`;
}
function closeState(team,level){
 const st=S.L.states[team.id],stage=stageOf(st),frozen=stage===2;
 const decs=frozen?[]:activeDecs(level),subs=decs.filter(k=>S.sub[k]).length,cur=frozen?[]:S.L.cur,evs=cur.filter(id=>S.evc[id]!=null).length;
 const pks=team.members.filter((_,i)=>S.pk[i]&&S.pk[i].submitted).length,planOk=!planNeeded(st)||planDone(st);
 return{decs:decs.length,subs,evN:cur.length,evs,pks,pkN:team.members.length,planOk,frozen,ready:frozen||((S.demoAll||subs===decs.length)&&evs===cur.length&&planOk)};
}
function closeButton(team,st,level){
 const c=closeState(team,level);
 return `<span class="small muted num">Пакети ${c.pks}/${c.pkN}${c.frozen?'':` · Рішення ${c.subs}/${c.decs} · Події ${c.evs}/${c.evN}`}${planNeeded(st)?` · План оздоровлення ${c.planOk?'подано':'не подано'}`:''}</span><button class="btn primary" data-act="close" ${c.ready?'':'disabled'} title="${c.ready?'':(c.evs<c.evN?'Спершу оберіть відповідь у кожній події тижня':!c.planOk?'Спершу подайте план оздоровлення в розділі «Роботи для куратора»':'Спершу подайте всі рішення відділів')}">${c.frozen?'Завершити тиждень':'Закрити '+MONTHS[st.month].toLowerCase()}</button>`;
}
function kpiRow(st){
 const h=st.history,last=h[h.length-1],repD=last?last.repDelta:0,owe=(st.od||0)+debtOf(st),dl=last?(st.cash-(st.od||0))-(last.cashBefore-(last.odBefore||0)):0;
 return `<div class="kpis">
  <div class="kpi"><div class="l">Гроші на рахунку</div><div class="v">${kU(st.cash)}</div><div class="d ${owe>0||dl<0?'down':'up'}">${owe>0?'борг '+kU(owe)+(st.od>0?' (овердрафт '+kU(st.od)+')':''):last?sK(st.cash-last.cashBefore)+' за місяць':'стартовий капітал'}</div></div>
  <div class="kpi"><div class="l">Прибуток за минулий місяць</div><div class="v ${last&&last.profit<0?'down':''}">${last?kU(last.profit):'—'}</div><div class="d muted">${last?'накопичено '+kU(st.cumProfit):'з’явиться після закриття місяця'}</div></div>
  <div class="kpi"><div class="l">Рейтинг клієнтів</div><div class="v">${r2(st.rep)} <span style="color:var(--brass)">★</span></div><div class="d ${repD<-0.004?'down':'up'}">${last?sgn2(repD)+' за місяць':'стартовий рівень'}</div></div>
  <div class="kpi"><div class="l">Мораль персоналу</div><div class="v">${Math.round(st.morale)}%</div><div style="height:6px;border-radius:999px;background:var(--line,rgba(127,127,127,.25));margin-top:10px;overflow:hidden" role="img" aria-label="Мораль персоналу ${Math.round(st.morale)}%"><i style="display:block;height:6px;width:${Math.round(st.morale)}%;background:${st.morale<50?'var(--bad)':'var(--accent)'}"></i></div></div>
 </div>`;
}
const legend=()=>`<div class="legend"><span><i style="background:var(--accent-soft);border:1px solid var(--accent)"></i>Виручка</span><span><i style="background:var(--brass)"></i>Прибуток</span></div>`;
const anaList=a=>`<div class="ana">${a.map(x=>`<div class="${x.t}"><i></i><span>${esc(x.s)}</span></div>`).join('')}</div>`;

function weekItems(team,T,st,level,i){
 const L=S.L,m=team.members[i],p=S.pk[i],live=stageOf(st)<2;
 const items=[{ok:!!(p&&p.submitted),t:'Робочий пакет: '+(p?lc(p.title):''),s:p&&p.submitted?'Здано · '+balW(p.score):'Тренажер ролі · дедлайн у середу',act:'tab',v:'pkg',h:'6–8 год'}];
 if(live)activeDecs(level).filter(k=>decResp(team,k)===i).forEach(k=>items.push({ok:!!S.sub[k],t:'Рішення: '+decMeta(k,T,st).title.toLowerCase(),s:S.sub[k]?'Подано':'Дедлайн у середу',act:'tab',v:'decisions',h:'1 год'}));
 if(live)L.cur.filter(id=>evResp(team,EV[id])===i).forEach(id=>items.push({ok:S.evc[id]!=null,t:'Подія: '+EV[id].title,s:S.evc[id]!=null?'Відповідь обрано':'Обговорити на нараді',act:'tab',v:'events',h:''}));
 /* тренажер і звіт ролі подаються текстом і оцінюються куратором; у колег із демо-команди цих робіт немає */
 const wi=(kind,title,hrs)=>{const it=m.user?(S.work||{})[wkKey(i,st.month,kind)]:null,sx=wkStatus(it);items.push({ok:sx.k==='submitted'||sx.k==='graded',t:title,s:m.user?esc(sx.label)+(sx.k==='none'||sx.k==='draft'?' · подайте куратору до п’ятниці':''):'Подається з власного кабінету · оцінює куратор',act:'tab',v:'works',h:hrs});};
 wi('tr','Тематичний тренажер: «'+trainerFor(m,st.month)+'»','3 год');
 wi('rep',live?'Звіт ролі за тиждень':'Звіт ролі: аналіз причин банкрутства','1–2 год');
 if(planNeeded(st)&&m.user)items.push({ok:planDone(st),t:'План оздоровлення компанії',s:planDone(st)?'Подано · очікує оцінки куратора':'Обов’язковий під час санації: без нього тиждень не закрити',act:'tab',v:'works',h:'1–2 год'});
 return items;
}
function tabOverview(team,T,st,level,me,done){
 const L=S.L,i=S.viewAs;
 if(done){
  const rows=leagueRows(L),place=rows.findIndex(r=>r.t.id===team.id)+1;
  return `${kpiRow(st)}
  <div class="card"><div class="eyebrow">Тиждень 8</div><h2 style="margin-top:6px">Сім віртуальних місяців позаду</h2>
   <p class="muted" style="margin-top:8px;max-width:64ch">Компанія ${esc(team.name)} посіла ${place} місце з ${rows.length} у рейтингу ${level} курсу. Залишився підсумковий звіт і онлайн-захист перед комісією: кожна роль презентує свої рішення і їхні наслідки. Далі літня практика на реальних підприємствах.${stageOf(st)===2?' Компанію ліквідовано, тому результат компанії в оцінці — 0; особисті роботи оцінюються як завжди.':''} Підсумкова оцінка стане остаточною, коли куратор оцінить усі подані роботи.</p>
   <div class="row" style="margin-top:14px"><button class="btn primary" data-act="tab" data-v="grade">Моя оцінка</button><button class="btn" data-act="tab" data-v="works">Роботи для куратора</button><button class="btn" data-act="tab" data-v="league">Рейтинг курсу</button><button class="btn ghost" data-act="restart">Почати практику заново</button></div></div>
  <div class="card"><div class="card-h"><h2>Виручка і прибуток</h2>${legend()}</div>${chartSVG(st.history)}</div>`;
 }
 const items=weekItems(team,T,st,level,i);
 const c=closeState(team,level);
 const last=st.history[st.history.length-1];
 return `${st.month===0?`<div class="card soft"><div class="row" style="justify-content:space-between;align-items:flex-start"><div class="grow"><div class="eyebrow">Старт компанії</div><h2 style="margin-top:6px">${esc(team.name)} відкривається в січні</h2><p class="muted" style="margin-top:6px;max-width:70ch">Стартовий капітал ${kU(T.startCash)}, команда з ${team.members.length} студентів із ${(k=>k+' '+plural(k,['програми','програм','програм']))(new Set(team.members.map(m=>m.prog)).size)}. Щотижня кожна роль отримує свій робочий пакет: від його якості залежить, як спрацюють рішення команди. У п’ятницю система закриває місяць компанії.</p></div><span class="chip acc">${level} курс · ${LEVELS[level].title}</span></div></div>`:''}
 ${kpiRow(st)}
 ${finCard(team,T,st)}
 <div class="grid2">
  <div class="card"><div class="card-h"><div><div class="eyebrow">${esc(me.name)} · ${esc(roleLabel(team.type,me))}</div><h2 style="margin-top:4px">Ваш тиждень, близько 18 годин</h2></div><span class="chip prog" title="${esc(PROG[me.prog].name)}">${PROG[me.prog].short}</span></div>
   <div class="todo">${items.map(x=>`<div class="todo-i"><button class="tick ${x.ok?'ok':''}" data-act="${x.act}" data-v="${x.v}" ${x.act==='task'&&!canEdit(i)?'disabled':''} aria-label="${esc(x.t)}">${x.ok?icon('check',14):''}</button><div class="grow"><b>${esc(x.t)}</b><span>${x.s}</span></div>${x.h?`<span class="hrs" style="color:var(--ink2)">${x.h}</span>`:''}</div>`).join('')}</div>
  </div>
  <div class="card"><div class="card-h"><div><div class="eyebrow">Хід тижня</div><h2 style="margin-top:4px">${MONTHS[st.month]}: здано ${c.pks} з ${c.pkN} пакетів</h2></div></div>
   <div class="cycle">
    <div class="cyc"><b>ПН</b><span>Брифінг і дані для ролей</span></div>
    <div class="cyc"><b>СР</b><span>Пакети і рішення відділів</span></div>
    <div class="cyc"><b>ЧТ</b><span>Нарада команди онлайн</span></div>
    <div class="cyc"><b>ПТ</b><span>Закриття місяця, звіти ролей кураторові</span></div>
   </div>
   ${last?`<div style="margin-top:16px"><div class="eyebrow" style="margin-bottom:8px">Висновки з ${MONTHS_GEN[last.month]}</div>${anaList(last.analysis)}</div>`:`<p class="muted small" style="margin-top:16px">Після закриття першого місяця тут з’являться висновки про рішення команди.</p>`}
  </div>
 </div>
 <div class="card"><div class="card-h"><h2>Виручка і прибуток по місяцях</h2>${legend()}</div>${chartSVG(st.history)}</div>`;
}

function renderQs(p,qs,key,graded,ed,pref){
 return qs.map((q,qi)=>{
  const a=(p[key]||{})[qi],g=graded?gradeQ(q,a):null;
  let inp;
  if(q.t==='num')inp=`<input class="input" id="${pref}-${qi}" inputmode="decimal" data-pq="${qi}" data-pqk="${key}" value="${esc(a==null?'':a)}" ${ed?'':'disabled'} placeholder="Ваша відповідь">`;
  else inp=`<div class="chs">${q.options.map((o,oi)=>{let cls=a===oi?'on':'';if(graded){cls=oi===q.ans?'right':a===oi?'wrong':'';}return `<button type="button" class="ch ${cls}" data-act="pq-ch" data-g="${key}" data-k="${qi}" data-v="${oi}" ${ed?'':'disabled'}>${esc(o)}</button>`;}).join('')}</div>`;
  const res=graded?`<div class="res">${g===1?'<span class="ok">Правильно</span>':g===0.5?'<span class="half">Майже: похибка більша за допустиму</span>':'<span class="no">Помилка</span>'}${g<1?`<span class="muted">Правильна відповідь: ${q.t==='num'?fmtD(q.ans,2):esc(q.options[q.ans])}</span>`:''}</div>`:'';
  return `<div class="pq"><div class="lbl"><i style="color:var(--ink2)">${qi+1}.</i>${esc(q.label)}</div>${inp}${res}</div>`;
 }).join('');
}
function pkgTeamList(team,i){return team.members.map((m,j)=>{const pp=S.pk[j];return `<button class="pk-it ${j===i?'on':''}" data-act="viewas-btn" data-v="${j}"><span class="av ${m.user?'me':''}">${initials(m.name)}</span><span style="min-width:0;flex:1"><b>${esc(roleLabel(team.type,m))}</b><span>${esc(m.name)}${m.user?' (ви)':''}</span></span>${pp&&pp.submitted?scoreChip(pp.score):'<span class="chip warn">в роботі</span>'}</button>`;}).join('');}
function tabPkgFull(team,T,st,me,i,p){
 const ed0=canEdit(i)&&!p.submitted,part=p.part||0,ed=ed0&&!p.done[part];
 const sc=p.submitted?scoreFull(p):null;
 const stepper=`<div class="parts">${FIN_PARTS.map((x,k)=>`<button type="button" class="part ${part===k?'on':''}" data-act="fp-part" data-v="${k}"><span class="k">ЧАСТИНА ${k+1} · ${x[1]}</span><b>${x[0]}</b><span class="st"><span>${x[2]}</span>${p.done[k]?`<span class="chip good">${icon('check',12)}${sc?' '+sc.parts[k]+'/'+sc.max[k]:''}</span>`:'<span class="chip warn">у роботі</span>'}</span></button>`).join('')}</div>`;
 let body='';
 if(part===0){
  body=`<div class="grid2">
   <div class="card"><div class="eyebrow" style="margin-bottom:10px">Дані для роботи</div><div class="ddl">${p.data.map(r=>`<div>${esc(r[0])}</div><div>${esc(r[1])}</div>`).join('')}</div></div>
   <div class="card"><div class="eyebrow" style="margin-bottom:6px">Розрахунки · 40 балів</div>${renderQs(p,p.qs,'answers',!!p.done[0],ed,'fq1-'+st.month)}
    ${S.pkErr&&part===0?`<div class="err" style="margin-top:8px">${esc(S.pkErr)}</div>`:''}
    ${ed?`<div class="row" style="margin-top:12px"><button class="btn primary" data-act="fp-check" data-v="0">Перевірити розрахунки</button><span class="small muted">Після перевірки відповіді фіксуються</span></div><p class="small muted" style="margin-top:8px">Числа можна вводити з комою. Гроші округлюйте до гривні, відсотки й дробові показники — до десятих.</p>`:''}
   </div></div>`;
 }else if(part===1){
  const graded=!!p.done[1],cells=cfCells(p);
  const cell=(k,ph)=>{const c=cells.find(x=>x.key===k),a=p.cfAns[k];let cls='';if(graded)cls=gradeQ(c.q,a)===1?'right':'wrong';return `<input inputmode="decimal" class="${cls}" data-cf="${k}" value="${esc(a==null?'':a)}" ${ed?'':'disabled'} placeholder="${ph}" aria-label="${k}">`;};
  const len=(p.memo||'').trim().length;
  body=`<div class="card"><div class="card-h"><div><div class="eyebrow">Таблиця · 15 балів</div><h2 style="margin-top:4px">Бюджет руху грошових коштів на ${MONTHS[st.month].toLowerCase()}</h2></div><span class="chip num">старт ${money(p.cf.start)}</span></div>
   <p class="small muted" style="margin-bottom:10px">Заповніть надходження, виплати і залишок на кінець кожного тижня за правилами з частини 1. Залишок = попередній залишок + надходження − виплати.</p>
   <div class="cft"><table><thead><tr><th class="l">Тиждень</th><th>Надходження, грн</th><th>Виплати, грн</th><th>Залишок на кінець, грн</th></tr></thead><tbody>
   ${p.cf.rows.map((r,k)=>`<tr><td class="l">${k+1}-й${k===0?' · оренда, маркетинг':k===1||k===3?' · зарплата ½':''}</td><td>${cell(k+'-in','надходження')}</td><td>${cell(k+'-out','виплати')}</td><td>${cell(k+'-bal','залишок')}</td></tr>`).join('')}
   </tbody></table></div>
   ${graded?`<div class="note" style="margin-top:12px">Правильні значення: ${p.cf.rows.map((r,k)=>`${k+1}-й тиждень ${fmtN(r.inflow)} / ${fmtN(r.out)} / ${fmtN(r.bal)}`).join('; ')}.</div>`:''}
  </div>
  <div class="grid2">
   <div class="card"><div class="eyebrow" style="margin-bottom:8px">Пояснювальна записка для директора · оцінює куратор, 0–100</div>
    <textarea class="ta" id="memo-${st.month}" data-memo="1" ${ed?'':'disabled'} placeholder="Опишіть, коли залишок найнижчий і чому, чи потрібен овердрафт, що пропонуєте змінити в оплатах, і який висновок для директора. Щонайменше 400 знаків.">${esc(p.memo||'')}</textarea>
    <div class="cnt-ch num">${len} / 400 знаків</div>
    ${graded?`<div class="insight" style="margin-top:8px"><b>${esc(wkStatus((S.work||{})[wkKey(i,st.month,'memo')]).label)}.</b> Автоматичних балів за записку немає: її оцінює куратор практики. До оцінювання текст можна уточнити в розділі «Роботи для куратора».</div>`:''}
    ${S.pkErr&&part===1?`<div class="err" style="margin-top:8px">${esc(S.pkErr)}</div>`:''}
    ${ed?`<div class="row" style="margin-top:12px"><button class="btn primary" data-act="fp-check" data-v="1">Здати документ</button></div>`:''}
   </div>
   <div class="card"><div class="eyebrow" style="margin-bottom:8px">Рубрика куратора · разом 0–100</div><div class="rubric">${WK.memo.rubric.map(r=>`<div><b style="min-width:52px">${r[0]}</b><span>${r[1]}</span></div>`).join('')}</div><p class="small muted" style="margin-top:10px">Куратор практики перевіряє записки раз на тиждень. Оцінка й коментар з’являться в розділі «Роботи для куратора»; до того записка має стан «не оцінено».</p></div>
  </div>`;
 }else if(part===2){
  const costRole=team.type==='retail'?'com':'chef';
  const costM=team.members.find(m=>m.role===costRole),logM=team.members.find(m=>m.role==='log');
  const who=(m,fallback)=>m?`${esc(m.name)} · ${esc(roleLabel(team.type,m))}`:fallback;
  const reqCard=(k,m,fallback,subj,reply)=>`<div class="stack" style="gap:8px">
    <div class="msg"><span class="av">${m?initials(m.name):'К'}</span><div class="body"><b>Запит: ${subj}</b><span>Кому: ${who(m,fallback)}</span>${p.req[k]?'<p class="small muted">Надіслано в понеділок, 11:40</p>':''}</div>${!p.req[k]&&ed?`<button class="btn sm primary" data-act="fp-req" data-k="${k}">Надіслати запит</button>`:''}</div>
    ${p.req[k]?`<div class="msg reply"><span class="av me">${m?initials(m.name):'К'}</span><div class="body"><b>Відповідь${m?'':' керівника практики'}</b><p>${esc(reply)}</p><span>У демо колега відповідає одразу. У повній версії відповідь приходить, коли колега здасть свою частину пакета.</span></div></div>`:''}
   </div>`;
  const lvls=T.price.map((pr,k)=>({l:['Нижче ринку','Ринкова','Вище ринку'][k],s:money(pr)}));
  const len=(p.rec.text||'').trim().length;
  body=`<div class="card"><div class="eyebrow" style="margin-bottom:10px">Запити колегам · 5 балів</div>
    <p class="small muted" style="margin-bottom:12px">Без даних про собівартість і графік оплат постачальникам фінансовий план неповний. Надішліть запити колегам і дочекайтеся відповіді.</p>
    <div class="grid2">${reqCard('cost',costM,'керівник практики (ролі в команді немає)','собівартість одиниці продажу',p.colleagues.cost)}${reqCard('log',logM,'керівник практики (ролі в команді немає)','графік оплат постачальникам',p.colleagues.log)}</div>
   </div>
   <div class="card"><div class="eyebrow" style="margin-bottom:8px">Рекомендація команді щодо ціни · вибір рівня — 5 балів, обґрунтування оцінює куратор</div>
    <p class="small muted" style="margin-bottom:10px">Ваша рекомендація з’явиться в картці рішення «${esc(T.priceLabel)}» у розділі «Рішення відділів». Остаточне рішення після наради ухвалює роль, відповідальна за ціну.</p>
    <div class="segrow" style="--n:3" role="radiogroup" aria-label="Рекомендований рівень ціни">${lvls.map((o,k)=>`<button type="button" class="seg ${p.rec.level===k?'on':''}" data-act="fp-rec-level" data-v="${k}" ${ed?'':'disabled'} role="radio" aria-checked="${p.rec.level===k}">${o.l}<small>${o.s}</small></button>`).join('')}</div>
    <textarea class="ta" id="rec-${st.month}" data-rec="1" ${ed?'':'disabled'} style="margin-top:10px;min-height:110px" placeholder="Обґрунтуйте: як ціна впливає на точку беззбитковості й залишок грошей, що показує собівартість із відповіді колеги. Щонайменше 200 знаків.">${esc(p.rec.text||'')}</textarea>
    <div class="cnt-ch num">${len} / 200 знаків</div>
    ${S.pkErr&&part===2?`<div class="err" style="margin-top:8px">${esc(S.pkErr)}</div>`:''}
    ${ed?`<div class="row" style="margin-top:12px"><button class="btn primary" data-act="fp-check" data-v="2">Надіслати рекомендацію команді</button></div>`:(p.done[2]?'<div class="insight" style="margin-top:10px"><b>Надіслано.</b> Команда бачить рекомендацію в рішенні про ціну. Обґрунтування передано кураторові практики: оцінка й коментар з’являться в розділі «Роботи для куратора».</div>':'')}
   </div>`;
 }else{
  const b=p.banks;
  body=`<div class="grid2">
   <div class="card"><div class="eyebrow" style="margin-bottom:10px">Пропозиції банків щодо овердрафту</div>
    <p class="small muted" style="margin-bottom:10px">Компанії може знадобитися ${money(b.need)} на ${b.days} днів. Вартість = сума × ставка × дні ÷ 365 + комісія за відкриття від ліміту.</p>
    <div class="tbl-wrap"><table style="min-width:420px"><thead><tr><th class="l">Банк</th><th>Ставка річних</th><th>Комісія за відкриття</th><th>Ліміт</th></tr></thead><tbody>${b.list.map(x=>`<tr><td class="l">${x.n}</td><td>${x.rate}%</td><td>${x.fee?x.fee.toString().replace('.',',')+'% від ліміту':'немає'}</td><td>${money(x.limit)}</td></tr>`).join('')}</tbody></table></div></div>
   <div class="card"><div class="eyebrow" style="margin-bottom:6px">Аналіз · 15 балів</div>${renderQs(p,p.qs4,'ans4',!!p.done[3],ed,'fq4-'+st.month)}
    ${S.pkErr&&part===3?`<div class="err" style="margin-top:8px">${esc(S.pkErr)}</div>`:''}
    ${ed?`<div class="row" style="margin-top:12px"><button class="btn primary" data-act="fp-check" data-v="3">Перевірити</button></div>`:''}
   </div></div>`;
 }
 const allDone=[0,1,2,3].every(k=>p.done[k]);
 return `<div class="card">
  <div class="pk-head"><div class="stack" style="gap:8px">
   <div class="eyebrow">${esc(roleLabel(team.type,me))} · ${esc(me.name)}${me.user?' (ви)':''}</div>
   <h2>${esc(p.title)}</h2>
   <p class="muted" style="max-width:72ch">${esc(p.brief)}</p>
   <div class="row"><span class="chip acc">${MONTHS[st.month]}</span><span class="chip">повний обсяг: 6–8 год</span><span class="chip">дедлайн середа, 18:00</span></div>
  </div>
  ${p.submitted?`<div class="pk-score"><div class="small muted">Бал пакета (авто)</div><div class="big ${p.score>=80?'up':p.score<60?'down':''}" style="${p.score>=60&&p.score<80?'color:var(--warn)':''}">${p.score}</div><div class="small muted">зі 100</div></div>`:''}
  </div>
  <div style="margin-top:14px">${stepper}</div>
  ${sc?`<div class="breakdown" style="margin-top:10px">${FIN_PARTS.map((x,k)=>`<div>${x[0]}<b>${sc.parts[k]} / ${sc.max[k]}</b></div>`).join('')}</div>`:''}
 </div>
 <div class="card"><div class="eyebrow" style="margin-bottom:10px">Як пакет впливає на компанію</div>
  <p>${esc(PKG_EFFECT.fin)}</p>
  ${p.submitted?`<div class="insight" style="margin-top:10px"><b>Ваш результат:</b> ${esc(effectPreview('fin',p.score/100))}</div>`:`<p class="small muted" style="margin-top:8px">Автоматичний бал пакета складається з розрахунків, таблиці, запитів і аналізу банків; записку й обґрунтування рекомендації оцінює куратор окремо. Незданий пакет — 0 балів і найгірший сценарій для фінансів компанії.</p>`}
 </div>
 ${body}
 ${!p.submitted?`<div class="card soft"><div class="row" style="justify-content:space-between"><div class="grow"><b>${allDone?'Усі частини виконано.':'Здати пакет можна після всіх чотирьох частин.'}</b><div class="small muted">Виконано ${[0,1,2,3].filter(k=>p.done[k]).length} з 4</div></div>${ed0?`<button class="btn primary" data-act="pkg-submit" ${allDone?'':'disabled'}>Здати пакет</button>`:''}</div></div>`:''}
 <div class="card"><div class="card-h"><div><div class="eyebrow">Пакети команди</div><h2 style="margin-top:4px">Що здано цього тижня</h2></div></div><div class="pk-list">${pkgTeamList(team,i)}</div></div>`;
}
function tabPkg(team,T,st,level,me,done){
 if(done)return `<div class="card"><p class="muted">Практику завершено. Результати пакетів — у розділі «Моя оцінка».</p></div>`;
 const i=S.viewAs,p=S.pk[i],ed=canEdit(i)&&!p.submitted&&!p.auto&&(me.user||S.demoAll);
 const role=p.role;
 if(p.full)return tabPkgFull(team,T,st,me,i,p);
 const finIdx=team.members.findIndex(m=>m.user&&pkgRole(m)==='fin');
 const qhtml=renderQs(p,p.qs,'answers',p.submitted,ed,'pq-'+i+'-'+st.month);
 const banner=`<div class="card soft"><div class="row" style="justify-content:space-between"><div class="grow"><b>У демо ця роль має скорочений пакет із кількох запитань.</b><div class="small muted">Повний тижневий обсяг на 6–8 годин показано на прикладі фінансової ролі.</div></div>${finIdx>=0?`<button class="btn sm" data-act="viewas-btn" data-v="${finIdx}">Відкрити повний пакет</button>`:'<span class="small muted">Повний пакет відкривається у профілі програми «Фінанси, банківська справа та страхування».</span>'}</div></div>`;
 const list=pkgTeamList(team,i);
 const _unused=team.members.map((m,j)=>{const pp=S.pk[j];return `<button class="pk-it ${j===i?'on':''}" data-act="viewas-btn" data-v="${j}"><span class="av ${m.user?'me':''}">${initials(m.name)}</span><span style="min-width:0;flex:1"><b>${esc(roleLabel(team.type,m))}</b><span>${esc(m.name)}${m.user?' (ви)':''}</span></span>${pp&&pp.submitted?scoreChip(pp.score):'<span class="chip warn">в роботі</span>'}</button>`;}).join('');
 return `${banner}<div class="card">
  <div class="pk-head"><div class="stack" style="gap:8px">
   <div class="eyebrow">${esc(roleLabel(team.type,me))} · ${esc(me.name)}${me.user?' (ви)':''}</div>
   <h2>${esc(p.title)}</h2>
   <p class="muted" style="max-width:70ch">${esc(p.brief)}</p>
   <div class="row"><span class="chip acc">${MONTHS[st.month]}</span><span class="chip">у повній версії 6–8 год</span>${p.auto?'<span class="chip">демо: пакет колеги здано автоматично</span>':''}</div>
  </div>
  ${p.submitted?`<div class="pk-score"><div class="small muted">Бал пакета</div><div class="big ${p.score>=80?'up':p.score<60?'down':''}" style="${p.score>=60&&p.score<80?'color:var(--warn)':''}">${p.score}</div><div class="small muted">зі 100</div></div>`:''}
  </div>
 </div>
 <div class="card"><div class="eyebrow" style="margin-bottom:10px">Як пакет впливає на компанію</div>
  <p>${esc(PKG_EFFECT[role])}</p>
  ${p.submitted?`<div class="insight" style="margin-top:10px"><b>Ваш результат:</b> ${esc(role==='law'?effectPreview('law',p.score/100):effectPreview(role,p.score/100))}</div>`:`<p class="small muted" style="margin-top:8px">Якщо пакет не здати до закриття місяця, роль отримує 0 балів і компанія працює за найгіршим сценарієм цієї ділянки.</p>`}
 </div>
 <div class="grid2">
  <div class="card"><div class="eyebrow" style="margin-bottom:10px">Дані для роботи</div>${p.data.length?`<div class="ddl">${p.data.map(r=>`<div>${esc(r[0])}</div><div>${esc(r[1])}</div>`).join('')}</div>`:'<p class="muted small">Дані наведені в самих запитаннях.</p>'}</div>
  <div class="card"><div class="eyebrow" style="margin-bottom:6px">Завдання</div>${qhtml}
   ${S.pkErr?`<div class="err" style="margin-top:8px">${esc(S.pkErr)}</div>`:''}
   ${ed?`<div class="row" style="margin-top:12px"><button class="btn primary" data-act="pkg-submit">Здати пакет</button><span class="small muted">Після здачі відповіді не змінюються</span></div><p class="small muted" style="margin-top:8px">Числа можна вводити з комою. Гроші округлюйте до гривні, відсотки й дробові показники — до десятих; кількість людей, товарів і замовлень — ціле число.</p>`:(!p.submitted&&!ed?`<p class="small muted" style="margin-top:10px">Пакет виконує ${esc(me.name)}.</p>`:'')}
  </div>
 </div>
 <div class="card"><div class="card-h"><div><div class="eyebrow">Пакети команди</div><h2 style="margin-top:4px">Що здано цього тижня</h2></div></div><div class="pk-list">${list}</div></div>`;
}

function whoHtml(team,idx){const m=team.members[idx];if(!m)return'';return `<div class="who"><span class="av ${m.user?'me':''}">${initials(m.name)}</span><span style="min-width:0">Відповідає <b>${esc(m.name)}</b>${m.user?' (ви)':''} · ${esc(roleLabel(team.type,m))}</span></div>`;}
function decInsight(team,k){
 const out=[];
 for(const role of DEC_PKG[k]){
  const i=team.members.findIndex(m=>pkgRole(m)===role);if(i<0)continue;
  const p=S.pk[i],who=lc(roleName(team.type,role));
  if(p&&p.full&&p.done[2]&&p.rec.level!=null){out.push(`<div class="insight"><b>Рекомендація з фінансового плану: ${esc(['нижче ринку','ринкова','вище ринку'][p.rec.level])}.</b> ${esc((p.rec.text||'').trim().slice(0,160))}${(p.rec.text||'').trim().length>160?'…':''}</div>`);if(p.submitted){const t=pkgInsight(p);if(t)out.push(`<div class="insight"><b>З пакета: ${esc(who)}.</b> ${esc(t[0].toUpperCase()+t.slice(1))}.</div>`);}}
  else if(p&&p.submitted){const t=pkgInsight(p);if(t)out.push(`<div class="insight"><b>З пакета: ${esc(who)}.</b> ${esc(t[0].toUpperCase()+t.slice(1))}.</div>`);}
  else out.push(`<div class="insight miss"><b>Пакет «${esc(who)}» ще не здано.</b> Рішення доведеться ухвалювати без цих даних.</div>`);
  break;
 }
 return out.join('');
}
function tabDecisions(team,T,st,level){
 if(st.month>=TOTAL_MONTHS)return `<div class="card"><p class="muted">Практику завершено. Історію рішень дивіться у звітах.</p></div>`;
 if(stageOf(st)===2)return `<div class="card"><p class="muted">Компанію ліквідовано: рішення відділів більше не ухвалюються. Історію рішень дивіться у звітах.</p></div>${finCard(team,T,st)}`;
 const hints=LEVELS[level].hints;
 const cards=DEC_ORDER.map(k=>{
  const meta=decMeta(k,T,st);
  if(DECISIONS[k].minLevel>level){const d0=meta.opts[defaultDec()[k]];return `<div class="card dec locked"><div class="row" style="justify-content:space-between"><h3>${esc(meta.title)}</h3><span class="chip">з ${DECISIONS[k].minLevel} курсу</span></div><p class="small muted">На вашому рівні це рішення зафіксоване умовами практики: ${esc(d0.l.toLowerCase())}${d0.s?' ('+esc(d0.s)+')':''}.</p></div>`;}
  const ri=decResp(team,k),ed=canEdit(ri)&&!S.sub[k],val=S.dec[k],n=meta.opts.length;
  return `<div class="card dec">
   <div class="row" style="justify-content:space-between;align-items:flex-start"><h3 class="grow">${esc(meta.title)}</h3>${S.sub[k]?`<span class="chip good">${icon('check',13)} Подано</span>`:`<span class="chip warn">Чернетка</span>`}</div>
   ${whoHtml(team,ri)}
   ${decInsight(team,k)}
   ${stageOf(st)===1&&(k==='invest'||k==='budget')?`<div class="insight miss"><b>Обмеження санації.</b> ${k==='invest'?'Інвестиції заборонено до виходу із санації.':'Маркетинговий бюджет — не більше '+fmtN(BUDGETS[FIN.sanBudgetMax]/1000)+' тис. грн.'}</div>`:''}
   <div class="segrow ${n===4?'wrap4':''}" style="--n:${n}" role="radiogroup" aria-label="${esc(meta.title)}">${meta.opts.map((o,j)=>`<button type="button" class="seg ${val===j?'on':''}" data-act="dec" data-k="${k}" data-v="${j}" ${!ed||o.dis?'disabled':''} ${o.dis?'style="opacity:.45"':''} role="radio" aria-checked="${val===j}">${esc(o.l)}${o.s?`<small>${esc(o.s)}</small>`:''}</button>`).join('')}</div>
   ${hints&&meta.hints[val]?`<div class="hint">${esc(meta.hints[val])}</div>`:''}
   <div class="dec-foot"><span class="small muted">${canEdit(ri)?(S.sub[k]?'Можна змінити до закриття місяця':'Подайте до середи, 18:00'):'Ви бачите рішення колеги'}</span>
    ${canEdit(ri)?(S.sub[k]?`<button class="btn sm" data-act="unsub" data-k="${k}">Змінити</button>`:`<button class="btn sm primary" data-act="sub" data-k="${k}">Подати рішення</button>`):''}</div>
  </div>`;}).join('');
 return `<p class="muted" style="max-width:74ch">Кожне рішення належить конкретній ролі й спирається на робочий пакет колеги: маркетинговий пакет підказує канал, фінансовий — точку беззбитковості. Якщо в розрахунках колеги є помилка, команда отримає неточні дані.${hints?' На вашому рівні під обраним варіантом є підказка.':''}</p><div class="dec-grid">${cards}${loanCard(team,T,st)}</div>`;
}

function tabEvents(team,T,st,level){
 if(st.month>=TOTAL_MONTHS)return `<div class="card"><p class="muted">Практику завершено.</p></div>`;
 if(stageOf(st)===2)return `<div class="card"><p class="muted">Компанію ліквідовано: нових подій немає. Попрацюйте з робочим пакетом і звітом ролі — аналізом причин банкрутства.</p></div>`;
 const hints=LEVELS[level].hints,sevName={bad:'Ризик',warn:'Виклик',good:'Можливість',info:'Рішення'};
 return `<p class="muted" style="max-width:72ch">Події ${MONTHS_GEN[st.month]} опубліковано в понеділок. Відповідь обирає відповідальна роль, але обговорити її варто з командою на нараді.</p>
 ${S.L.cur.map(id=>{const ev=EV[id],ri=evResp(team,ev),ed=canEdit(ri),sel=S.evc[id];
  return `<div class="card ev"><div class="ev-head"><span class="sev ${ev.sev}"></span><div class="grow stack" style="gap:8px">
   <div class="row"><span class="chip ${ev.sev==='info'?'acc':ev.sev}">${sevName[ev.sev]}</span><span class="learn">${esc(ev.learn)}</span></div>
   <h2>${esc(ev.title)}</h2><p class="muted">${esc(ev.text)}</p>${whoHtml(team,ri)}</div></div>
   <div class="opts" role="radiogroup" aria-label="${esc(ev.title)}">${ev.options.map((o,j)=>`<button type="button" class="opt ${sel===j?'on':''}" data-act="ev" data-k="${id}" data-v="${j}" ${ed?'':'disabled'} role="radio" aria-checked="${sel===j}"><span class="rd"></span><span class="grow"><b>${esc(o.label)}</b>${hints&&o.hint?`<span>${esc(o.hint)}</span>`:''}</span></button>`).join('')}</div>
   ${!hints?'<p class="small muted">На вашому рівні наслідки варіантів не підказуються: аргументуйте вибір у звіті ролі.</p>':''}
  </div>`;}).join('')}`;
}

function tabTeam(team,T,st,level){
 const L=S.L,decs=activeDecs(level),done=st.month>=TOTAL_MONTHS;
 const centers=L.F.centers.filter(c=>c.clients.includes(team.id));
 const cards=team.members.map((m,i)=>{
  const rd=decs.filter(k=>decResp(team,k)===i).map(k=>decMeta(k,T,st).title);
  const p=S.pk[i],hs=Object.values(S.hist[i]||{}),avg=hs.length?Math.round(hs.reduce((a,h)=>a+h.pkg,0)/hs.length):null;
  return `<div class="card mem ${i===S.viewAs?'me':''}">
   <div class="mem-h"><span class="av lg ${m.user?'me':''}">${initials(m.name)}</span><div style="min-width:0"><b>${esc(m.name)} ${m.user?'<span class="chip me">ви</span>':''}</b><span>${esc(roleLabel(team.type,m))}</span></div></div>
   <div><span class="chip prog">${PROG[m.prog].short}</span> <span class="small muted">${esc(PROG[m.prog].name)}</span></div>
   ${!done&&p?`<div class="row" style="gap:6px"><span class="small muted grow">Пакет: ${esc(lc(p.title))}</span>${p.submitted?scoreChip(p.score):'<span class="chip warn">в роботі</span>'}</div>`:''}
   <div class="resp">${rd.map(t=>`<span class="chip acc">${esc(t)}</span>`).join('')||'<span>Окремих рішень немає, працює через пакет</span>'}</div>
   <div class="small muted">Середній бал пакетів: <b class="num" style="color:var(--ink)">${avg==null?'—':avg}</b></div>
   ${i!==S.viewAs?`<button class="btn sm ghost" data-act="viewas-btn" data-v="${i}" style="align-self:flex-start">Переглянути як ${esc(m.name.split(' ')[0])}</button>`:''}
  </div>`;}).join('');
 const req=TYPES[team.type].required.map(r=>roleName(team.type,r));
 return `<div class="card soft"><div class="row" style="justify-content:space-between;align-items:flex-start"><div class="grow"><div class="eyebrow">Склад команди</div><p style="margin-top:6px;max-width:72ch">Обов’язкові ролі для типу «${T.name}»: ${req.map(lc).join(', ')}. Кожна роль щотижня виконує свій робочий пакет, і його бал змінює показники компанії. Нарада команди щочетверга онлайн, 30–40 хвилин.</p></div><span class="chip acc num">${team.members.length} ${plural(team.members.length,['студент','студенти','студентів'])} · ${(k=>k+' '+plural(k,['програма','програми','програм']))(new Set(team.members.map(m=>m.prog)).size)}</span></div></div>
 <div class="team-grid">${cards}</div>
 ${centers.length?`<div class="card"><div class="card-h"><div><div class="eyebrow">Сервісні центри курсу</div><h2 style="margin-top:4px">Хто ще працює з вашою компанією</h2></div></div><div class="tcards">${centers.map(c=>`<div class="tc"><div class="tc-h center"><div class="ic">${icon('building',18)}</div><div><b>${CENTERS[c.group].name}</b><span>${c.members.length} ${plural(c.members.length,['студент','студенти','студентів'])}</span></div></div><p class="small muted">${CENTERS[c.group].serves}</p></div>`).join('')}</div></div>`:''}`;
}

function tabReports(team,T,st){
 const h=st.history;
 if(!h.length)return `<div class="card"><h2>Звітів ще немає</h2><p class="muted" style="margin-top:6px">Перший звіт з’явиться, коли команда закриє січень.</p></div>`;
 const last=h[h.length-1];
 const rows=h.map(r=>`<tr><td class="l">${MONTHS[r.month]}</td><td>${fmtN(r.units)}</td><td>${fmtN(r.revenue)}</td><td>${fmtN(r.revenue-r.profit)}</td><td>${fmtN(r.interest||0)}</td><td class="${r.profit<0?'down':''}">${fmtN(r.profit)}</td><td>${fmtN(r.cash)}</td><td class="${(r.od||0)+(r.debt||0)>0?'down':''}">${r.od==null?'—':fmtN((r.od||0)+(r.debt||0))}</td><td>${r2(r.rep)}</td><td>${Math.round(r.morale)}%</td></tr>`).join('');
 return `<div class="card"><div class="card-h"><h2>Виручка і прибуток</h2>${legend()}</div>${chartSVG(h)}</div>
 <div class="grid2">
  <div class="card"><div class="card-h"><div><div class="eyebrow">${MONTHS[last.month]}</div><h2 style="margin-top:4px">Куди пішла виручка</h2></div><span class="chip num">${kU(last.revenue)}</span></div>${costBreak(last)}</div>
  <div class="card"><div class="card-h"><div><div class="eyebrow">${MONTHS[last.month]}</div><h2 style="margin-top:4px">Внесок ролей</h2></div></div>${contribList(team,last.contrib)}</div>
 </div>
 ${finCard(team,T,st)}
 <div class="card"><div class="card-h"><h2>Помісячний звіт</h2><span class="small muted">гривні · один рядок — один тиждень практики</span></div>
 <div class="tbl-wrap"><table><thead><tr><th class="l">Місяць компанії</th><th>${T.unit[0].toUpperCase()+T.unit.slice(1)}</th><th>Виручка</th><th>Витрати і податок</th><th>у т. ч. відсотки</th><th>Прибуток</th><th>Гроші</th><th>Борг (овердрафт + кредит)</th><th>Рейтинг</th><th>Мораль</th></tr></thead><tbody>${rows}</tbody></table></div>
 ${stageOf(st)===2?`<p class="small muted" style="margin-top:8px">Після ${MONTHS_GEN[st.insolv.liquidated]} компанію ліквідовано: наступні тижні без операційних звітів.</p>`:''}</div>`;
}
function contribList(team,contrib){
 if(!contrib||!contrib.length)return '<p class="muted small">Немає даних.</p>';
 return `<div class="contrib">${contrib.map(c=>{const names=team.members.filter(m=>pkgRole(m)===c.role).map(m=>m.name+(m.user?' (ви)':'')).join(', ');return `<div><b>${esc(roleName(team.type,c.role))}</b>${scoreChip(Math.round(c.s*100))}<span class="t">${esc(c.text)} Виконавці: ${esc(names)}</span></div>`;}).join('')}</div>`;
}
function costBreak(r){
 const parts=[['Собівартість',r.cogs,'--s-cogs,#2A8C9A'],['Персонал',r.staffCost,'--s-staff,#B58428'],['Оренда і комунальні',r.fixed,'--s-fixed,#6B8C98'],['Маркетинг',r.mkt,'--s-mkt,#A070A0'],['Інші витрати',r.other,'--s-other,#8798A0'],['Відсотки за кредитом і овердрафтом',r.interest,'--bad,#B0483A'],['Податок на прибуток',r.tax,'--s-tax,#B8A678'],['Прибуток',Math.max(0,r.profit),'--s-profit,#2E9E63']];
 if(r.profit<=0)parts.pop();
 const tot=Math.max(r.revenue,parts.reduce((a,p)=>a+p[1],0))||1;
 return `<div class="stackbar">${parts.filter(p=>p[1]>0).map(p=>`<i style="width:${(p[1]/tot*100).toFixed(2)}%;background:var(${p[2]})" title="${p[0]}"></i>`).join('')}</div>
 <div class="sb-leg" style="margin-top:12px">${parts.map(p=>`<div><i style="background:var(${p[2]})"></i><span>${p[0]}</span><b>${kU(p[1])}</b></div>`).join('')}${r.profit<=0?`<div><i style="background:var(--bad)"></i><span>Збиток</span><b class="down">${kU(r.profit)}</b></div>`:''}</div>`;
}
const GRADE_PARTS=[['pkg','Робочі пакети',40,'ind'],['tr','Тематичні тренажери',15,'ind'],['rep','Звіти ролі',15,'ind'],['team','Результат компанії',20,'team'],['peer','Оцінка колег',10,'team']];
function gradeFor(i,team){const g=gradeCalc(S,i);return Object.assign(g,{v:{pkg:g.comps.pkg.val,tr:g.comps.tr.val,rep:g.comps.rep.val,team:g.comps.team.val,peer:null}});}
function scale(t){return t>=90?['A','відмінно']:t>=82?['B','добре']:t>=74?['C','добре']:t>=64?['D','задовільно']:t>=60?['E','задовільно']:['FX','незадовільно'];}
function tabGrade(team,T,st,level,me){
 const i=S.viewAs,g=gradeCalc(S,i),W=S.work||{};
 const sc=g.total!=null?scale(g.total):null;
 const stt=u=>u.state==='graded'?String(u.score):u.state==='pending'?'<span class="chip acc">не оцінено</span>':u.state==='returned'?'<span class="chip warn">повернено</span>':'<span class="chip">не подано · 0</span>';
 const cellFor=(m,c)=>{const us=g.units.filter(u=>u.m===m&&u.c===c&&u.key);return us.length?us.map(stt).join(' '):'—';};
 const rowsH=g.ms.map(m=>{const x=g.h[m];return `<tr><td class="l">${m+1} · ${MONTHS[m]}</td><td>${x.pkg}${g.isUser&&x.full?'<div class="small muted">авто, 80% пакета</div>':''}</td><td>${g.isUser?(x.full?cellFor(m,'pkg'):'—'):'—'}</td><td>${g.isUser?cellFor(m,'tr'):'—'}</td><td>${g.isUser?cellFor(m,'rep'):'—'}</td></tr>`;}).join('');
 const status=g.total==null?'':g.final?'<span class="chip good">остаточна</span>':g.done?'<span class="chip warn">підсумок неповний</span>':'<span class="chip acc">попередня</span>';
 const parts=[['pkg','Робочі пакети',40,'ind',g.hasFin?'авто + куратор (записка, рекомендація)':'авто'],['tr','Тематичні тренажери',15,'ind','куратор'],['rep','Звіти ролі',15,'ind','куратор'],['team','Результат компанії',20,'team','рейтинг курсу']];
 return `<div class="grid2">
  <div class="card"><div class="eyebrow">${esc(me.name)} · ${esc(roleLabel(team.type,me))}</div>
   <div class="grade-big" style="margin-top:12px"><b>${g.total==null?'—':Math.round(g.total)}</b><span class="muted">зі 100${sc?` · ${sc[0]}, «${sc[1]}»`:''}</span></div>
   <div class="row" style="margin-top:8px">${status}${g.isUser&&g.total!=null?`<span class="chip num">оцінено ${Math.round(g.gradedW)} із 90 балів ваги</span>${g.incomplete?`<span class="chip warn num">не оцінено ${Math.round(g.pendingW)} із 90</span>`:''}`:''}</div>
   <p class="small muted" style="margin-top:10px">${!g.n?'Оцінка з’явиться після закриття першого тижня.':!g.isUser?'Це роль колеги з демо-команди: робіт для куратора тут немає, показано лише автоматичні складові.':g.final?`Усі роботи за ${g.n} ${plural(g.n,['тиждень','тижні','тижнів'])} оцінено.`:g.done?`Практику завершено, але куратор ще не оцінив роботи вагою ${Math.round(g.pendingW)} із 90: до того підсумок неповний і в залікову відомість не переноситься.`:`Попередня оцінка за ${g.n} ${plural(g.n,['тиждень','тижні','тижнів'])}: рахується лише за оціненою частиною. Роботи, які чекають куратора (${Math.round(g.pendingW)} із 90 балів ваги), у неї поки не входять — ні нулем, ні повним балом.`}</p>
   <div class="note" style="margin-top:14px">Як складається оцінка. Робочі пакети — 40 (перевіряє система${g.hasFin?'; у повному пакеті фінансової ролі 80% — авто, по 10% — записка й рекомендація від куратора':''}). Тренажери — 15 і звіти ролі — 15: оцінює куратор, 0–100; неподана робота за закритий тиждень — 0. Результат компанії — 20: бал у рейтингу курсу (санація −${FIN.sanPenalty}, банкрутство — 0). Оцінку колег (10) у демо не виставляють, тому підсумок рахується з 90 балів ваги.</div>
  </div>
  <div class="card"><div class="eyebrow" style="margin-bottom:12px">Складові оцінки</div><div class="stack" style="gap:14px">
   ${parts.map(p=>{const c=g.comps[p[0]],val=c.val;return `<div class="wbar"><span>${p[1]} <span class="muted small">· ${p[2]} · ${p[4]}${c.pendingW>0.001?` · не оцінено ${Math.round(c.pendingW)} із ${p[2]}`:''}</span></span><b class="num" style="text-align:right">${val==null?'—':Math.round(val)}</b><div class="tr"><i class="${p[3]==='ind'?'ac':''}" style="width:${val==null?0:Math.round(val)}%"></i></div></div>`;}).join('')}
   <div class="wbar"><span>Оцінка колег <span class="muted small">· 10 · у демо не виставляється</span></span><b class="num" style="text-align:right">—</b><div class="tr"><i style="width:0%"></i></div></div>
  </div>
  ${g.isUser?`<div class="row" style="margin-top:14px"><button class="btn" data-act="tab" data-v="works">Роботи для куратора</button></div>`:''}</div>
 </div>
 ${rowsH?`<div class="card"><div class="card-h"><h2>Історія тижнів</h2></div><div class="tbl-wrap"><table><thead><tr><th class="l">Тиждень · місяць компанії</th><th>Бал пакета (авто)</th><th>Записка і рекомендація</th><th>Тренажер</th><th>Звіт ролі${Object.keys(W).some(k=>/-plan$/.test(k))?' і план оздоровлення':''}</th></tr></thead><tbody>${rowsH}</tbody></table></div></div>`:''}`;
}
function tabLeague(team,T,st,level){
 const rows=leagueRows(S.L),started=st.month>0;
 return `<p class="muted" style="max-width:74ch">Усі компанії ${level} курсу працюють в одній лізі. Бал компанії: рентабельність продажів 40%, рейтинг клієнтів 35%, мораль персоналу 25%. Рентабельність порівнюється з нормою свого типу бізнесу (ресторан 7%, готель 6%, магазин 2,5%, цех 4%), тому компанії різних типів змагаються чесно. Компанія, що побувала в санації, втрачає ${FIN.sanPenalty} балів; ліквідована компанія отримує 0 і позначку «банкрут». Правила платоспроможності однакові для всіх, зокрема для команд-прикладів. У демо решта компаній — команди-приклади.</p>
 <div class="tbl-wrap"><table><thead><tr><th class="l">#</th><th class="l">Компанія</th><th class="l">Тип</th><th>Студентів</th><th>Прибуток</th><th>Рентабельність</th><th>Борг</th><th>Рейтинг</th><th>Мораль</th><th>Бал</th></tr></thead><tbody>
 ${rows.map((r,i)=>`<tr class="${r.t.id===team.id?'mine':''}"><td class="l">${started?i+1:'—'}</td><td class="l"><b>${esc(r.t.name)}</b>${r.t.id===team.id?' <span class="chip me">ваша</span>':''}${r.bk?' <span class="chip bad">банкрут</span>':r.stage===1?' <span class="chip bad">санація</span>':r.san?` <span class="chip warn">була санація · −${FIN.sanPenalty}</span>`:''}</td><td class="l">${TYPES[r.t.type].name}</td><td>${r.t.members.length}</td><td class="${r.cum<0?'down':''}">${started?kU(r.cum):'—'}</td><td>${started?pct(r.margin):'—'}</td><td>${started?kU((r.st.od||0)+debtOf(r.st)):'—'}</td><td>${r2(r.rep)}</td><td>${Math.round(r.mor)}%</td><td><b>${started?r.score:'—'}</b></td></tr>`).join('')}
 </tbody></table></div>`;
}
const WEEKS=[
 ['Запуск і січень','Знайомство в команді, розподіл ролей, стратегія компанії, перший робочий пакет.'],
 ['Лютий','Перші кадрові й фінансові виклики.'],
 ['Березень','Робота з постачальниками і якістю.'],
 ['Квітень','Маркетинг і конкуренти. На кінець тижня перша оцінка колег.'],
 ['Травень','Сезонне зростання попиту, навантаження на команду.'],
 ['Червень','Пік сезону, інвестиції та ризики.'],
 ['Липень','Останній операційний місяць, підготовка підсумкового звіту.'],
 ['Підсумковий звіт і захист','Кожна роль презентує рішення і результати онлайн. Друга оцінка колег.']
];
function tabSchedule(team,T,st,level){
 const plan=[['Пн','Брифінг місяця і дані для своєї ролі','1 год'],['Пн–Ср','Робочий пакет у тренажері ролі','6–8 год'],['Ср','Рішення відділу з коротким обґрунтуванням','1 год'],['Чт','Нарада команди і запити між ролями','2 год'],['Пт','Звіт ролі за тиждень — письмово кураторові','1–2 год'],['Протягом тижня','Тематичний тренажер зі своєї дисципліни — з підтвердженням кураторові','3 год']];
 return `<div class="phase">
  <div class="ph cur"><span class="k">ЗИМА · 5 КРЕДИТІВ ЄКТС</span><b>Віртуальне підприємство</b><p>Вісім тижнів дистанційно, близько 150 годин. Студенти вчаться ухвалювати рішення в команді на безпечній моделі: помилка коштує віртуальних грошей, а не реальних.</p></div>
  <div class="ph"><span class="k">ЛІТО · 4–5 КРЕДИТІВ ЄКТС</span><b>Реальна практика</b><p>Підприємства-партнери і студентські підприємства ПУЕТ: кейтеринг, кондитерський цех, бізнес-школа. Студенти з найкращими результатами зими першими обирають місце, а роль у віртуальній компанії підказує, з якої посади почати.</p></div>
 </div>
 <div class="grid2">
  <div class="card"><div class="card-h"><div><div class="eyebrow">Ваш тиждень</div><h2 style="margin-top:4px">Близько 18 годин</h2></div><span class="chip acc num">8 тижнів ≈ 150 год</span></div>
   <div class="todo">${plan.map(p=>`<div class="todo-i"><span class="chip acc" style="min-width:58px;justify-content:center">${p[0]}</span><div class="grow"><b>${p[1]}</b></div><span class="hrs" style="color:var(--ink2)">${p[2]}</span></div>`).join('')}</div>
   <p class="small muted" style="margin-top:10px">Більшість роботи асинхронна, тому відключення світла чи тривога не зривають тиждень: усе можна здати будь-коли до дедлайну.</p></div>
  <div class="card"><div class="card-h"><div><div class="eyebrow">8 тижнів</div><h2 style="margin-top:4px">Графік практики</h2></div></div>
   <div class="weeks">${WEEKS.map((w,i)=>{const cur=i===Math.min(st.month,7),fin=i<st.month;return `<div class="wk ${cur?'cur':''}"><span class="n">Тиждень ${i+1}</span><div><b>${w[0]}</b><span>${w[1]}</span></div>${fin?`<span class="chip good">${icon('check',13)}</span>`:cur?'<span class="chip acc">зараз</span>':'<span></span>'}</div>`;}).join('')}</div></div>
 </div>
 <div class="card"><div class="card-h"><div><div class="eyebrow">Оцінювання</div><h2 style="margin-top:4px">70% індивідуально, 30% за команду</h2></div></div>
  <div class="grid2"><div class="stack" style="gap:12px">${GRADE_PARTS.filter(p=>p[3]==='ind').map(p=>`<div class="wbar"><span>${p[1]}</span><b class="num" style="text-align:right">${p[2]}%</b><div class="tr"><i class="ac" style="width:${p[2]/40*100}%"></i></div></div>`).join('')}</div>
  <div class="stack" style="gap:12px">${GRADE_PARTS.filter(p=>p[3]==='team').map(p=>`<div class="wbar"><span>${p[1]}</span><b class="num" style="text-align:right">${p[2]}%</b><div class="tr"><i style="width:${p[2]/40*100}%"></i></div></div>`).join('')}</div></div></div>
 <div class="card"><div class="card-h"><div><div class="eyebrow">Хто що оцінює</div><h2 style="margin-top:4px">Система, куратор і рейтинг курсу</h2></div></div><p class="small" style="max-width:80ch">Робочі пакети (розрахункові завдання) перевіряє система. Тематичні тренажери, звіти ролі, а у фінансової ролі ще й пояснювальну записку та обґрунтування рекомендації оцінює куратор практики за шкалою 0–100 з коментарем. Доки оцінки куратора немає, робота має стан «не оцінено» і в попередню оцінку не входить; неподана робота за закритий тиждень — 0. Якщо на кінець практики лишаються неоцінені роботи, підсумок позначено як неповний. Оцінку колег (10) у демо не виставляють.</p></div>
 <div class="card"><div class="card-h"><div><div class="eyebrow">Платоспроможність · усі ставки за умовою</div><h2 style="margin-top:4px">Овердрафт, кредит, санація, ліквідація</h2></div></div>${RULES_HTML(T)}</div>
 <div class="card"><div class="card-h"><div><div class="eyebrow">Рівні складності</div><h2 style="margin-top:4px">Кожен курс працює у своїй лізі</h2></div></div>${levelCards(level)}</div>`;
}
const levelCards=cur=>`<div class="levels">${[1,2,3,4].map(c=>`<div class="lvl ${c===cur?'cur':''}"><span class="k">${c} КУРС</span><b>${LEVELS[c].title}</b><p>${LEVELS[c].text}</p></div>`).join('')}</div>`;

function niceStep(x){const p=Math.pow(10,Math.floor(Math.log10(x)));const f=x/p;return(f<=1?1:f<=2?2:f<=2.5?2.5:f<=5?5:10)*p;}
function chartSVG(h){
 if(!h.length)return `<div class="note">Графік з’явиться після закриття першого місяця.</div>`;
 const W=680,H=240,pl=52,pr=14,pt=18,pb=30,n=TOTAL_MONTHS;
 const maxV=Math.max(...h.map(x=>x.revenue),1)*1.1,minV=Math.min(0,...h.map(x=>x.profit))*1.25;
 const step=niceStep((maxV-minV)/4),y=v=>pt+(maxV-v)/(maxV-minV)*(H-pt-pb);
 const bw=(W-pl-pr)/n,cx=i=>pl+i*bw+bw/2;
 let g='';
 for(let v=Math.ceil(minV/step)*step;v<=maxV;v+=step){g+=`<line class="${Math.abs(v)<1?'c-zero':'c-grid'}" x1="${pl}" x2="${W-pr}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}"/><text class="c-txt" x="${pl-8}" y="${(y(v)+4).toFixed(1)}" text-anchor="end">${fmtN(v/1000)}</text>`;}
 g+=`<text class="c-txt" x="${pl-8}" y="${pt-6}" text-anchor="end">тис. грн</text>`;
 for(let i=0;i<n;i++){
  const r=h[i];
  if(r){const top=y(Math.max(r.revenue,0));g+=`<rect class="c-bar" x="${(pl+i*bw+bw*0.2).toFixed(1)}" y="${top.toFixed(1)}" width="${(bw*0.6).toFixed(1)}" height="${(y(0)-top).toFixed(1)}" rx="3"/>`;}
  else g+=`<rect class="c-bar empty" x="${(pl+i*bw+bw*0.2).toFixed(1)}" y="${(y(0)-24).toFixed(1)}" width="${(bw*0.6).toFixed(1)}" height="24" rx="3"/>`;
  g+=`<text class="c-txt" x="${cx(i).toFixed(1)}" y="${H-8}" text-anchor="middle">${MON_SHORT[i]}</text>`;
 }
 const pts=h.map((r,i)=>[cx(i),y(r.profit)]);
 if(pts.length>1)g+=`<path class="c-line" d="${pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ')}"/>`;
 pts.forEach((p,i)=>{g+=`<circle class="c-dot ${i===pts.length-1?'end':''}" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${i===pts.length-1?4.5:3.5}"/>`;});
 const lp=pts[pts.length-1];
 g+=`<text class="c-val" x="${lp[0].toFixed(1)}" y="${(lp[1]-10).toFixed(1)}" text-anchor="middle">${fmtN(h[h.length-1].profit/1000)}</text>`;
 return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Виручка і прибуток по місяцях">${g}</svg></div>`;
}

function reportModal(team,T,st){
 const r=S.report,good=r.profit>=0,lastMonth=st.month>=TOTAL_MONTHS;
 return `<div class="scrim" role="dialog" aria-modal="true" aria-labelledby="rep-t"><div class="modal">
  <div><div class="eyebrow">Підсумки місяця · ${esc(team.name)}</div><h2 id="rep-t" style="margin-top:6px;font-size:20px">${MONTHS[r.month]}</h2></div>
  <div class="verdict ${good?'good':'bad'}"><div class="grow"><div class="small" style="font-weight:600">${good?'Прибуток':'Збиток'} після податку</div><div class="big">${kU(r.profit)}</div></div><div class="small muted" style="text-align:right">Обсяг за місяць<br><b class="num" style="color:var(--ink)">${fmtN(r.units)} ${unitW(T.unit,r.units)}</b></div></div>
  <div class="mini"><div><span>Виручка</span><b>${kU(r.revenue)}</b></div><div><span>Гроші на рахунку</span><b>${kU(r.cash)}</b></div>${(r.od||0)+(r.debt||0)>0?`<div><span>Борг: овердрафт і кредит</span><b class="down">${kU((r.od||0)+(r.debt||0))}</b></div>`:''}<div><span>Рейтинг</span><b>${r2(r.rep)} <span class="${r.repDelta<-0.004?'down':'up'}" style="font-size:12px">${sgn2(r.repDelta)}</span></b></div><div><span>Мораль</span><b>${Math.round(r.morale)}% <span class="${r.moraleDelta<-0.49?'down':'up'}" style="font-size:12px">${sgn0(r.moraleDelta)}</span></b></div></div>
  <div><div class="eyebrow" style="margin-bottom:6px">Внесок ролей: як робочі пакети змінили цифри</div>${contribList(team,r.contrib)}</div>
  <div><div class="eyebrow" style="margin-bottom:10px">Куди пішла виручка</div>${costBreak(r)}</div>
  <div><div class="eyebrow" style="margin-bottom:10px">Що ще вплинуло на результат</div>${anaList([...r.notes.map(s=>({t:'warn',s})),...r.analysis])}</div>
  <div class="row" style="justify-content:flex-end"><button class="btn" data-act="rep-tab">Детальний звіт</button><button class="btn primary" data-act="rep-close">${lastMonth?'Перейти до підсумків':'До наступного місяця'}</button></div>
 </div></div>`;
}

function viewCoord(){
 const c=S.coordCourse,counts=S.counts[c],F=formTeams(counts,c);
 const byType={};F.teams.forEach(t=>byType[t.type]=(byType[t.type]||0)+1);
 const inTeams=F.teams.reduce((a,t)=>a+t.members.length,0),inCenters=F.centers.reduce((a,x)=>a+x.members.length,0);
 const unpl=Object.entries(F.unplaced);
 const avg=F.teams.length?(inTeams/F.teams.length).toFixed(1).replace('.',','):'—';
 return `<div class="coord">
 <p class="muted small" style="max-width:76ch">Зимова практика бакалаврів · 5 кредитів. Склад студентів за програмами визначає, скільки компаній і сервісних центрів буде на курсі.</p>
 <div class="row" style="justify-content:space-between"><div class="ctabs" role="tablist">${[1,2,3,4].map(n=>`<button class="${n===c?'on':''}" data-act="c-course" data-v="${n}" role="tab" aria-selected="${n===c}">${n} курс</button>`).join('')}</div><span class="chip acc">${LEVELS[c].title}: ${LEVELS[c].events} ${LEVELS[c].events===1?'подія':'події'} на тиждень</span></div>
 <div class="coord-body">
  <div class="card"><div class="card-h"><div><div class="eyebrow">Студенти ${c} курсу</div><h2 style="margin-top:4px">Склад за програмами</h2></div><span class="chip num">${F.total} ${plural(F.total,['особа','особи','осіб'])}</span></div>
   <p class="note" style="margin-bottom:12px">Приклад даних. Введіть реальну кількість студентів, і команди перерахуються автоматично.</p>
   <div class="counts">${PROGRAMS.map(p=>`<div class="cnt"><div style="min-width:0"><b>${esc(p.name)}</b><span>${p.short} · ${p.code}</span></div><div class="step"><button type="button" data-act="cnt" data-k="${p.id}" data-v="-1" aria-label="Менше">−</button><input type="number" min="0" max="200" id="cnt-${c}-${p.id}" data-cnt="${p.id}" value="${counts[p.id]||0}" aria-label="${esc(p.name)}"><button type="button" data-act="cnt" data-k="${p.id}" data-v="1" aria-label="Більше">+</button></div></div>`).join('')}</div>
   <div class="row" style="margin-top:14px"><button class="btn sm" data-act="cnt-reset">Повернути приклад</button></div>
   <p class="small muted" style="margin-top:14px">Наступна хвиля програм: ${NEXT_WAVE.join(', ')}.</p>
  </div>
  <div class="stack" style="gap:18px">
   <div class="sumrow">
    <div class="kpi"><div class="l">Компаній</div><div class="v">${F.teams.length}</div><div class="d muted">${TYPE_ORDER.filter(t=>byType[t]).map(t=>byType[t]+' '+TYPES[t].name.toLowerCase()).join(', ')||'жодної'}</div></div>
    <div class="kpi"><div class="l">Середня команда</div><div class="v">${avg}</div><div class="d muted">студентів</div></div>
    <div class="kpi"><div class="l">Сервісні центри</div><div class="v">${F.centers.length}</div><div class="d muted">${inCenters} ${plural(inCenters,['студент','студенти','студентів'])}</div></div>
    <div class="kpi"><div class="l">Без місця</div><div class="v ${unpl.length?'down':''}">${unpl.reduce((a,x)=>a+x[1],0)}</div><div class="d muted">${unpl.length?'потрібне рішення':'усі розподілені'}</div></div>
   </div>
   ${!F.teams.length?`<div class="err">Замало студентів для повного складу хоча б однієї компанії. Потрібні щонайменше маркетолог, фінансист і студенти профільних програм. Об’єднайте курс із сусіднім або додайте програми.</div>`:''}
   ${unpl.length?`<div class="err">Не вдалося розподілити: ${unpl.map(([p,n])=>PROG[p].short+' — '+n).join(', ')}. Додайте їх вручну як консультантів або об’єднайте курси.</div>`:''}
   <div class="card"><div class="card-h"><div><div class="eyebrow">Як формуються команди</div><h2 style="margin-top:4px">Ролі, а не програми</h2></div></div>
    <p class="muted small" style="max-width:76ch">Спершу система створює компанії, для яких є всі обов’язкові ролі, і чергує типи. Потім додає необов’язкові ролі в найменші команди. Студенти великих програм, яким не вистачило ролі, утворюють сервісні центри, що обслуговують кілька компаній. Решта стають асистентами у профільних ролях і виконують той самий робочий пакет.</p></div>
   <div class="tcards">${F.teams.map(t=>`<div class="tc"><div class="tc-h"><div class="ic">${icon(TYPES[t.type].icon,18)}</div><div style="min-width:0"><b>${esc(t.name)}</b><span>${TYPES[t.type].name}</span></div><span class="tsize num">${t.members.length} ос.</span></div>
     <div class="ml">${t.members.map(m=>`<div class="${m.assistant?'asst':''}"><span>${esc(roleLabel(t.type,m))}</span><span class="chip prog">${PROG[m.prog].short}</span></div>`).join('')}</div></div>`).join('')}
    ${F.centers.map(x=>`<div class="tc"><div class="tc-h center"><div class="ic">${icon('building',18)}</div><div style="min-width:0"><b>${CENTERS[x.group].name}</b><span>Сервісний центр</span></div><span class="tsize num">${x.members.length} ос.</span></div>
     <p class="small muted">${CENTERS[x.group].serves}</p>
     <div class="row" style="gap:5px">${[...new Set(x.members.map(m=>m.prog))].map(p=>`<span class="chip prog">${PROG[p].short} × ${x.members.filter(m=>m.prog===p).length}</span>`).join('')}</div>
     <p class="small muted">Клієнти: ${x.clients.map(id=>esc(F.teams.find(t=>t.id===id).name)).join(', ')}</p></div>`).join('')}</div>
  </div>
 </div>
 <div class="card"><div class="card-h"><div><div class="eyebrow">Рівні складності</div><h2 style="margin-top:4px">Що відрізняє курси</h2></div></div>${levelCards(c)}</div>
 </div>`;
}

/* ========= ДІЇ ========= */
/* кабінет координатора: черга перевірки, зведення оцінок, склад команд */
function coordBody(){
 const todo=queueAll().filter(q=>q.it.status==='submitted').length,tab=S.coordTab||(todo?'queue':'teams');
 const tabs=[['queue',`Роботи на перевірку${todo?' · '+todo:''}`],['students','Оцінки студентів'],['teams','Склад команд']];
 return `<div class="ctabs" role="tablist" style="margin-bottom:14px">${tabs.map(t=>`<button class="${t[0]===tab?'on':''}" data-act="g-tab" data-v="${t[0]}" role="tab" aria-selected="${t[0]===tab}">${t[1]}</button>`).join('')}</div>
 ${tab==='queue'?viewQueue():tab==='students'?viewStudents():viewCoord()}`;
}
function startPractice(){
 const u=S.user,course=+u.course;
 if(!String(u.name).trim()){S.loginError='Профіль без імені.';render();return;}
 const F=formTeams(S.counts[course],course);
 if(!F.teams.length){S.loginError='Для цього курсу замало студентів, щоб сформувати хоча б одну компанію. Змініть склад у кабінеті координатора.';render();return;}
 let team=null,idx=-1;
 for(const pass of[false,true]){for(const t of F.teams){const i=t.members.findIndex(m=>m.prog===u.prog&&(pass||(!m.assistant&&m.role!=='guest')));if(i>=0){team=t;idx=i;break;}}if(team)break;}
 if(!team){team=F.teams[0];team.members.push({role:'guest',prog:u.prog,center:CENTER_GROUP[u.prog]||'consult'});idx=team.members.length-1;}
 team.members[idx].name=String(u.name).trim();team.members[idx].user=true;
 const states={};F.teams.forEach(t=>states[t.id]=newState(t.type));
 S.L={course,F,myId:team.id,states,cur:[]};
 S.L.cur=pickEvents(team.id,team.type,states[team.id],course);
 const dec=defaultDec();
 if(S.work&&Object.keys(S.work).length)(S.workArchive=S.workArchive||[]).push({at:nowIso(),work:S.work,hist:S.hist});
 Object.assign(S,{viewAs:idx,dec,evc:{},sub:{},tasks:{},hist:{},work:{},wErr:null,pkErr:'',report:null,tab:'overview',view:'app',loginError:''});
 S.pk=genPackages(team,states[team.id],0,resolveDec(course,dec));
 save();render();window.scrollTo(0,0);
}
function teamRoleScores(team){
 const sum={},cnt={};
 team.members.forEach((m,i)=>{const k=pkgRole(m),p=S.pk[i],s=p&&p.submitted?p.score/100:0;sum[k]=(sum[k]||0)+s;cnt[k]=(cnt[k]||0)+1;});
 const rs={};Object.keys(sum).forEach(k=>rs[k]=sum[k]/cnt[k]);return rs;
}
function closeMonth(){
 if(coordMode||!S.L)return;
 const L=S.L,team=myTeam(),st=normState(L.states[team.id]),level=L.course,m=st.month;
 if(m>=TOTAL_MONTHS||!closeState(team,level).ready)return;
 const frozen=stageOf(st)===2;let rp=null;
 if(frozen){st.month++;} /* ліквідована компанія: тиждень практики минає без операцій */
 else{
  const rs=teamRoleScores(team);
  const d=resolveDec(level,S.dec);d.loan=canLoan(team)?+S.dec.loan||0:0;d.repay=!!S.dec.repay;
  const evs=L.cur.map(id=>({ev:EV[id],opt:S.evc[id]}));
  rp=simulateMonth(st,team.type,d,evs,team.id,rs);
 }
 team.members.forEach((mem,i)=>{
  const p=S.pk[i],r=rng(hashStr(team.id+':tick:'+i+':'+m));
  if(mem.user&&!(p&&p.submitted)&&rp)rp.notes.unshift('Ваш робочий пакет не здано: роль отримала 0 балів.');
  /* у реального користувача тренажер і звіт — це подані роботи (S.work), які оцінює куратор; автоматичних позначок немає */
  const a=r()<0.85,b=r()<0.85;
  (S.hist[i]=S.hist[i]||{})[m]=mem.user?{pkg:p&&p.submitted?p.score:0,v:2,full:!!(p&&p.full)}:{pkg:p&&p.submitted?p.score:0,v:2,tr:a,rep:b};
 });
 L.F.teams.forEach(t=>{if(t.id!==team.id)botMonth(L.states[t.id],t,level);});
 S.report=rp;
 S.evc={};S.sub={};S.dec.invest=0;S.dec.loan=0;S.dec.repay=false;S.pkErr='';S.wErr=null;
 if(stageOf(st)===1&&S.dec.budget>FIN.sanBudgetMax)S.dec.budget=FIN.sanBudgetMax;
 if(st.month<TOTAL_MONTHS){L.cur=stageOf(st)===2?[]:pickEvents(team.id,team.type,st,level);S.pk=genPackages(team,st,st.month,resolveDec(level,S.dec));}
 else{L.cur=[];S.pk={};}
 save();render();
}
const canLoan=team=>canEdit(respIdx(team,['fin','dir']));
function fpCheck(k){
 const p=S.pk[S.viewAs];if(!p||!p.full||p.submitted||p.done[k])return;
 const m=S.L.states[S.L.myId].month;
 if(k===0){const miss=p.qs.findIndex((q,i)=>q.t==='num'?!isFinite(parseNum(p.answers[i])):p.answers[i]==null);if(miss>=0){S.pkErr=`Дайте відповідь на запитання ${miss+1}.`;render();return;}}
 if(k===1){const empty=cfCells(p).find(c=>!isFinite(parseNum(p.cfAns[c.key])));if(empty){S.pkErr='Заповніть усі 12 клітинок таблиці.';render();return;}if((p.memo||'').trim().length<WK.memo.min){S.pkErr=`Записка має містити щонайменше ${WK.memo.min} знаків.`;render();return;}putPkgWork('memo',m,(p.memo||'').trim());}
 if(k===2){if(!(p.req.cost&&p.req.log)){S.pkErr='Спершу надішліть обидва запити колегам.';render();return;}if(p.rec.level==null){S.pkErr='Оберіть рекомендований рівень ціни.';render();return;}if((p.rec.text||'').trim().length<WK.rec.min){S.pkErr=`Обґрунтування має містити щонайменше ${WK.rec.min} знаків.`;render();return;}putPkgWork('rec',m,(p.rec.text||'').trim());}
 if(k===3){const miss=p.qs4.findIndex((q,i)=>q.t==='num'?!isFinite(parseNum(p.ans4[i])):p.ans4[i]==null);if(miss>=0){S.pkErr=`Дайте відповідь на запитання ${miss+1}.`;render();return;}}
 p.done[k]=true;S.pkErr='';save();render();
}
function submitPkg(){
 const p=S.pk[S.viewAs];if(!p||p.submitted)return;
 if(p.full){if(![0,1,2,3].every(k=>p.done[k])){S.pkErr='Спершу завершіть усі чотири частини.';render();return;}p.submitted=true;p.score=scorePkg(p);S.pkErr='';save();render();return;}
 const miss=p.qs.findIndex((q,i)=>q.t==='num'?!isFinite(parseNum(p.answers[i])):p.answers[i]==null);
 if(miss>=0){S.pkErr=`Дайте відповідь на запитання ${miss+1}. Числа можна писати з комою.`;render();return;}
 p.submitted=true;p.score=scorePkg(p);S.pkErr='';save();render();
}

function onAct(a,k,v,el){
  /* дії куратора: лише в кабінеті координатора й лише для ролей uni_teacher / admin */
  if(a==='g-grade'||a==='g-return'){if(!canGrade())return false;if(!gradeAct(k,v,a==='g-return'))return false;save();return true;}
  if(a==='g-tab'){if(!coordMode)return false;S.coordTab=v;save();return true;}
  if(coordMode&&!['c-course','cnt','cnt-reset','lg-course'].includes(a))return false; /* у кабінеті координатора немає дій студента */
  const live=()=>{if(!S.L)return false;const st=S.L.states[S.L.myId];return st.month<TOTAL_MONTHS&&stageOf(st)<2;};
  switch(a){
   case 'lg-course':S.user.course=+v;break;
   case 'demo':S.demoAll=!S.demoAll;break;
   case 'viewas-btn':S.viewAs=+v;S.pkErr='';break;
   case 'dec':if(!live())return false;S.dec[k]=+v;break;
   case 'sub':if(!live())return false;S.sub[k]=true;break;
   case 'unsub':S.sub[k]=false;break;
   case 'ev':if(!live())return false;S.evc[k]=+v;break;
   case 'task':return false; /* самопозначки скасовано: роботи подаються текстом і оцінюються куратором */
   case 'w-submit':if(!submitWork(v))return false;break;
   case 'loan':{if(!live())return false;const team=myTeam(),st=S.L.states[team.id];if(!canLoan(team)||stageOf(st)>0)return false;S.dec.loan=clamp(Math.round(+v||0),0,creditLimit(st,TYPES[team.type]));break;}
   case 'repay':{if(!live())return false;const team=myTeam();if(!canLoan(team))return false;S.dec.repay=!S.dec.repay;break;}
   case 'pq-ch':{const p=S.pk[S.viewAs];const g=el.dataset.g||'answers';if(p&&!p.submitted&&!(p.full&&p.done[g==='ans4'?3:0]))(p[g]=p[g]||{})[+k]=+v;break;}
   case 'fp-part':{const p=S.pk[S.viewAs];if(p&&p.full)p.part=+v;S.pkErr='';break;}
   case 'fp-check':fpCheck(+v);return true;
   case 'fp-req':{const p=S.pk[S.viewAs];if(p&&p.full&&!p.done[2])p.req[k]=true;break;}
   case 'fp-rec-level':{const p=S.pk[S.viewAs];if(p&&p.full&&!p.done[2])p.rec.level=+v;break;}
   case 'pkg-submit':submitPkg();return true;
   case 'close':closeMonth();return true;
   case 'rep-close':S.report=null;if(S.L&&S.L.states[S.L.myId].month>=TOTAL_MONTHS)S.tab='overview';break;
   case 'rep-tab':S.report=null;S.tab='reports';if(host)host.goTab('reports');window.scrollTo(0,0);break;
   case 'c-course':S.coordCourse=+v;break;
   case 'cnt':{const c=S.coordCourse;S.counts[c][k]=clamp((+S.counts[c][k]||0)+(+v),0,200);break;}
   case 'cnt-reset':S.counts[S.coordCourse]={...SAMPLE_COUNTS[S.coordCourse]};break;
   case 'restart':if(S.work&&Object.keys(S.work).length)(S.workArchive=S.workArchive||[]).push({at:nowIso(),work:S.work,hist:S.hist});S.work={};S.L=null;S.report=null;S.pk={};break;
   case 'pr-start':startPractice();return true;
   default:return false;
  }
  save();return true;
}
function onChange(e){
  const t=e.target;
  if(t.dataset.actChange==='g-f'){if(!coordMode)return false;S.gq=Object.assign({},GQ0,S.gq||{});if(t.dataset.k in GQ0)S.gq[t.dataset.k]=t.value;if(!S.coordTab)S.coordTab='queue';save();return true;}
  if(t.dataset.actChange==='viewas'){if(coordMode)return false;S.viewAs=+t.value;S.pkErr='';save();return true;}
  if(t.dataset.cnt){S.counts[S.coordCourse][t.dataset.cnt]=clamp(Math.round(+t.value||0),0,200);save();return true;}
  if(t.dataset.u){S.user[t.dataset.u]=t.value;save();return true;}
  return false;
}
function onInput(e){
  const t=e.target;let h=false;
  if(t.dataset.prin){const a=String(t.dataset.prin).split('|');
   if(a[0]==='w'){if(inputWork(a[1],a[2],t.value)){save();const c=t.parentElement&&t.parentElement.querySelector?t.parentElement.querySelector('.cnt-ch'):null;const pk=parseWk(a[1]);if(c&&a[2]==='text'&&pk)c.textContent=t.value.trim().length+' / '+WK[pk.kind].min+' знаків';}return true;}
   if(a[0]==='g'){if(!canGrade())return true;const id=a[1]+'|'+a[2],f=a[3];if(f!=='score'&&f!=='comment')return true;S.gdraft=S.gdraft||{};(S.gdraft[id]=S.gdraft[id]||{})[f]=String(t.value).slice(0,3000);save();return true;}
   return true;}
  if(coordMode)return false;
  if(t.dataset.u&&t.tagName==='INPUT'){S.user[t.dataset.u]=t.value;save();h=true;}
  if(t.dataset.pq!=null){const p=S.pk[S.viewAs];const g=t.dataset.pqk||'answers';if(p&&!p.submitted){(p[g]=p[g]||{})[+t.dataset.pq]=t.value;save();}h=true;}
  if(t.dataset.cf){const p=S.pk[S.viewAs];if(p&&p.full&&!p.done[1]){p.cfAns[t.dataset.cf]=t.value;save();}h=true;}
  if(t.dataset.memo){const p=S.pk[S.viewAs];if(p&&p.full&&!p.done[1]){p.memo=t.value;save();const c=t.parentElement.querySelector('.cnt-ch');if(c)c.textContent=t.value.trim().length+' / 400 знаків';}h=true;}
  if(t.dataset.rec){const p=S.pk[S.viewAs];if(p&&p.full&&!p.done[2]){p.rec.text=t.value;save();const c=t.parentElement.querySelector('.cnt-ch');if(c)c.textContent=t.value.trim().length+' / 200 знаків';}h=true;}
  return h;
}
function onKey(e){if(e.key==='Escape'&&S&&S.report){S.report=null;return true;}return false;}
/* стартовий екран практики всередині платформи */
function startBody(){
 const u=S.user,p=PROG[u.prog];
 const courseSeg=[1,2,3,4].map(c=>`<button type="button" class="seg ${+u.course===c?'on':''}" data-act="lg-course" data-v="${c}">${c} курс<small>${LEVELS[c].title}</small></button>`).join('');
 return `<div class="card soft"><div class="eyebrow">Зимова практика · 5 кредитів ЄКТС</div><h2 style="margin-top:4px">Керуйте компанією разом зі студентами інших програм</h2><p class="muted" style="margin-top:6px;max-width:72ch">Вісім тижнів дистанційної практики. Кожен тиждень дорівнює місяцю роботи компанії. Ваш робочий пакет визначає, як спрацюють рішення команди, а команда разом відповідає за результат.</p>
  <div class="types" style="margin-top:12px">${TYPE_ORDER.map(k=>`<div class="type-tile"><div class="ic">${icon(TYPES[k].icon)}</div><div><b>${TYPES[k].name}</b><span>${TYPES[k].desc}</span></div></div>`).join('')}</div></div>
  <div class="card"><div class="card-h"><h2>Ваша роль у компанії</h2></div><div class="grid2" style="gap:12px">
   <div class="stack" style="gap:6px"><p class="small"><b>Програма:</b> ${esc(u.progName&&p&&u.progName!==p.name?u.progName:(p?p.name:u.prog))} <span class="chip">${esc(p?p.short:'')}</span></p>${u.progName&&p&&u.progName!==p.name?`<p class="small muted">Для цієї програми окремої ролі ще немає, тому в практиці вона працює за профілем програми «${esc(p.name)}».</p>`:''}<p class="small"><b>Курс:</b> ${u.course} · ${LEVELS[+u.course]?LEVELS[+u.course].title:''}</p><p class="small muted">Програма і курс беруться з профілю; роль у компанії система призначає за програмою.</p></div>
   <div class="field"><label for="f-group">Академічна група</label><input class="input" id="f-group" data-u="group" value="${esc(u.group||'')}" placeholder="ФБС-22"></div>
  </div>${S.loginError?`<div class="err" style="margin-top:10px">${esc(S.loginError)}</div>`:''}
  <div class="row" style="margin-top:14px"><button class="btn primary" data-act="pr-start">Увійти до своєї компанії</button></div>
  <p class="note" style="margin-top:12px">Демонстраційна версія: склад команд сформовано з прикладу даних, пакети колег заповнюються автоматично. Повний тижневий пакет на 6–8 годин зроблено для фінансової ролі (програма «Фінанси, банківська справа та страхування»).</p></div>
  ${levelCards(+u.course||1)}`;
}
return {bind,navItems,appBody,startBody,typeTiles:()=>TYPE_ORDER.map(k=>({name:TYPES[k].name,desc:TYPES[k].desc})),coordBody,onAct,onChange,onInput,onKey,hasRun:()=>!!(S&&S.L),history:()=>{try{return S&&S.L?S.L.states[myTeam().id].history:[];}catch(e){return[];}},state:()=>S,TOTAL_MONTHS,PROGRAMS,LEVELS,
 summary:()=>{if(!S||!S.L)return null;const team=myTeam(),st=S.L.states[team.id];return{team:team.name,type:TYPES[team.type].name,month:st.month,total:TOTAL_MONTHS,cash:st.cash,rep:st.rep,role:roleLabel(team.type,team.members[S.viewAs]||team.members[0]),od:st.od||0,debt:debtOf(st),stage:stageOf(st)};},
 grade:()=>{if(!S||!S.L||coordMode)return null;const g=gradeCalc(S,userIdxOf(S));return{total:g.total,gradedW:g.gradedW,pendingW:g.pendingW,incomplete:g.incomplete,final:g.final,cnt:g.cnt};},rules:()=>FIN};

})();
