import { StoryElement } from '../store/storyStore'

// Comprehensive Pinyin mapping for all characters in basicZhuyinMap
const pinyinMap: Record<string, string> = {
  // Numbers
  '一': 'yī', '二': 'èr', '三': 'sān', '四': 'sì', '五': 'wǔ',
  '六': 'liù', '七': 'qī', '八': 'bā', '九': 'jiǔ', '十': 'shí',
  '百': 'bǎi', '千': 'qiān', '萬': 'wàn', '零': 'líng', '兩': 'liǎng',
  
  // Basic words
  '所': 'suǒ', '以': 'yǐ', '就': 'jiù', '會': 'huì', '能': 'néng',
  '可': 'kě', '要': 'yào', '想': 'xiǎng', '說': 'shuō', '話': 'huà',
  '聽': 'tīng', '看': 'kàn', '見': 'jiàn', '知': 'zhī', '道': 'dào',
  '學': 'xué', '習': 'xí', '教': 'jiào', '書': 'shū', '讀': 'dú',
  '寫': 'xiě', '字': 'zì', '詞': 'cí', '語': 'yǔ', '文': 'wén',
  
  // Size and comparison
  '小': 'xiǎo', '大': 'dà', '中': 'zhōng', '高': 'gāo', '低': 'dī',
  '長': 'cháng', '短': 'duǎn', '多': 'duō', '少': 'shǎo', '好': 'hǎo',
  '壞': 'huài', '新': 'xīn', '舊': 'jiù', '快': 'kuài', '慢': 'màn',
  '早': 'zǎo', '晚': 'wǎn', '美': 'měi', '醜': 'chǒu',
  
  // Emotions
  '愛': 'ài', '喜': 'xǐ', '歡': 'huān', '樂': 'lè', '開': 'kāi',
  '心': 'xīn', '興': 'xìng', '生': 'shēng', '氣': 'qì', '哭': 'kū',
  '笑': 'xiào',
  
  // Movement
  '來': 'lái', '去': 'qù', '到': 'dào', '走': 'zǒu', '跑': 'pǎo',
  '跳': 'tiào', '飛': 'fēi', '游': 'yóu', '泳': 'yǒng', '坐': 'zuò',
  '站': 'zhàn', '躺': 'tǎng', '睡': 'shuì', '起': 'qǐ', '床': 'chuáng',
  
  // Food and drink
  '吃': 'chī', '喝': 'hē', '食': 'shí', '物': 'wù', '飯': 'fàn',
  '菜': 'cài', '肉': 'ròu', '魚': 'yú', '蛋': 'dàn', '奶': 'nǎi',
  '水': 'shuǐ', '茶': 'chá', '咖': 'kā', '啡': 'fēi', '汁': 'zhī',
  
  // Family
  '家': 'jiā', '人': 'rén', '爸': 'bà', '媽': 'mā', '爺': 'yé',
  '哥': 'gē', '姐': 'jiě', '弟': 'dì', '妹': 'mèi', '朋': 'péng',
  '友': 'yǒu', '同': 'tóng', '老': 'lǎo', '師': 'shī',
  
  // Professions
  '醫': 'yī', '護': 'hù', '士': 'shì', '警': 'jǐng', '察': 'chá',
  '司': 'sī', '機': 'jī', '工': 'gōng', '農': 'nóng', '商': 'shāng',
  
  // School
  '校': 'xiào', '班': 'bān', '級': 'jí', '課': 'kè', '堂': 'táng',
  '室': 'shì', '圖': 'tú', '館': 'guǎn', '操': 'cāo', '場': 'chǎng',
  '公': 'gōng', '園': 'yuán',
  
  // Animals
  '動': 'dòng', '貓': 'māo', '狗': 'gǒu', '鳥': 'niǎo', '兔': 'tù',
  '子': 'zi', '熊': 'xióng', '象': 'xiàng', '猴': 'hóu', '豬': 'zhū',
  '羊': 'yáng', '牛': 'niú', '馬': 'mǎ', '雞': 'jī', '鴨': 'yā',
  '鵝': 'é', '蟲': 'chóng', '蝴': 'hú', '蝶': 'dié', '蜜': 'mì',
  '蜂': 'fēng', '螞': 'mǎ', '蟻': 'yǐ', '鼠': 'shǔ',
  
  // Plants and nature
  '花': 'huā', '草': 'cǎo', '樹': 'shù', '葉': 'yè', '根': 'gēn',
  '枝': 'zhī', '實': 'shí', '種': 'zhòng', '植': 'zhí', '森': 'sēn',
  '林': 'lín', '山': 'shān', '河': 'hé', '海': 'hǎi', '湖': 'hú',
  '池': 'chí', '塘': 'táng', '橋': 'qiáo', '路': 'lù', '街': 'jiē',
  '巷': 'xiàng',
  
  // Buildings
  '門': 'mén', '窗': 'chuāng', '牆': 'qiáng', '屋': 'wū', '房': 'fáng',
  '廳': 'tīng', '廚': 'chú', '浴': 'yù', '廁': 'cè', '樓': 'lóu',
  '梯': 'tī', '桌': 'zhuō', '椅': 'yǐ', '沙': 'shā', '發': 'fā',
  '城': 'chéng', '堡': 'bǎo',
  
  // Electronics
  '電': 'diàn', '視': 'shì', '冰': 'bīng', '箱': 'xiāng', '洗': 'xǐ',
  '衣': 'yī',
  
  // Transportation
  '車': 'chē', '船': 'chuán', '火': 'huǒ', '汽': 'qì', '共': 'gòng',
  '捷': 'jié', '運': 'yùn', '腳': 'jiǎo', '踏': 'tà', '計': 'jì',
  '程': 'chéng', '票': 'piào',
  
  // Money
  '錢': 'qián', '元': 'yuán', '塊': 'kuài', '角': 'jiǎo', '分': 'fēn',
  '買': 'mǎi', '賣': 'mài', '店': 'diàn', '市': 'shì', '超': 'chāo',
  '品': 'pǐn',
  
  // Directions
  '東': 'dōng', '西': 'xī', '南': 'nán', '北': 'běi', '左': 'zuǒ',
  '右': 'yòu', '前': 'qián', '後': 'hòu', '上': 'shàng', '下': 'xià',
  '裡': 'lǐ', '外': 'wài', '邊': 'biān', '旁': 'páng', '附': 'fù',
  '近': 'jìn', '遠': 'yuǎn', '對': 'duì', '面': 'miàn', '間': 'jiān',
  '之': 'zhī', '內': 'nèi', '除': 'chú', '還': 'hái', '也': 'yě',
  '都': 'dōu', '全': 'quán', '部': 'bù', '許': 'xǔ', '很': 'hěn',
  '非': 'fēi', '常': 'cháng', '特': 'tè', '別': 'bié', '真': 'zhēn',
  '正': 'zhèng', '確': 'què', '當': 'dāng', '然': 'rán', '突': 'tū',
  '忽': 'hū', '立': 'lì', '刻': 'kè', '現': 'xiàn',
  
  // Time
  '今': 'jīn', '天': 'tiān', '明': 'míng', '昨': 'zuó', '年': 'nián',
  '月': 'yuè', '日': 'rì', '星': 'xīng', '期': 'qī', '週': 'zhōu',
  '時': 'shí', '候': 'hòu', '鐘': 'zhōng', '秒': 'miǎo', '午': 'wǔ',
  '夜': 'yè', '點': 'diǎn',
  
  // Seasons and weather
  '春': 'chūn', '夏': 'xià', '秋': 'qiū', '冬': 'dōng', '季': 'jì',
  '節': 'jié', '晴': 'qíng', '陰': 'yīn', '雨': 'yǔ', '雪': 'xuě',
  '風': 'fēng', '雲': 'yún', '太': 'tài', '陽': 'yáng', '亮': 'liàng',
  '空': 'kōng', '地': 'dì', '球': 'qiú',
  
  // Countries and places
  '世': 'shì', '界': 'jiè', '國': 'guó', '鄉': 'xiāng', '村': 'cūn',
  '鎮': 'zhèn', '區': 'qū', '縣': 'xiàn', '省': 'shěng', '州': 'zhōu',
  '島': 'dǎo', '洲': 'zhōu', '台': 'tái', '灣': 'wān', '華': 'huá',
  '民': 'mín', '英': 'yīng', '法': 'fǎ', '德': 'dé', '本': 'běn',
  '韓': 'hán', '俄': 'é', '印': 'yìn', '度': 'dù', '泰': 'tài',
  '越': 'yuè', '加': 'jiā', '坡': 'pō', '亞': 'yà', '澳': 'ào',
  '歐': 'ōu',
  
  // Geography
  '極': 'jí', '赤': 'chì', '熱': 'rè', '帶': 'dài', '溫': 'wēn',
  '寒': 'hán', '漠': 'mò', '原': 'yuán', '平': 'píng', '盆': 'pén',
  '丘': 'qiū', '陵': 'líng', '峽': 'xiá', '谷': 'gǔ', '瀑': 'pù',
  '布': 'bù', '溪': 'xī', '流': 'liú', '江': 'jiāng', '泊': 'pō',
  '洋': 'yáng', '港': 'gǎng', '嶼': 'yǔ', '庫': 'kù', '壩': 'bà',
  '樑': 'liáng', '隧': 'suì', '鐵': 'tiě', '速': 'sù', '口': 'kǒu',
  
  // Culture and entertainment
  '院': 'yuàn', '博': 'bó', '術': 'shù', '音': 'yīn', '劇': 'jù',
  '影': 'yǐng', '體': 'tǐ', '育': 'yù', '遊': 'yóu', '貨': 'huò',
  '便': 'biàn', '利': 'lì', '餐': 'cān', '酒': 'jiǔ', '吧': 'bā',
  '網': 'wǎng', '銀': 'yín', '行': 'háng', '郵': 'yóu', '局': 'jú',
  
  // Safety and services
  '消': 'xiāo', '防': 'fáng', '隊': 'duì', '政': 'zhèng', '府': 'fǔ',
  '戶': 'hù', '事': 'shì', '務': 'wù', '健': 'jiàn', '保': 'bǎo',
  '稅': 'shuì', '監': 'jiān', '理': 'lǐ', '油': 'yóu', '停': 'tíng',
  '紅': 'hóng', '綠': 'lǜ', '燈': 'dēng', '斑': 'bān', '線': 'xiàn',
  '安': 'ān', '帽': 'mào', '救': 'jiù', '急': 'jí', '滅': 'miè',
  '器': 'qì', '緊': 'jǐn', '出': 'chū', '逃': 'táo', '報': 'bào',
  '員': 'yuán', '清': 'qīng', '潔': 'jié', '管': 'guǎn', '服': 'fú',
  '售': 'shòu', '收': 'shōu', '律': 'lǜ', '建': 'jiàn', '築': 'zhù',
  '設': 'shè', '式': 'shì', '頁': 'yè',
  
  // Health and beauty
  '糕': 'gāo', '髮': 'fà', '按': 'àn', '摩': 'mó', '身': 'shēn',
  '練': 'liàn', '瑜': 'yú', '珈': 'jiā', '舞': 'wǔ', '蹈': 'dǎo',
  
  // Education subjects
  '數': 'shù', '自': 'zì', '社': 'shè', '歷': 'lì', '史': 'shǐ',
  '化': 'huà', '科': 'kē', '資': 'zī', '訊': 'xùn', '腦': 'nǎo',
  '輔': 'fǔ', '導': 'dǎo', '主': 'zhǔ', '任': 'rèn', '組': 'zǔ',
  '副': 'fù', '紀': 'jì', '股': 'gǔ', '藝': 'yì', '衛': 'wèi',
  '康': 'kāng',
  
  // Story elements
  '深': 'shēn', '藍': 'lán', '巨': 'jù', '浪': 'làng',
  '退': 'tuì', '縮': 'suō', '敢': 'gǎn', '向': 'xiàng', '岸': 'àn',
  '證': 'zhèng', '己': 'jǐ', '通': 'tōng', '次': 'cì', '經': 'jīng',
  '結': 'jié', '交': 'jiāo', '活': 'huó', '戰': 'zhàn', '挑': 'tiāo',
  '雖': 'suī', '害': 'hài', '怕': 'pà', '吸': 'xī', '鼓': 'gǔ',
  '終': 'zhōng', '功': 'gōng', '克': 'kè', '烏': 'wū', '龜': 'guī',
  '找': 'zhǎo', '寶': 'bǎo', '藏': 'cáng', '誼': 'yì', '掉': 'diào',
  '輕': 'qīng', '把': 'bǎ', '巢': 'cháo', '感': 'gǎn', '謝': 'xiè',
  '集': 'jí', '穴': 'xué', '眼': 'yǎn', '手': 'shǒu',
  '包': 'bāo', '何': 'hé', '辨': 'biàn', '認': 'rèn', '不': 'bù',
  '掌': 'zhǎng', '握': 'wò', '技': 'jì', '變': 'biàn',
  '更': 'gèng', '信': 'xìn', '住': 'zhù', '隻': 'zhī', '聰': 'cōng',
  '成': 'chéng', '什': 'shén', '麼': 'me', '誰': 'shéi', '哪': 'nǎ',
  '怎': 'zěn', '而': 'ér', '且': 'qiě', '者': 'zhě', '及': 'jí',
  '跟': 'gēn', '像': 'xiàng',
  
  // Body parts
  '臉': 'liǎn', '睛': 'jīng', '鼻': 'bí', '嘴': 'zuǐ', '耳': 'ěr',
  '肚': 'dù', '背': 'bèi', '胸': 'xiōng', '腰': 'yāo', '腿': 'tuǐ',
  '膝': 'xī', '蓋': 'gài', '指': 'zhǐ',
  
  // Clothing
  '褲': 'kù', '裙': 'qún', '鞋': 'xié', '襪': 'wà', '鏡': 'jìng',
  
  // Actions
  '拿': 'ná', '抱': 'bào', '抓': 'zhuā', '推': 'tuī', '拉': 'lā',
  '打': 'dǎ', '踢': 'tī', '丟': 'diū', '撿': 'jiǎn', '刷': 'shuā',
  '擦': 'cā', '掃': 'sǎo', '拖': 'tuō', '整': 'zhěng', '拾': 'shí',
  '造': 'zào', '製': 'zhì', '作': 'zuò', '養': 'yǎng', '照': 'zhào',
  '顧': 'gù',
  
  // Qualities
  '夠': 'gòu', '滿': 'mǎn', '豐': 'fēng', '富': 'fù', '貧': 'pín',
  '窮': 'qióng', '容': 'róng', '易': 'yì', '簡': 'jiǎn', '複': 'fù',
  '雜': 'zá', '普': 'pǔ', '錯': 'cuò', '假': 'jiǎ', '虛': 'xū',
  '危': 'wēi', '靜': 'jìng', '吵': 'chǎo', '鬧': 'nào', '忙': 'máng',
  '閒': 'xián', '剛': 'gāng', '才': 'cái', '已': 'yǐ',
  '又': 'yòu', '總': 'zǒng', '永': 'yǒng', '始': 'shǐ', '束': 'shù',
  '完': 'wán', '畢': 'bì', '里': 'lǐ', '辦': 'bàn', '輸': 'shū',
  '直': 'zhí', '升': 'shēng', '箭': 'jiàn', '板': 'bǎn', '戲': 'xì',
  '軟': 'ruǎn', '硬': 'yìng', '料': 'liào', '檔': 'dàng', '案': 'àn',
  '驗': 'yàn',
  
  // Story specific words
  '神': 'shén', '秘': 'mì', '石': 'shí', '善': 'shàn', '故': 'gù',
  '障': 'zhàng', '黑': 'hēi', '暗': 'àn', '放': 'fàng', '棄': 'qì',
  '返': 'fǎn', '回': 'huí', '探': 'tàn', '險': 'xiǎn', '木': 'mù',
  '蘑': 'mó', '菇': 'gū', '魔': 'mó', '奇': 'qí', '妙': 'miào',
  '冒': 'mào', '迷': 'mí', '決': 'jué', '定': 'dìng', '尋': 'xún',
  '過': 'guò', '最': 'zuì', '困': 'kùn', '難': 'nán', '著': 'zhe',
  '修': 'xiū', '遇': 'yù', '勇': 'yǒng', '光': 'guāng', '頭': 'tóu',
  '努': 'nǔ', '力': 'lì', '棒': 'bàng',
  
  // Additional story words
  '茂': 'mào', '密': 'mì', '幫': 'bāng', '助': 'zhù', '享': 'xiǎng',
  '麗': 'lì', '朵': 'duǒ', '孤': 'gū', '單': 'dān', '陪': 'péi',
  '聊': 'liáo', '位': 'wèi', '用': 'yòng', '良': 'liáng', '暖': 'nuǎn',
  '玩': 'wán', '耍': 'shuǎ', '穫': 'huò', '味': 'wèi', '餓': 'è',
  '受': 'shòu', '籃': 'lán', '給': 'gěi', '讓': 'ràng', '充': 'chōng',
  '聲': 'shēng', '需': 'xū', '雄': 'xióng', '夫': 'fū', '病': 'bìng',
  '休': 'xiū', '息': 'xī', '彩': 'cǎi', '虹': 'hóng', '精': 'jīng',
  '靈': 'líng', '耐': 'nài', '引': 'yǐn', '送': 'sòng', '禮': 'lǐ',
  '古': 'gǔ', '隨': 'suí', '傳': 'chuán', '蔬': 'shū', '蘿': 'luó',
  '蔔': 'bo', '優': 'yōu', '巧': 'qiǎo', '堅': 'jiān', '持': 'chí',
  '懈': 'xiè', '失': 'shī', '敗': 'bài', '請': 'qǐng', '稍': 'shāo',
  '試': 'shì', '柔': 'róu', '女': 'nǚ', '性': 'xìng', '親': 'qīn',
  '切': 'qiē', '男': 'nán', '兒': 'ér', '童': 'tóng', '駕': 'jià',
  '駛': 'shǐ',
  '們': 'men', '為': 'wéi',
  '和': 'hé', '與': 'yǔ', '或': 'huò', '但': 'dàn', '是': 'shì',
  '有': 'yǒu', '沒': 'méi', '在': 'zài', '於': 'yú', '從': 'cóng',
  '了': 'le', '的': 'de', '得': 'dé'
}

