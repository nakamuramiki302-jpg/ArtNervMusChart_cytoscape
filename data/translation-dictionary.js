// 解剖学用語の日本語-英語翻訳辞書
var anatomyTranslations = {
    // 筋肉系
    "筋肉": "muscle",
    "筋": "muscle",
    "括約筋": "sphincter",
    "肛門": "anal",
    "尿道": "urethral",
    "瞳孔": "pupil",
    "上腕": "brachial",
    "前腕": "forearm",
    "大腿": "femoral",
    "下腿": "leg",
    "胸": "thoracic",
    "腹": "abdominal",
    "背": "dorsal",
    
    // 血管系
    "動脈": "artery",
    "静脈": "vein",
    "血管": "vessel",
    "大動脈": "aorta",
    "頸動脈": "carotid",
    "冠動脈": "coronary",
    "腎動脈": "renal",
    "肝動脈": "hepatic",
    "脾動脈": "splenic",
    "腸間膜動脈": "mesenteric",
    "鎖骨下動脈": "subclavian",
    "腋窩動脈": "axillary",
    "上腕動脈": "brachial",
    "橈骨動脈": "radial",
    "尺骨動脈": "ulnar",
    "大腿動脈": "femoral",
    "膝窩動脈": "popliteal",
    "前脛骨動脈": "anterior tibial",
    "後脛骨動脈": "posterior tibial",
    "腓骨動脈": "fibular",
    "肩甲上動脈": "suprascapular",
    "肩甲回旋動脈": "circumflex scapular",
    "上腕深動脈": "deep brachial",
    "橈骨回旋動脈": "radial recurrent",
    "尺骨回旋動脈": "ulnar recurrent",
    "総掌側指動脈": "common palmar digital",
    "固有掌側指動脈": "proper palmar digital",
    "上殿動脈": "superior gluteal",
    "下殿動脈": "inferior gluteal",
    "内陰部動脈": "internal pudendal",
    "外側大腿回旋動脈": "lateral circumflex femoral",
    "内側大腿回旋動脈": "medial circumflex femoral",
    "下行膝動脈": "descending genicular",
    "前脛骨回旋動脈": "anterior tibial recurrent",
    "後脛骨回旋動脈": "posterior tibial recurrent",
    "腓骨動脈": "fibular",
    "足背動脈": "dorsalis pedis",
    "内側足底動脈": "medial plantar",
    "外側足底動脈": "lateral plantar",
    
    // 神経系
    "神経": "nerve",
    "脳": "brain",
    "脊髄": "spinal cord",
    "延髄": "medulla",
    "橋": "pons",
    "小脳": "cerebellum",
    "大脳": "cerebrum",
    "視神経": "optic nerve",
    "聴神経": "auditory nerve",
    "顔面神経": "facial nerve",
    "三叉神経": "trigeminal nerve",
    "迷走神経": "vagus nerve",
    "副神経": "accessory",
    "外転神経": "abducens",
    "頸神経": "cervical",
    "頸神経ワナ": "ansa cervicalis",
    "肩甲上神経": "suprascapular",
    "腋窩神経": "axillary",
    "筋皮神経": "musculocutaneous",
    "正中神経": "median",
    "橈骨神経": "radial",
    "尺骨神経": "ulnar",
    "大腿神経": "femoral",
    "閉鎖神経": "obturator",
    "坐骨神経": "sciatic",
    "総腓骨神経": "common peroneal",
    "脛骨神経": "tibial",
    
    // 骨格系
    "骨": "bone",
    "関節": "joint",
    "軟骨": "cartilage",
    "靭帯": "ligament",
    "腱": "tendon",
    "頭蓋骨": "skull",
    "脊椎": "vertebra",
    "肋骨": "rib",
    "胸骨": "sternum",
    "鎖骨": "clavicle",
    "肩甲骨": "scapula",
    "上腕骨": "humerus",
    "橈骨": "radius",
    "尺骨": "ulna",
    "骨盤": "pelvis",
    "大腿骨": "femur",
    "脛骨": "tibia",
    "腓骨": "fibula",
    
    // 臓器系
    "心臓": "heart",
    "肺": "lung",
    "肝臓": "liver",
    "腎臓": "kidney",
    "脾臓": "spleen",
    "胃": "stomach",
    "腸": "intestine",
    "膵臓": "pancreas",
    "胆嚢": "gallbladder",
    "膀胱": "bladder",
    
    // 方向・位置
    "前": "anterior",
    "後": "posterior",
    "上": "superior",
    "下": "inferior",
    "内側": "medial",
    "外側": "lateral",
    "深部": "deep",
    "浅部": "superficial",
    "近位": "proximal",
    "遠位": "distal",
    "左": "left",
    "右": "right",
    "中央": "central",
    "末梢": "peripheral",
    
    // 一般的な解剖学用語
    "内部": "internal",
    "外部": "external",
    "上行": "ascending",
    "下行": "descending",
    "横": "transverse",
    "縦": "longitudinal",
    "回旋": "circumflex",
    "貫通": "perforating",
    "分枝": "branch",
    "幹": "trunk",
    "網": "network",
    "弓": "arch",
    "洞": "sinus",
    "副": "accessory",
    "総": "common",
    "固有": "proper",
    "浅": "superficial",
    "深": "deep",
    "長": "long",
    "短": "short",
    "大": "major",
    "小": "minor",
    "最大": "maximus",
    "最小": "minimus",
    "回帰": "recurrent",
    "反回": "recurrent",
    "交通": "communicating",
    "穿通": "perforating",
    "栄養": "nutrient",
    "伴行": "accompanying",
    "肩甲": "scapular",
    "上腕": "humeral",
    "前腕": "antebrachial",
    "手根": "carpal",
    "掌側": "palmar",
    "背側": "dorsal",
    "殿": "gluteal",
    "陰部": "pudendal",
    "膝": "genicular",
    "足根": "tarsal",
    "足底": "plantar"
};

// 翻訳関数
function translateToEnglish(japaneseText) {
    if (!japaneseText) return "";
    
    let translatedText = japaneseText.toLowerCase();
    
    // 日本語が含まれているかチェック
    const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(japaneseText);
    
    if (!hasJapanese) {
        return japaneseText; // 既に英語の場合はそのまま返す
    }
    
    // 辞書を使って翻訳
    for (const [japanese, english] of Object.entries(anatomyTranslations)) {
        const regex = new RegExp(japanese, 'gi');
        translatedText = translatedText.replace(regex, english);
    }
    
    return translatedText;
}

// 部分マッチング検索用の関数
function findSimilarTerms(searchTerm) {
    const results = [];
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    // 日本語検索の場合
    const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(searchTerm);
    
    if (hasJapanese) {
        // 日本語キーワードから英語への変換
        for (const [japanese, english] of Object.entries(anatomyTranslations)) {
            if (japanese.includes(lowerSearchTerm) || lowerSearchTerm.includes(japanese)) {
                results.push(english);
            }
        }
    } else {
        // 英語検索の場合
        for (const [japanese, english] of Object.entries(anatomyTranslations)) {
            if (english.includes(lowerSearchTerm) || lowerSearchTerm.includes(english)) {
                results.push(english);
                results.push(japanese); // 対応する日本語も追加
            }
        }
    }
    
    return [...new Set(results)]; // 重複を除去
}