import { StoryElement } from '../store/storyStore'

// Pinyin mapping for common characters
const pinyinMap: Record<string, string> = {
  '小': 'xiǎo',
  '兔': 'tù',
  '子': 'zi',
  '熊': 'xióng',
  '貓': 'māo',
  '狗': 'gǒu',
  '鳥': 'niǎo',
  '魚': 'yú',
  '象': 'xiàng',
  '猴': 'hóu',
  '豬': 'zhū',
  '羊': 'yáng',
  '鴨': 'yā',
  '老': 'lǎo',
  '鼠': 'shǔ',
  '森': 'sēn',
  '林': 'lín',
  '海': 'hǎi',
  '邊': 'biān',
  '花': 'huā',
  '園': 'yuán',
  '城': 'chéng',
  '堡': 'bǎo',
  '農': 'nóng',
  '場': 'chǎng',
  '太': 'tài',
  '空': 'kōng',
  '彩': 'cǎi',
  '虹': 'hóng',
  '橋': 'qiáo',
  '魔': 'mó',
  '法': 'fǎ',
  '故': 'gù',
  '事': 'shì',
  '朋': 'péng',
  '友': 'yǒu',
  '勇': 'yǒng',
  '氣': 'qì',
  '分': 'fēn',
  '享': 'xiǎng',
  '幫': 'bāng',
  '助': 'zhù',
  '他': 'tā',
  '人': 'rén',
  '探': 'tàn',
  '險': 'xiǎn',
  '學': 'xué',
  '習': 'xí',
  '新': 'xīn',
  '技': 'jì',
  '能': 'néng',
  '在': 'zài',
  '裡': 'lǐ',
  '遇': 'yù',
  '到': 'dào',
  '了': 'le',
  '一': 'yī',
  '隻': 'zhī',
  '迷': 'mí',
  '路': 'lù',
  '的': 'de',
  '動': 'dòng',
  '物': 'wù',
  '決': 'jué',
  '定': 'dìng',
  '它': 'tā',
  '找': 'zhǎo',
  '回': 'huí',
  '家': 'jiā',
  '尋': 'xún',
  '過': 'guò',
  '程': 'chéng',
  '中': 'zhōng',
  '們': 'men',
  '成': 'chéng',
  '為': 'wéi',
  '最': 'zuì',
  '好': 'hǎo',
  '起': 'qǐ',
  '快': 'kuài',
  '樂': 'lè',
  '和': 'hé',
  '困': 'kùn',
  '難': 'nán'
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
          if (settings.showPinyin) {
            const pinyin = pinyinMap[char]
            if (pinyin) {
              formattedSentence += `<span class="inline-block relative mr-6"><span class="inline-block">${char}</span><span class="absolute left-full top-0 ml-1 text-xs leading-tight">${pinyin}</span></span>`
            } else {
              formattedSentence += char
            }
          } else if (settings.showZhuyin) {
            const zhuyin = combinedMap[char]
            if (zhuyin) {
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
        if (settings.showPinyin) {
          const pinyin = pinyinMap[char]
          if (pinyin) {
            // Display pinyin below the character for horizontal layout
            formattedText += `<span class="inline-block relative mr-4 mb-8"><span class="inline-block">${char}</span><span class="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs leading-tight">${pinyin}</span></span>`
          } else {
            formattedText += char
          }
        } else if (settings.showZhuyin) {
          const zhuyin = combinedMap[char]
          if (zhuyin) {
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