// Basic Zhuyin mapping for common Chinese characters
const basicZhuyinMap: Record<string, string> = {
  '一': 'ㄧ',
  '二': 'ㄦˋ',
  '三': 'ㄙㄢ',
  '四': 'ㄙˋ',
  '五': 'ㄨˇ',
  '六': 'ㄌㄧㄡˋ',
  '七': 'ㄑㄧ',
  '八': 'ㄅㄚ',
  '九': 'ㄐㄧㄡˇ',
  '十': 'ㄕˊ',
  '百': 'ㄅㄞˇ',
  '千': 'ㄑㄧㄢ',
  '萬': 'ㄨㄢˋ',
  '零': 'ㄌㄧㄥˊ',
  '兩': 'ㄌㄧㄤˇ',
  '雙': 'ㄕㄨㄤ',
  '半': 'ㄅㄢˋ',
  '每': 'ㄇㄟˇ',
  '各': 'ㄍㄜˋ',
  '另': 'ㄌㄧㄥˋ',
  '其': 'ㄑㄧˊ',
  '此': 'ㄘˇ',
  '那': 'ㄋㄚˋ',
  '這': 'ㄓㄜˋ',
  '些': 'ㄒㄧㄝ',
  '個': 'ㄍㄜˋ',
  '們': 'ㄇㄣ˙',
  '他': 'ㄊㄚ',
  '她': 'ㄊㄚ',
  '它': 'ㄊㄚ',
  '我': 'ㄨㄛˇ',
  '你': 'ㄋㄧˇ',
  '您': 'ㄋㄧㄣˊ',
  '的': 'ㄉㄜ˙',
  '了': 'ㄌㄜ˙',
  '在': 'ㄗㄞˋ',
  '是': 'ㄕˋ',
  '有': 'ㄧㄡˇ',
  '和': 'ㄏㄜˊ',
  '與': 'ㄩˇ',
  '或': 'ㄏㄨㄛˋ',
  '但': 'ㄉㄢˋ',
  '如': 'ㄖㄨˊ',
  '果': 'ㄍㄨㄛˇ',
  '因': 'ㄧㄣ',
  '為': 'ㄨㄟˊ',
  '所': 'ㄙㄨㄛˇ',
  '以': 'ㄧˇ',
  '就': 'ㄐㄧㄡˋ',
  '會': 'ㄏㄨㄟˋ',
  '能': 'ㄋㄥˊ',
  '可': 'ㄎㄜˇ',
  '要': 'ㄧㄠˋ',
  '想': 'ㄒㄧㄤˇ',
  '說': 'ㄕㄨㄛ',
  '話': 'ㄏㄨㄚˋ',
  '聽': 'ㄊㄧㄥ',
  '看': 'ㄎㄢˋ',
  '見': 'ㄐㄧㄢˋ',
  '知': 'ㄓ',
  '道': 'ㄉㄠˋ',
  '學': 'ㄒㄩㄝˊ',
  '習': 'ㄒㄧˊ',
  '教': 'ㄐㄧㄠˋ',
  '書': 'ㄕㄨ',
  '讀': 'ㄉㄨˊ',
  '寫': 'ㄒㄧㄝˇ',
  '字': 'ㄗˋ',
  '詞': 'ㄘˊ',
  '語': 'ㄩˇ',
  '文': 'ㄨㄣˊ',
  '小': 'ㄒㄧㄠˇ',
  '大': 'ㄉㄚˋ',
  '中': 'ㄓㄨㄥ',
  '高': 'ㄍㄠ',
  '低': 'ㄉㄧ',
  '長': 'ㄔㄤˊ',
  '短': 'ㄉㄨㄢˇ',
  '多': 'ㄉㄨㄛ',
  '少': 'ㄕㄠˇ',
  '好': 'ㄏㄠˇ',
  '壞': 'ㄏㄨㄞˋ',
  '新': 'ㄒㄧㄣ',
  '舊': 'ㄐㄧㄡˋ',
  '快': 'ㄎㄨㄞˋ',
  '慢': 'ㄇㄢˋ',
  '早': 'ㄗㄠˇ',
  '晚': 'ㄨㄢˇ',
  '美': 'ㄇㄟˇ',
  '醜': 'ㄔㄡˇ',
  '愛': 'ㄞˋ',
  '喜': 'ㄒㄧˇ',
  '歡': 'ㄏㄨㄢ',
  '樂': 'ㄌㄜˋ',
  '開': 'ㄎㄞ',
  '心': 'ㄒㄧㄣ',
  '興': 'ㄒㄧㄥˋ',
  '生': 'ㄕㄥ',
  '氣': 'ㄑㄧˋ',
  '哭': 'ㄎㄨ',
  '笑': 'ㄒㄧㄠˋ',
  '來': 'ㄌㄞˊ',
  '去': 'ㄑㄩˋ',
  '到': 'ㄉㄠˋ',
  '走': 'ㄗㄡˇ',
  '跑': 'ㄆㄠˇ',
  '跳': 'ㄊㄧㄠˋ',
  '飛': 'ㄈㄟ',
  '游': 'ㄧㄡˊ',
  '泳': 'ㄩㄥˇ',
  '坐': 'ㄗㄨㄛˋ',
  '站': 'ㄓㄢˋ',
  '躺': 'ㄊㄤˇ',
  '睡': 'ㄕㄨㄟˋ',
  '起': 'ㄑㄧˇ',
  '床': 'ㄔㄨㄤˊ',
  '吃': 'ㄔ',
  '喝': 'ㄏㄜ',
  '食': 'ㄕˊ',
  '物': 'ㄨˋ',
  '飯': 'ㄈㄢˋ',
  '菜': 'ㄘㄞˋ',
  '肉': 'ㄖㄡˋ',
  '魚': 'ㄩˊ',
  '蛋': 'ㄉㄢˋ',
  '奶': 'ㄋㄞˇ',
  '水': 'ㄕㄨㄟˇ',
  '茶': 'ㄔㄚˊ',
  '咖': 'ㄎㄚ',
  '啡': 'ㄈㄟ',
  '汁': 'ㄓ',
  '家': 'ㄐㄧㄚ',
  '人': 'ㄖㄣˊ',
  '爸': 'ㄅㄚˋ',
  '媽': 'ㄇㄚ',
  '爺': 'ㄧㄝˊ',
  '哥': 'ㄍㄜ',
  '姐': 'ㄐㄧㄝˇ',
  '弟': 'ㄉㄧˋ',
  '妹': 'ㄇㄟˋ',
  '朋': 'ㄆㄥˊ',
  '友': 'ㄧㄡˇ',
  '同': 'ㄊㄨㄥˊ',
  '老': 'ㄌㄠˇ',
  '師': 'ㄕ',
  '醫': 'ㄧ',
  '護': 'ㄏㄨˋ',
  '士': 'ㄕˋ',
  '警': 'ㄐㄧㄥˇ',
  '察': 'ㄔㄚˊ',
  '司': 'ㄙ',
  '機': 'ㄐㄧ',
  '工': 'ㄍㄨㄥ',
  '農': 'ㄋㄨㄥˊ',
  '商': 'ㄕㄤ',
  '校': 'ㄒㄧㄠˋ',
  '班': 'ㄅㄢ',
  '級': 'ㄐㄧˊ',
  '課': 'ㄎㄜˋ',
  '堂': 'ㄊㄤˊ',
  '室': 'ㄕˋ',
  '圖': 'ㄊㄨˊ',
  '館': 'ㄍㄨㄢˇ',
  '操': 'ㄘㄠ',
  '場': 'ㄔㄤˊ',
  '公': 'ㄍㄨㄥ',
  '園': 'ㄩㄢˊ',
  '動': 'ㄉㄨㄥˋ',
  '貓': 'ㄇㄠ',
  '狗': 'ㄍㄡˇ',
  '鳥': 'ㄋㄧㄠˇ',
  '兔': 'ㄊㄨˋ',
  '子': 'ㄗˇ',
  '熊': 'ㄒㄩㄥˊ',
  '象': 'ㄒㄧㄤˋ',
  '猴': 'ㄏㄡˊ',
  '豬': 'ㄓㄨ',
  '羊': 'ㄧㄤˊ',
  '牛': 'ㄋㄧㄡˊ',
  '馬': 'ㄇㄚˇ',
  '雞': 'ㄐㄧ',
  '鴨': 'ㄧㄚ',
  '鵝': 'ㄜˊ',
  '蟲': 'ㄔㄨㄥˊ',
  '蝴': 'ㄏㄨˊ',
  '蝶': 'ㄉㄧㄝˊ',
  '蜜': 'ㄇㄧˋ',
  '蜂': 'ㄈㄥ',
  '螞': 'ㄇㄚˇ',
  '蟻': 'ㄧˇ',
  '花': 'ㄏㄨㄚ',
  '草': 'ㄘㄠˇ',
  '樹': 'ㄕㄨˋ',
  '葉': 'ㄧㄝˋ',
  '根': 'ㄍㄣ',
  '枝': 'ㄓ',
  '實': 'ㄕˊ',
  '種': 'ㄓㄨㄥˋ',
  '植': 'ㄓˊ',
  '森': 'ㄙㄣ',
  '林': 'ㄌㄧㄣˊ',
  '山': 'ㄕㄢ',
  '河': 'ㄏㄜˊ',
  '海': 'ㄏㄞˇ',
  '湖': 'ㄏㄨˊ',
  '池': 'ㄔˊ',
  '塘': 'ㄊㄤˊ',
  '橋': 'ㄑㄧㄠˊ',
  '路': 'ㄌㄨˋ',
  '街': 'ㄐㄧㄝ',
  '巷': 'ㄒㄧㄤˋ',
  '門': 'ㄇㄣˊ',
  '窗': 'ㄔㄨㄤ',
  '牆': 'ㄑㄧㄤˊ',
  '屋': 'ㄨ',
  '房': 'ㄈㄤˊ',
  '廳': 'ㄊㄧㄥ',
  '廚': 'ㄔㄨˊ',
  '浴': 'ㄩˋ',
  '廁': 'ㄘㄜˋ',
  '樓': 'ㄌㄡˊ',
  '梯': 'ㄊㄧ',
  '桌': 'ㄓㄨㄛ',
  '椅': 'ㄧˇ',
  '沙': 'ㄕㄚ',
  '發': 'ㄈㄚ',
  '電': 'ㄉㄧㄢˋ',
  '視': 'ㄕˋ',
  '冰': 'ㄅㄧㄥ',
  '箱': 'ㄒㄧㄤ',
  '洗': 'ㄒㄧˇ',
  '衣': 'ㄧ',
  '車': 'ㄔㄜ',
  '船': 'ㄔㄨㄢˊ',
  '火': 'ㄏㄨㄛˇ',
  '汽': 'ㄑㄧˋ',
  '共': 'ㄍㄨㄥˋ',
  '捷': 'ㄐㄧㄝˊ',
  '運': 'ㄩㄣˋ',
  '腳': 'ㄐㄧㄠˇ',
  '踏': 'ㄊㄚˋ',
  '計': 'ㄐㄧˋ',
  '程': 'ㄔㄥˊ',
  '票': 'ㄆㄧㄠˋ',
  '錢': 'ㄑㄧㄢˊ',
  '元': 'ㄩㄢˊ',
  '塊': 'ㄎㄨㄞˋ',
  '角': 'ㄐㄧㄠˇ',
  '分': 'ㄈㄣ',
  '買': 'ㄇㄞˇ',
  '賣': 'ㄇㄞˋ',
  '店': 'ㄉㄧㄢˋ',
  '市': 'ㄕˋ',
  '超': 'ㄔㄠ',
  '品': 'ㄆㄧㄣˇ',
  '東': 'ㄉㄨㄥ',
  '西': 'ㄒㄧ',
  '南': 'ㄋㄢˊ',
  '北': 'ㄅㄟˇ',
  '左': 'ㄗㄨㄛˇ',
  '右': 'ㄧㄡˋ',
  '前': 'ㄑㄧㄢˊ',
  '後': 'ㄏㄡˋ',
  '上': 'ㄕㄤˋ',
  '下': 'ㄒㄧㄚˋ',
  '裡': 'ㄌㄧˇ',
  '外': 'ㄨㄞˋ',
  '邊': 'ㄅㄧㄢ',
  '旁': 'ㄆㄤˊ',
  '附': 'ㄈㄨˋ',
  '近': 'ㄐㄧㄣˋ',
  '遠': 'ㄩㄢˇ',
  '對': 'ㄉㄨㄟˋ',
  '面': 'ㄇㄧㄢˋ',
  '間': 'ㄐㄧㄢ',
  '之': 'ㄓ',
  '內': 'ㄋㄟˋ',
  '除': 'ㄔㄨˊ',
  '還': 'ㄏㄞˊ',
  '也': 'ㄧㄝˇ',
  '都': 'ㄉㄡ',
  '全': 'ㄑㄩㄢˊ',
  '部': 'ㄅㄨˋ',
  '許': 'ㄒㄩˇ',
  '很': 'ㄏㄣˇ',
  '非': 'ㄈㄟ',
  '常': 'ㄔㄤˊ',
  '特': 'ㄊㄜˋ',
  '別': 'ㄅㄧㄝˊ',
  '真': 'ㄓㄣ',
  '正': 'ㄓㄥˋ',
  '確': 'ㄑㄩㄝˋ',
  '當': 'ㄉㄤ',
  '然': 'ㄖㄢˊ',
  '突': 'ㄊㄨ',
  '忽': 'ㄏㄨ',
  '立': 'ㄌㄧˋ',
  '刻': 'ㄎㄜˋ',
  '現': 'ㄒㄧㄢˋ',
  '今': 'ㄐㄧㄣ',
  '天': 'ㄊㄧㄢ',
  '明': 'ㄇㄧㄥˊ',
  '昨': 'ㄗㄨㄛˊ',
  '年': 'ㄋㄧㄢˊ',
  '月': 'ㄩㄝˋ',
  '日': 'ㄖˋ',
  '星': 'ㄒㄧㄥ',
  '期': 'ㄑㄧˊ',
  '週': 'ㄓㄡ',
  '時': 'ㄕˊ',
  '候': 'ㄏㄡˋ',
  '鐘': 'ㄓㄨㄥ',
  '秒': 'ㄇㄧㄠˇ',
  '午': 'ㄨˇ',
  '夜': 'ㄧㄝˋ',
  '點': 'ㄉㄧㄢˇ',
  '春': 'ㄔㄨㄣ',
  '夏': 'ㄒㄧㄚˋ',
  '秋': 'ㄑㄧㄡ',
  '冬': 'ㄉㄨㄥ',
  '季': 'ㄐㄧˋ',
  '節': 'ㄐㄧㄝˊ',
  '晴': 'ㄑㄧㄥˊ',
  '陰': 'ㄧㄣ',
  '雨': 'ㄩˇ',
  '雪': 'ㄒㄩㄝˇ',
  '風': 'ㄈㄥ',
  '雲': 'ㄩㄣˊ',
  '太': 'ㄊㄞˋ',
  '陽': 'ㄧㄤˊ',
  '亮': 'ㄌㄧㄤˋ',
  '空': 'ㄎㄨㄥ',
  '地': 'ㄉㄧˋ',
  '球': 'ㄑㄧㄡˊ',
  '世': 'ㄕˋ',
  '界': 'ㄐㄧㄝˋ',
  '國': 'ㄍㄨㄛˊ',
  '城': 'ㄔㄥˊ',
  '鄉': 'ㄒㄧㄤ',
  '村': 'ㄘㄨㄣ',
  '鎮': 'ㄓㄣˋ',
  '區': 'ㄑㄩ',
  '縣': 'ㄒㄧㄢˋ',
  '省': 'ㄕㄥˇ',
  '州': 'ㄓㄡ',
  '島': 'ㄉㄠˇ',
  '洲': 'ㄓㄡ',
  '台': 'ㄊㄞˊ',
  '灣': 'ㄨㄢ',
  '華': 'ㄏㄨㄚˊ',
  '民': 'ㄇㄧㄣˊ',
  '英': 'ㄧㄥ',
  '法': 'ㄈㄚˇ',
  '德': 'ㄉㄜˊ',
  '本': 'ㄅㄣˇ',
  '韓': 'ㄏㄢˊ',
  '俄': 'ㄜˊ',
  '印': 'ㄧㄣˋ',
  '度': 'ㄉㄨˋ',
  '泰': 'ㄊㄞˋ',
  '越': 'ㄩㄝˋ',
  '加': 'ㄐㄧㄚ',
  '坡': 'ㄆㄛ',
  '亞': 'ㄧㄚˋ',
  '澳': 'ㄠˋ',
  '歐': 'ㄡ',
  '極': 'ㄐㄧˊ',
  '赤': 'ㄔˋ',
  '熱': 'ㄖㄜˋ',
  '帶': 'ㄉㄞˋ',
  '溫': 'ㄨㄣ',
  '寒': 'ㄏㄢˊ',
  '漠': 'ㄇㄛˋ',
  '原': 'ㄩㄢˊ',
  '平': 'ㄆㄧㄥˊ',
  '盆': 'ㄆㄣˊ',
  '丘': 'ㄑㄧㄡ',
  '陵': 'ㄌㄧㄥˊ',
  '峽': 'ㄒㄧㄚˊ',
  '谷': 'ㄍㄨˇ',
  '瀑': 'ㄆㄨˋ',
  '布': 'ㄅㄨˋ',
  '溪': 'ㄒㄧ',
  '流': 'ㄌㄧㄡˊ',
  '江': 'ㄐㄧㄤ',
  '泊': 'ㄆㄛ',
  '洋': 'ㄧㄤˊ',
  '港': 'ㄍㄤˇ',
  '嶼': 'ㄩˇ',
  '庫': 'ㄎㄨˋ',
  '壩': 'ㄅㄚˋ',
  '樑': 'ㄌㄧㄤˊ',
  '隧': 'ㄙㄨㄟˋ',
  '鐵': 'ㄊㄧㄝˇ',
  '速': 'ㄙㄨˋ',
  '口': 'ㄎㄡˇ',
  '院': 'ㄩㄢˋ',
  '博': 'ㄅㄛˊ',
  '術': 'ㄕㄨˋ',
  '音': 'ㄧㄣ',
  '劇': 'ㄐㄩˋ',
  '影': 'ㄧㄥˇ',
  '體': 'ㄊㄧˇ',
  '育': 'ㄩˋ',
  '遊': 'ㄧㄡˊ',
  '貨': 'ㄏㄨㄛˋ',
  '便': 'ㄅㄧㄢˋ',
  '利': 'ㄌㄧˋ',
  '餐': 'ㄘㄢ',
  '酒': 'ㄐㄧㄡˇ',
  '吧': 'ㄅㄚ',
  '網': 'ㄨㄤˇ',
  '銀': 'ㄧㄣˊ',
  '行': 'ㄏㄤˊ',
  '郵': 'ㄧㄡˊ',
  '局': 'ㄐㄩˊ',
  '消': 'ㄒㄧㄠ',
  '防': 'ㄈㄤˊ',
  '隊': 'ㄉㄨㄟˋ',
  '政': 'ㄓㄥˋ',
  '府': 'ㄈㄨˇ',
  '戶': 'ㄏㄨˋ',
  '事': 'ㄕˋ',
  '務': 'ㄨˋ',
  '健': 'ㄐㄧㄢˋ',
  '保': 'ㄅㄠˇ',
  '稅': 'ㄕㄨㄟˋ',
  '監': 'ㄐㄧㄢ',
  '理': 'ㄌㄧˇ',
  '油': 'ㄧㄡˊ',
  '停': 'ㄊㄧㄥˊ',
  '紅': 'ㄏㄨㄥˊ',
  '綠': 'ㄌㄩˋ',
  '燈': 'ㄉㄥ',
  '斑': 'ㄅㄢ',
  '線': 'ㄒㄧㄢˋ',
  '安': 'ㄢ',
  '帽': 'ㄇㄠˋ',
  '救': 'ㄐㄧㄡˋ',
  '急': 'ㄐㄧˊ',
  '滅': 'ㄇㄧㄝˋ',
  '器': 'ㄑㄧˋ',
  '緊': 'ㄐㄧㄣˇ',
  '出': 'ㄔㄨ',
  '逃': 'ㄊㄠˊ',
  '報': 'ㄅㄠˋ',
  '員': 'ㄩㄢˊ',
  '清': 'ㄑㄧㄥ',
  '潔': 'ㄐㄧㄝˊ',
  '管': 'ㄍㄨㄢˇ',
  '服': 'ㄈㄨˊ',
  '售': 'ㄕㄡˋ',
  '收': 'ㄕㄡ',
  '律': 'ㄌㄩˋ',
  '建': 'ㄐㄧㄢˋ',
  '築': 'ㄓㄨˋ',
  '設': 'ㄕㄜˋ',
  '式': 'ㄕˋ',
  '頁': 'ㄧㄝˋ',
  '糕': 'ㄍㄠ',
  '髮': 'ㄈㄚˇ',
  '按': 'ㄢˋ',
  '摩': 'ㄇㄛˊ',
  '身': 'ㄕㄣ',
  '練': 'ㄌㄧㄢˋ',
  '瑜': 'ㄩˊ',
  '珈': 'ㄐㄧㄚ',
  '舞': 'ㄨˇ',
  '蹈': 'ㄉㄠˇ',
  '數': 'ㄕㄨˋ',
  '自': 'ㄗˋ',
  '社': 'ㄕㄜˋ',
  '歷': 'ㄌㄧˋ',
  '史': 'ㄕˇ',
  '化': 'ㄏㄨㄚˋ',
  '科': 'ㄎㄜ',
  '資': 'ㄗ',
  '訊': 'ㄒㄩㄣˋ',
  '腦': 'ㄋㄠˇ',
  '輔': 'ㄈㄨˇ',
  '導': 'ㄉㄠˇ',
  '主': 'ㄓㄨˇ',
  '任': 'ㄖㄣˋ',
  '組': 'ㄗㄨˇ',
  '副': 'ㄈㄨˋ',
  '紀': 'ㄐㄧˋ',
  '股': 'ㄍㄨˇ',
  '藝': 'ㄧˋ',
  '衛': 'ㄨㄟˋ',
  '康': 'ㄎㄤ',
  '深': 'ㄕㄣ',
  '藍': 'ㄌㄢˊ',
  '巨': 'ㄐㄩˋ',
  '浪': 'ㄌㄤˋ',
  '沒': 'ㄇㄟˊ',
  '退': 'ㄊㄨㄟˋ',
  '縮': 'ㄙㄨㄛ',
  '敢': 'ㄍㄢˇ',
  '向': 'ㄒㄧㄤˋ',
  '岸': 'ㄢˋ',
  '證': 'ㄓㄥˋ',
  '己': 'ㄐㄧˇ',
  '通': 'ㄊㄨㄥ',
  '次': 'ㄘˋ',
  '經': 'ㄐㄧㄥ',
  '結': 'ㄐㄧㄝˊ',
  '交': 'ㄐㄧㄠ',
  '活': 'ㄏㄨㄛˊ',
  '戰': 'ㄓㄢˋ',
  '挑': 'ㄊㄧㄠ',
  '雖': 'ㄙㄨㄟ',
  '害': 'ㄏㄞˋ',
  '怕': 'ㄆㄚˋ',
  '吸': 'ㄒㄧ',
  '鼓': 'ㄍㄨˇ',
  '終': 'ㄓㄨㄥ',
  '功': 'ㄍㄨㄥ',
  '克': 'ㄎㄜˋ',
  '烏': 'ㄨ',
  '龜': 'ㄍㄨㄟ',
  '找': 'ㄓㄠˇ',
  '寶': 'ㄅㄠˇ',
  '藏': 'ㄘㄤˊ',
  '誼': 'ㄧˋ',
  '掉': 'ㄉㄧㄠˋ',
  '輕': 'ㄑㄧㄥ',
  '把': 'ㄅㄚˇ',
  '巢': 'ㄔㄠˊ',
  '感': 'ㄍㄢˇ',
  '謝': 'ㄒㄧㄝˋ',
  '集': 'ㄐㄧˊ',
  '穴': 'ㄒㄩㄝˋ',
  '從': 'ㄘㄨㄥˊ',
  '眼': 'ㄧㄢˇ',
  '手': 'ㄕㄡˇ',
  '包': 'ㄅㄠ',
  '何': 'ㄏㄜˊ',
  '辨': 'ㄅㄧㄢˋ',
  '認': 'ㄖㄣˋ',
  '不': 'ㄅㄨˋ',
  '掌': 'ㄓㄤˇ',
  '握': 'ㄨㄛˋ',
  '技': 'ㄐㄧˋ',
  '變': 'ㄅㄧㄢˋ',
  '得': 'ㄉㄜˊ',
  '更': 'ㄍㄥˋ',
  '信': 'ㄒㄧㄣˋ',
  '住': 'ㄓㄨˋ',
  '隻': 'ㄓ',
  '聰': 'ㄘㄨㄥ',
  '成': 'ㄔㄥˊ',
  '什': 'ㄕㄣˊ',
  '麼': 'ㄇㄜ˙',
  '誰': 'ㄕㄟˊ',
  '哪': 'ㄋㄚˇ',
  '怎': 'ㄗㄣˇ',
  '而': 'ㄦˊ',
  '且': 'ㄑㄧㄝˇ',
  '者': 'ㄓㄜˇ',
  '及': 'ㄐㄧˊ',
  '跟': 'ㄍㄣ',
  '像': 'ㄒㄧㄤˋ',
  '臉': 'ㄌㄧㄢˇ',
  '睛': 'ㄐㄧㄥ',
  '鼻': 'ㄅㄧˊ',
  '嘴': 'ㄗㄨㄟˇ',
  '耳': 'ㄦˇ',
  '肚': 'ㄉㄨˋ',
  '背': 'ㄅㄟˋ',
  '胸': 'ㄒㄩㄥ',
  '腰': 'ㄧㄠ',
  '腿': 'ㄊㄨㄟˇ',
  '膝': 'ㄒㄧ',
  '蓋': 'ㄍㄞˋ',
  '指': 'ㄓˇ',
  '褲': 'ㄎㄨˋ',
  '裙': 'ㄑㄩㄣˊ',
  '鞋': 'ㄒㄧㄝˊ',
  '襪': 'ㄨㄚˋ',
  '鏡': 'ㄐㄧㄥˋ',
  '拿': 'ㄋㄚˊ',
  '抱': 'ㄅㄠˋ',
  '抓': 'ㄓㄨㄚ',
  '推': 'ㄊㄨㄟ',
  '拉': 'ㄌㄚ',
  '打': 'ㄉㄚˇ',
  '踢': 'ㄊㄧ',
  '丟': 'ㄉㄧㄡ',
  '撿': 'ㄐㄧㄢˇ',
  '刷': 'ㄕㄨㄚ',
  '擦': 'ㄘㄚ',
  '掃': 'ㄙㄠˇ',
  '拖': 'ㄊㄨㄛ',
  '整': 'ㄓㄥˇ',
  '拾': 'ㄕˊ',
  '造': 'ㄗㄠˋ',
  '製': 'ㄓˋ',
  '作': 'ㄗㄨㄛˋ',
  '養': 'ㄧㄤˇ',
  '照': 'ㄓㄠˋ',
  '顧': 'ㄍㄨˋ',
  '夠': 'ㄍㄡˋ',
  '滿': 'ㄇㄢˇ',
  '豐': 'ㄈㄥ',
  '富': 'ㄈㄨˋ',
  '貧': 'ㄆㄧㄣˊ',
  '窮': 'ㄑㄩㄥˊ',
  '容': 'ㄖㄨㄥˊ',
  '易': 'ㄧˋ',
  '簡': 'ㄐㄧㄢˇ',
  '複': 'ㄈㄨˋ',
  '雜': 'ㄗㄚˊ',
  '普': 'ㄆㄨˇ',
  '錯': 'ㄘㄨㄛˋ',
  '假': 'ㄐㄧㄚˇ',
  '虛': 'ㄒㄩ',
  '危': 'ㄨㄟˊ',
  '靜': 'ㄐㄧㄥˋ',
  '吵': 'ㄔㄠˇ',
  '鬧': 'ㄋㄠˋ',
  '忙': 'ㄇㄤˊ',
  '閒': 'ㄒㄧㄢˊ',
  '剛': 'ㄍㄤ',
  '才': 'ㄘㄞˊ',
  '已': 'ㄧˇ',
  '再': 'ㄗㄞˋ',
  '又': 'ㄧㄡˋ',
  '總': 'ㄗㄨㄥˇ',
  '永': 'ㄩㄥˇ',
  '始': 'ㄕˇ',
  '束': 'ㄕㄨˋ',
  '完': 'ㄨㄢˊ',
  '畢': 'ㄅㄧˋ',
  '里': 'ㄌㄧˇ',
  '辦': 'ㄅㄢˋ',
  '輸': 'ㄕㄨ',
  '直': 'ㄓˊ',
  '升': 'ㄕㄥ',
  '箭': 'ㄐㄧㄢˋ',
  '板': 'ㄅㄢˇ',
  '戲': 'ㄒㄧˋ',
  '軟': 'ㄖㄨㄢˇ',
  '硬': 'ㄧㄥˋ',
  '料': 'ㄌㄧㄠˋ',
  '檔': 'ㄉㄤˋ',
  '案': 'ㄢˋ',
  '驗': 'ㄧㄢˋ',
  '駕': 'ㄐㄧㄚˋ',
  '駛': 'ㄕˇ',
  '神': 'ㄕㄣˊ',
  '秘': 'ㄇㄧˋ',
  '石': 'ㄕˊ',
  '善': 'ㄕㄢˋ',
  '故': 'ㄍㄨˋ',
  '障': 'ㄓㄤˋ',
  '黑': 'ㄏㄟ',
  '暗': 'ㄢˋ',
  '放': 'ㄈㄤˋ',
  '棄': 'ㄑㄧˋ',
  '返': 'ㄈㄢˇ',
  '回': 'ㄏㄨㄟˊ',
  '探': 'ㄊㄢˋ',
  '險': 'ㄒㄧㄢˇ',
  '木': 'ㄇㄨˋ',
  '蘑': 'ㄇㄛˊ',
  '菇': 'ㄍㄨ',
  '魔': 'ㄇㄛˊ',
  '奇': 'ㄑㄧˊ',
  '妙': 'ㄇㄧㄠˋ',
  '冒': 'ㄇㄠˋ',
  '迷': 'ㄇㄧˊ',
  '決': 'ㄐㄩㄝˊ',
  '定': 'ㄉㄧㄥˋ',
  '尋': 'ㄒㄩㄣˊ',
  '過': 'ㄍㄨㄛˋ',
  '最': 'ㄗㄨㄟˋ',
  '困': 'ㄎㄨㄣˋ',
  '難': 'ㄋㄢˊ',
  '著': 'ㄓㄜ˙',
  '修': 'ㄒㄧㄡ',
  '遇': 'ㄩˋ',
  '勇': 'ㄩㄥˇ',
  '光': 'ㄍㄨㄤ',
  '頭': 'ㄊㄡˊ',
  '努': 'ㄋㄨˇ',
  '力': 'ㄌㄧˋ',
  '棒': 'ㄅㄤˋ',
  // 故事模板中缺失的字符
  '茂': 'ㄇㄠˋ',
  '密': 'ㄇㄧˋ',
  '幫': 'ㄅㄤ',
  '助': 'ㄓㄨˋ',
  '享': 'ㄒㄧㄤˇ',
  '麗': 'ㄌㄧˋ',
  '朵': 'ㄉㄨㄛˇ',
  '孤': 'ㄍㄨ',
  '單': 'ㄉㄢ',
  '陪': 'ㄆㄟˊ',
  '聊': 'ㄌㄧㄠˊ',
  '堡': 'ㄅㄠˇ',
  '位': 'ㄨㄟˋ',
  '用': 'ㄩㄥˋ',
  '良': 'ㄌㄧㄤˊ',
  '暖': 'ㄋㄨㄢˇ',
  '玩': 'ㄨㄢˊ',
  '耍': 'ㄕㄨㄚˇ',
  '穫': 'ㄏㄨㄛˋ',
  '味': 'ㄨㄟˋ',
  '餓': 'ㄜˋ',
  '受': 'ㄕㄡˋ',
  '籃': 'ㄌㄢˊ',
  '給': 'ㄍㄟˇ',
  '讓': 'ㄖㄤˋ',
  '充': 'ㄔㄨㄥ',
  '聲': 'ㄕㄥ',
  '需': 'ㄒㄩ',
  '雄': 'ㄒㄩㄥˊ',
  '夫': 'ㄈㄨ',
  '病': 'ㄅㄧㄥˋ',
  '休': 'ㄒㄧㄡ',
  '息': 'ㄒㄧˊ',
  '彩': 'ㄘㄞˇ',
  '虹': 'ㄏㄨㄥˊ',
  '精': 'ㄐㄧㄥ',
  '靈': 'ㄌㄧㄥˊ',
  '耐': 'ㄋㄞˋ',
  '引': 'ㄧㄣˇ',
  '送': 'ㄙㄨㄥˋ',
  '禮': 'ㄌㄧˇ',
  '古': 'ㄍㄨˇ',
  '隨': 'ㄙㄨㄟˊ',
  '傳': 'ㄔㄨㄢˊ',
  '蔬': 'ㄕㄨ',
  '蘿': 'ㄌㄨㄛˊ',
  '蔔': 'ㄅㄨˊ',
  '優': 'ㄧㄡ',
  '巧': 'ㄑㄧㄠˇ',
  '堅': 'ㄐㄧㄢ',
  '持': 'ㄔˊ',
  '懈': 'ㄒㄧㄝˋ',
  '失': 'ㄕ',
  '敗': 'ㄅㄞˋ',
  '請': 'ㄑㄧㄥˇ',
  '稍': 'ㄕㄠ',
  '試': 'ㄕˋ',
  '柔': 'ㄖㄡˊ',
  '女': 'ㄋㄩˇ',
  '性': 'ㄒㄧㄥˋ',
  '親': 'ㄑㄧㄣ',
  '切': 'ㄑㄧㄝ',
  '男': 'ㄋㄢˊ',
  '兒': 'ㄦˊ',
  '童': 'ㄊㄨㄥˊ',
  '鼠': 'ㄕㄨˇ'
}

