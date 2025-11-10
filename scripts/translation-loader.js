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
            
            // サンプル表示（より詳細に）
            const sampleKeys = Object.keys(translationMap.enToJp).slice(0, 10);
            console.log('サンプル翻訳:');
            sampleKeys.forEach(key => {
                console.log(`  ${key} → ${translationMap.enToJp[key]}`);
            });
            
            // 特定のキーをテスト
            console.log('特定キーテスト:');
            console.log('  trapezius:', translationMap.enToJp['trapezius']);
            console.log('  masseter:', translationMap.enToJp['masseter']);
            console.log('  brain:', translationMap.enToJp['brain']);
            
            // 翻訳データ読み込み完了後、Cytoscapeのノードラベルを更新
            // 複数回試行して確実に適用
            updateAllNodeLabels();
            setTimeout(updateAllNodeLabels, 500);
            setTimeout(updateAllNodeLabels, 1000);
            setTimeout(updateAllNodeLabels, 2000);
        })
        .catch(error => {
            console.error('翻訳データ読み込みエラー:', error);
        });
}

// 英語→日本語翻訳
function translateEnglishToJapanese(englishText) {
    if (!englishText) return englishText;
    
    const normalized = englishText.toLowerCase().trim();
    
    // デバッグ用（最初の10回のみログ出力）
    if (!translateEnglishToJapanese.callCount) translateEnglishToJapanese.callCount = 0;
    if (translateEnglishToJapanese.callCount < 10) {
        console.log(`翻訳試行 ${translateEnglishToJapanese.callCount + 1}: "${englishText}" → "${normalized}"`);
        translateEnglishToJapanese.callCount++;
    }
    
    // 完全一致を探す
    if (translationMap.enToJp[normalized]) {
        const result = translationMap.enToJp[normalized];
        if (translateEnglishToJapanese.callCount <= 10) {
            console.log(`  ✓ 完全一致: ${result}`);
        }
        return result;
    }
    
    // 部分一致を探す（英語名が含まれている場合）
    for (const enKey in translationMap.enToJp) {
        if (normalized.includes(enKey) || enKey.includes(normalized)) {
            const result = translationMap.enToJp[enKey];
            if (translateEnglishToJapanese.callCount <= 10) {
                console.log(`  ✓ 部分一致 (${enKey}): ${result}`);
            }
            return result;
        }
    }
    
    // 翻訳が見つからない場合は元のテキストを返す
    if (translateEnglishToJapanese.callCount <= 10) {
        console.log(`  ✗ 翻訳なし`);
    }
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

// 全ノードのラベルを更新する関数
function updateAllNodeLabels() {
    console.log('=== 全ノードラベル更新開始 ===');
    
    // Cytoscapeインスタンスが準備できるまで待つ
    const checkCytoscape = setInterval(function() {
        if (window.cy && window.cy.nodes().length > 0) {
            clearInterval(checkCytoscape);
            console.log('Cytoscape準備完了、ノード数:', window.cy.nodes().length);
            
            // 全ノードのラベルを更新
            let updatedCount = 0;
            window.cy.nodes().forEach(function(node) {
                const originalText = node.data('name') || node.data('shared_name') || '';
                const japaneseText = translateEnglishToJapanese(originalText);
                
                if (japaneseText !== originalText) {
                    // 日本語と英語の両方を表示
                    const displayText = japaneseText + '\n' + originalText;
                    const shortText = truncateText(displayText, 30);
                    
                    // ノードのスタイルを更新
                    node.style({
                        'label': shortText,
                        'font-size': '5px',
                        'text-wrap': 'wrap',
                        'text-max-width': '25px'
                    });
                    
                    updatedCount++;
                    if (updatedCount <= 5) {
                        console.log('ラベル更新:', originalText, '→', displayText);
                    }
                }
            });
            
            console.log('✅ 全ノードラベル更新完了:', updatedCount, '件のノードを更新しました');
        }
    }, 100);
    
    // 10秒後にタイムアウト
    setTimeout(function() {
        clearInterval(checkCytoscape);
    }, 10000);
}

// テキストを短縮する関数（ここでも定義）
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    
    // 改行を考慮して短縮
    const lines = text.split('\n');
    if (lines.length > 1) {
        // 2行の場合、各行を短縮
        return lines.map(line => {
            if (line.length <= maxLength / 2) return line;
            return line.substring(0, maxLength / 2 - 1) + '…';
        }).join('\n');
    }
    
    // 単語の境界で切る
    const words = text.split(' ');
    let result = '';
    
    for (let word of words) {
        if ((result + word).length <= maxLength) {
            result += (result ? ' ' : '') + word;
        } else {
            break;
        }
    }
    
    return result || text.substring(0, maxLength - 1) + '…';
}

// ページ読み込み時に翻訳データを読み込む
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadTranslationData);
} else {
    loadTranslationData();
}

// デバッグ用：翻訳をテストする関数
function testTranslation() {
    console.log('=== 翻訳テスト ===');
    console.log('翻訳データ読み込み状態:', translationDataLoaded);
    console.log('翻訳マップサイズ:', Object.keys(translationMap.enToJp).length);
    
    // テストケース
    const testCases = ['masseter', 'temporalis', 'frontalis', 'buccinator'];
    testCases.forEach(function(testCase) {
        const result = translateEnglishToJapanese(testCase);
        console.log(`翻訳テスト: ${testCase} → ${result}`);
    });
}

// グローバルに公開
window.testTranslation = testTranslation;
window.updateAllNodeLabels = updateAllNodeLabels;

console.log('translation-loader.js 読み込み完了');
console.log('デバッグ用: window.testTranslation() で翻訳をテストできます');
console.log('デバッグ用: window.updateAllNodeLabels() でラベルを手動更新できます');
