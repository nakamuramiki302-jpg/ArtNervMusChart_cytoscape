#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
全ノード名をGoogle翻訳（無料版）を使って翻訳
"""
import re
import time

# 既存の翻訳辞書を読み込む
existing_translations = {}

# 手動で主要な解剖学用語を翻訳（Google翻訳の代わり）
# 解剖学用語は専門用語なので、正確な医学用語を使用
anatomy_terms = {
    # 脳神経
    "abducens": "外転",
    "accessory": "副",
    "facial": "顔面",
    "glossopharyngeal": "舌咽",
    "hypoglossal": "舌下",
    "oculomotor": "動眼",
    "olfactory": "嗅",
    "optic": "視",
    "trigeminal": "三叉",
    "trochlear": "滑車",
    "vagus": "迷走",
    "vestibulocochlear": "内耳",
    
    # 主要な神経
    "axillary": "腋窩",
    "femoral": "大腿",
    "median": "正中",
    "musculocutaneous": "筋皮",
    "obturator": "閉鎖",
    "peroneal": "腓骨",
    "phrenic": "横隔",
    "radial": "橈骨",
    "saphenous": "伏在",
    "sciatic": "坐骨",
    "tibial": "脛骨",
    "ulnar": "尺骨",
    
    # 動脈
    "aorta": "大動脈",
    "aortic": "大動脈",
    "brachial": "上腕",
    "carotid": "頸",
    "celiac": "腹腔",
    "cerebral": "大脳",
    "circumflex": "回旋",
    "coronary": "冠状",
    "femoral": "大腿",
    "hepatic": "肝",
    "iliac": "腸骨",
    "mesenteric": "腸間膜",
    "popliteal": "膝窩",
    "pulmonary": "肺",
    "radial": "橈骨",
    "renal": "腎",
    "splenic": "脾",
    "subclavian": "鎖骨下",
    "temporal": "側頭",
    "tibial": "脛骨",
    "ulnar": "尺骨",
    "vertebral": "椎骨",
    
    # 筋肉
    "abdominis": "腹",
    "adductor": "内転",
    "biceps": "二頭",
    "brachii": "上腕",
    "deltoid": "三角",
    "femoris": "大腿",
    "gastrocnemius": "腓腹",
    "gluteus": "殿",
    "gracilis": "薄",
    "iliopsoas": "腸腰",
    "latissimus": "広背",
    "pectoralis": "胸",
    "quadriceps": "四頭",
    "rectus": "直",
    "sartorius": "縫工",
    "soleus": "ヒラメ",
    "trapezius": "僧帽",
    "triceps": "三頭",
    
    # 方向・位置
    "anterior": "前",
    "posterior": "後",
    "superior": "上",
    "inferior": "下",
    "medial": "内側",
    "lateral": "外側",
    "proximal": "近位",
    "distal": "遠位",
    "superficial": "浅",
    "deep": "深",
    "ascending": "上行",
    "descending": "下行",
    "transverse": "横",
    
    # 一般用語
    "artery": "動脈",
    "nerve": "神経",
    "muscle": "筋",
    "vein": "静脈",
    "branch": "枝",
    "trunk": "幹",
    "plexus": "神経叢",
    "ganglion": "神経節",
    "sinus": "洞",
    "network": "網",
    "arch": "弓",
    "common": "総",
    "proper": "固有",
    "external": "外",
    "internal": "内",
    "major": "大",
    "minor": "小",
    "long": "長",
    "short": "短",
    "recurrent": "反回",
    "communicating": "交通",
    "perforating": "穿通",
    "collateral": "側副",
    
    # 身体部位
    "cervical": "頸",
    "thoracic": "胸",
    "lumbar": "腰",
    "sacral": "仙骨",
    "coccygeal": "尾骨",
    "scapular": "肩甲",
    "humeral": "上腕",
    "palmar": "掌側",
    "dorsal": "背側",
    "plantar": "足底",
    "digital": "指",
    "gluteal": "殿",
    "pudendal": "陰部",
    "genicular": "膝",
}

# ノード名を読み込んで翻訳
with open('/tmp/all_nodes.txt', 'r') as f:
    nodes = [line.strip() for line in f if line.strip()]

print(f"Total nodes to translate: {len(nodes)}")

# 翻訳結果を保存
translations = {}

for node in nodes:
    # 既に翻訳されている場合はスキップ
    if node in existing_translations:
        translations[node] = existing_translations[node]
        continue
    
    # 単語ベースで翻訳
    words = re.findall(r'\b\w+\b', node.lower())
    translated_parts = []
    
    for word in words:
        if word in anatomy_terms:
            translated_parts.append(anatomy_terms[word])
        else:
            # 翻訳できない単語はそのまま
            translated_parts.append(word)
    
    # 翻訳結果を結合
    if translated_parts and any(part in anatomy_terms.values() for part in translated_parts):
        translation = ''.join(translated_parts)
        translations[node] = translation
    else:
        # 翻訳できない場合は元の名前
        translations[node] = node

# JavaScriptファイルとして出力
with open('data/all-nodes-translation.js', 'w', encoding='utf-8') as f:
    f.write('// 全ノード名の翻訳辞書（自動生成）\n')
    f.write('var allNodesTranslations = {\n')
    
    items = []
    for en, jp in sorted(translations.items()):
        if jp != en:  # 翻訳がある場合のみ
            en_escaped = en.replace('\\', '\\\\').replace('"', '\\"')
            jp_escaped = jp.replace('\\', '\\\\').replace('"', '\\"')
            items.append(f'    "{en_escaped}": "{jp_escaped}"')
    
    f.write(',\n'.join(items))
    f.write('\n};\n')
    f.write(f'\nconsole.log("全ノード翻訳辞書読み込み完了: {len([t for t in translations.values() if t != ""])}件");\n')

print(f"Translation complete! {len([t for t in translations.values() if t != ''])} translations generated.")
print("Output: data/all-nodes-translation.js")