// English translation mapping
const englishMap: Record<string, string> = {
  '小兔子': 'Little Rabbit',
  '小熊': 'Little Bear',
  '小貓': 'Little Cat',
  '小狗': 'Little Dog',
  '小鳥': 'Little Bird',
  '小魚': 'Little Fish',
  '小象': 'Little Elephant',
  '小猴子': 'Little Monkey',
  '小豬': 'Little Pig',
  '小羊': 'Little Sheep',
  '小鴨': 'Little Duck',
  '小老鼠': 'Little Mouse',
  '森林': 'Forest',
  '海邊': 'Beach',
  '花園': 'Garden',
  '城堡': 'Castle',
  '農場': 'Farm',
  '太空': 'Space',
  '彩虹橋': 'Rainbow Bridge',
  '魔法森林': 'Magic Forest',
  '故事': 'Story',
  '朋友': 'Friend',
  '勇氣': 'Courage',
  '分享': 'Sharing',
  '幫助': 'Help',
  '探險': 'Adventure',
  '學習': 'Learning',
  '快樂': 'Happy',
  '困難': 'Difficulty',
  '寶藏': 'Treasure'
}

// Custom Zhuyin mapping for user-added characters
let customZhuyinMap: Record<string, string> = {}

// Function to add custom Zhuyin mapping
export const addCustomZhuyinMapping = (character: string, zhuyin: string): void => {
  customZhuyinMap[character] = zhuyin
}

