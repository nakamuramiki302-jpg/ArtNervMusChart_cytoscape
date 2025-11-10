// 翻訳データローダー
// all_body_muscles.jsonから翻訳マッピングを生成

var translationMap = {
    enToJp: {},  // 英語 → 日本語
    jpToEn: {}   // 日本語 → 英語
};

var translationDataLoaded = false;

// 翻訳データを読み込む関数
function loadTranslationData() {
    console.log('=== 翻訳データ読み込み開始 ===');
    
    fetch('data/translations.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('翻訳データの読み込みに失敗しました');
            }
            return response.json();
        })
        .then(data => {
            console.log('翻訳JSONデータ取得成功');
            
            // JSONデータから翻訳マッピングを構築
            let entryCount = 0;
            
            // 各カテゴリーを処理
            for (const category in data) {
                if (Array.isArray(data[category])) {
                    data[category].forEach(item => {
                        if (item.name_en && item.name_jp) {
                            // 英語名を正規化（小文字化）
                            const enName = item.name_en.toLowerCase().trim();
                            const jpName = item.name_jp.trim();
                            
                            // 双方向マッピングを作成
                            translationMap.enToJp[enName] = jpName;
                            translationMap.jpToEn[jpName] = item.name_en; // 元の大文字小文字を保持
                            
                            entryCount++;
                        }
                    });
                }
            }
            
            translationDataLoaded = true;
            console.log('翻訳マッピング構築完了:', entryCount, '件');
            console.log('英語→日本語エントリー数:', Object.keys(translationMap.enToJp).length);
            console.log('日本語→英語エントリー数:', Object.keys(translationMap.jpToEn).length);
            
            // サンプル表示
            const sampleKeys = Object.keys(translationMap.enToJp).slice(0, 5);
            console.log('サンプル翻訳:', sampleKeys.map(key => `${key} → ${translationMap.enToJp[key]}`));
        })
        .catch(error => {
            console.error('翻訳データ読み込みエラー:', error);
        });
}

// 英語→日本語翻訳
function translateEnglishToJapanese(englishText) {
    if (!englishText) return englishText;
    
    const normalized = englishText.toLowerCase().trim();
    
    // 完全一致を探す
    if (translationMap.enToJp[normalized]) {
        return translationMap.enToJp[normalized];
    }
    
    // 部分一致を探す（英語名が含まれている場合）
    for (const enKey in translationMap.enToJp) {
        if (normalized.includes(enKey) || enKey.includes(normalized)) {
            return translationMap.enToJp[enKey];
        }
    }
    
    // 翻訳が見つからない場合は元のテキストを返す
    return englishText;
}

// 日本語→英語翻訳
function translateJapaneseToEnglish(japaneseText) {
    if (!japaneseText) return japaneseText;
    
    const trimmed = japaneseText.trim();
    
    // 完全一致を探す
    if (translationMap.jpToEn[trimmed]) {
        return translationMap.jpToEn[trimmed];
    }
    
    // 部分一致を探す
    for (const jpKey in translationMap.jpToEn) {
        if (trimmed.includes(jpKey) || jpKey.includes(trimmed)) {
            return translationMap.jpToEn[jpKey];
        }
    }
    
    // 翻訳が見つからない場合は元のテキストを返す
    return japaneseText;
}

// 検索用：日本語入力を英語に変換して検索
function searchWithTranslation(searchTerm) {
    if (!searchTerm) return [];
    
    const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(searchTerm);
    
    if (hasJapanese) {
        // 日本語が含まれている場合、英語に翻訳
        const englishTerm = translateJapaneseToEnglish(searchTerm);
        console.log('日本語検索:', searchTerm, '→', englishTerm);
        return [searchTerm.toLowerCase(), englishTerm.toLowerCase()];
    } else {
        // 英語の場合はそのまま
        return [searchTerm.toLowerCase()];
    }
}

// ノード名を日本語で表示する関数
function getJapaneseNodeLabel(node) {
    const englishName = node.data('name') || node.data('shared_name') || '';
    
    if (!englishName) return '';
    
    // 翻訳を試みる
    const japaneseName = translateEnglishToJapanese(englishName);
    
    // 翻訳が見つかった場合は日本語を返す、見つからない場合は英語を返す
    return japaneseName !== englishName ? japaneseName : englishName;
}

// ページ読み込み時に翻訳データを読み込む
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadTranslationData);
} else {
    loadTranslationData();
}

console.log('translation-loader.js 読み込み完了');
