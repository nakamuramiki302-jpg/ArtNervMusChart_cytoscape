#!/usr/bin/env python3
import json

# translations.jsonを読み込む
with open('data/translations.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# JavaScriptファイルとして出力
with open('data/translations.js', 'w', encoding='utf-8') as f:
    f.write('// 自動生成された翻訳データ\n')
    f.write('var muscleTranslations = {\n')
    
    entries = []
    for category, items in data.items():
        if isinstance(items, list):
            for item in items:
                if 'name_en' in item and 'name_jp' in item:
                    en = item['name_en'].lower()
                    jp = item['name_jp']
                    # JavaScriptの文字列としてエスケープ
                    en_escaped = en.replace('\\', '\\\\').replace('"', '\\"')
                    jp_escaped = jp.replace('\\', '\\\\').replace('"', '\\"')
                    entries.append(f'    "{en_escaped}": "{jp_escaped}"')
    
    f.write(',\n'.join(entries))
    f.write('\n};\n')
    f.write(f'\nconsole.log("翻訳データ読み込み完了: {len(entries)}件");\n')

print(f'変換完了: {len(entries)}件の翻訳エントリーを生成しました')