// Function to get combined Zhuyin map (basic + custom)
export const getCombinedZhuyinMap = (): Record<string, string> => {
  return { ...basicZhuyinMap, ...customZhuyinMap }
}

// Function to suggest missing Zhuyin characters
export const suggestMissingZhuyinCharacters = (text: string): string[] => {
  const combinedMap = getCombinedZhuyinMap()
  const missingChars: string[] = []
  
  for (const char of text) {
    if (char.match(/[\u4e00-\u9fff]/) && !combinedMap[char]) {
      if (!missingChars.includes(char)) {
        missingChars.push(char)
      }
    }
  }
  
  return missingChars
}

// Function to auto-generate Zhuyin mapping for missing characters
export const autoGenerateZhuyinMapping = (text: string): { generatedCount: number; totalMissing: number; mapping: Record<string, string> } => {
  const missingChars = suggestMissingZhuyinCharacters(text)
  const autoMapping: Record<string, string> = {}
  let generatedCount = 0
  
  // This is a simplified mapping - in a real application, you'd use a proper Zhuyin conversion library
  const commonMappings: Record<string, string> = {
    '太': 'ㄊㄞˋ',
    '遇': 'ㄩˋ',
    '到': 'ㄉㄠˋ',
    '了': 'ㄌㄜ˙',
    '障': 'ㄓㄤˋ',
    '在': 'ㄗㄞˋ',
    '黑': 'ㄏㄟ',
    '暗': 'ㄢˋ',
    '沒': 'ㄇㄟˊ',
    '修': 'ㄒㄧㄡ',
    '理': 'ㄌㄧˇ',
    '最': 'ㄗㄨㄟˋ',
    '終': 'ㄓㄨㄥ'
  }
   
   for (const char of missingChars) {
     if (commonMappings[char]) {
       autoMapping[char] = commonMappings[char]
       addCustomZhuyinMapping(char, commonMappings[char])
       generatedCount++
     }
   }
   
   return {
     generatedCount,
     totalMissing: missingChars.length,
     mapping: autoMapping
   }
}

// Load custom mappings from localStorage
const loadCustomMappings = (): void => {
  try {
    const saved = localStorage.getItem('customZhuyinMap')
    if (saved) {
      customZhuyinMap = JSON.parse(saved)
    }
  } catch (error) {
    console.warn('Failed to load custom Zhuyin mappings:', error)
  }
}

// Save custom mappings to localStorage
const saveCustomMappings = (): void => {
  try {
    localStorage.setItem('customZhuyinMap', JSON.stringify(customZhuyinMap))
  } catch (error) {
    console.warn('Failed to save custom Zhuyin mappings:', error)
  }
}

// Initialize custom mappings on load
loadCustomMappings()

// Override addCustomZhuyinMapping to include persistence
export const addCustomZhuyinMappingPersistent = (character: string, zhuyin: string): void => {
  customZhuyinMap[character] = zhuyin
  saveCustomMappings()
}

// Function to check Zhuyin coverage for a given text
export const checkZhuyinCoverage = (text: string): { hasFullCoverage: boolean; missingChars: string[] } => {
  const combinedMap = getCombinedZhuyinMap()
  const missingChars: string[] = []
  
  for (const char of text) {
    if (char.match(/[\u4e00-\u9fff]/) && !combinedMap[char]) {
      if (!missingChars.includes(char)) {
        missingChars.push(char)
      }
    }
  }
  
  return {
    hasFullCoverage: missingChars.length === 0,
    missingChars
  }
}

// Function to get missing Zhuyin suggestions
export const getMissingZhuyinSuggestions = (text: string): string[] => {
  return suggestMissingZhuyinCharacters(text)
}

// Function to format text with Zhuyin based on settings
export const formatTextWithSettings = (text: string, settings: any): string | string[] => {
  console.log('formatTextWithSettings called with settings:', settings)
  console.log('showPinyin:', settings.showPinyin, 'showZhuyin:', settings.showZhuyin)
  console.log('pinyinMap available:', !!pinyinMap)
  console.log('Sample pinyinMap entries:', { '小': pinyinMap['小'], '兔': pinyinMap['兔'], '子': pinyinMap['子'] })
  
  if (!settings.showZhuyin && !settings.showPinyin) {
    if (settings.verticalLayout) {
      // Split text into columns for vertical layout
      const sentences = text.split('。').filter(s => s.trim())
      return sentences.map(sentence => sentence + '。')
    }
    return text
  }
  
  const combinedMap = getCombinedZhuyinMap()
  
  if (settings.verticalLayout) {
    // For vertical layout, split text into columns
    const sentences = text.split('。').filter(s => s.trim())
    return sentences.map(sentence => {
      let formattedSentence = ''
      const fullSentence = sentence + '。'
      
      for (const char of fullSentence) {
        if (char.match(/[\u4e00-\u9fff]/)) {
          console.log(`Processing char: ${char}, showPinyin: ${settings.showPinyin}, pinyinMap[${char}]: ${pinyinMap[char]}`)
          if (settings.showPinyin && pinyinMap[char]) {
            const pinyin = pinyinMap[char]
            console.log(`Adding pinyin for ${char}: ${pinyin}`)
            formattedSentence += `<span class="inline-block relative mr-6"><span class="inline-block">${char}</span><span class="absolute left-full top-0 ml-1 text-xs leading-tight">${pinyin}</span></span>`
          } else if (settings.showZhuyin && combinedMap[char]) {
            const zhuyin = combinedMap[char]
            // Split zhuyin into individual characters for vertical display
            const zhuyinChars = zhuyin.split('')
            const zhuyinSpans = zhuyinChars.map(zhChar => 
              `<span class="block text-center">${zhChar}</span>`
            ).join('')
            
            formattedSentence += `<span class="inline-block relative mr-8"><span class="inline-block">${char}</span><span class="absolute left-full top-0 ml-1 flex flex-col items-center justify-start h-full text-xs leading-tight">${zhuyinSpans}</span></span>`
          } else {
            formattedSentence += char
          }
        } else {
          formattedSentence += char
        }
      }
      
      return formattedSentence
    })
  } else {
    // For horizontal layout
    let formattedText = ''
    
    for (const char of text) {
      if (char.match(/[\u4e00-\u9fff]/)) {
        console.log(`Horizontal - Processing char: ${char}, showPinyin: ${settings.showPinyin}, pinyinMap[${char}]: ${pinyinMap[char]}`)
        if (settings.showPinyin && pinyinMap[char]) {
          const pinyin = pinyinMap[char]
          console.log(`Horizontal - Adding pinyin for ${char}: ${pinyin}`)
          // Display pinyin below the character for horizontal layout
          formattedText += `<span class="inline-block relative mr-4 mb-8"><span class="inline-block">${char}</span><span class="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs leading-tight">${pinyin}</span></span>`
        } else if (settings.showZhuyin && combinedMap[char]) {
          const zhuyin = combinedMap[char]
          // Split zhuyin into individual characters for vertical display below the character
          const zhuyinChars = zhuyin.split('')
          const zhuyinSpans = zhuyinChars.map(zhChar => 
            `<span class="block text-center">${zhChar}</span>`
          ).join('')
          
          formattedText += `<span class="inline-block relative mr-4 mb-16"><span class="inline-block">${char}</span><span class="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 flex flex-col items-center justify-start text-xs leading-tight">${zhuyinSpans}</span></span>`
        } else {
          formattedText += char
        }
      } else {
        formattedText += char
      }
    }
    
    return formattedText
  }
}

// Function to get font size class based on settings
export const getFontSizeClass = (fontSize: string): string => {
  switch (fontSize) {
    case 'small': return 'text-sm'
    case 'medium': return 'text-base'
    case 'large': return 'text-lg'
    case 'extra-large': return 'text-xl'
    default: return 'text-base'
  }
}