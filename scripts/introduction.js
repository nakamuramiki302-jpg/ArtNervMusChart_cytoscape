// 解剖学アプリ紹介サイトのJavaScript

document.addEventListener('DOMContentLoaded', function() {
    // スムーズスクロール
    initSmoothScroll();
    
    // スクロールアニメーション
    initScrollAnimations();
    
    // ナビゲーション
    initNavigation();
    
    // コードハイライト
    initCodeHighlight();
});

// スムーズスクロールの初期化
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// スクロールアニメーションの初期化
function initScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// ナビゲーションの初期化
function initNavigation() {
    // 固定ナビゲーションを作成
    createFloatingNav();
    
    // アクティブセクションの追跡
    trackActiveSection();
}

// フローティングナビゲーションの作成
function createFloatingNav() {
    const nav = document.createElement('nav');
    nav.className = 'floating-nav';
    nav.innerHTML = `
        <ul>
            <li><a href="#features" title="機能">🚀</a></li>
            <li><a href="#story" title="ストーリー">📖</a></li>
            <li><a href="#tech" title="技術">🛠️</a></li>
            <li><a href="#code" title="コード">💻</a></li>
            <li><a href="#learning" title="学習">📚</a></li>
        </ul>
    `;
    
    document.body.appendChild(nav);
    
    // CSSを動的に追加
    const style = document.createElement('style');
    style.textContent = `
        .floating-nav {
            position: fixed;
            right: 30px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 1000;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 25px;
            padding: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
        }
        
        .floating-nav ul {
            list-style: none;
            margin: 0;
            padding: 0;
        }
        
        .floating-nav li {
            margin: 10px 0;
        }
        
        .floating-nav a {
            display: block;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            text-decoration: none;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            transition: all 0.3s ease;
        }
        
        .floating-nav a:hover,
        .floating-nav a.active {
            transform: scale(1.1);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        
        @media (max-width: 768px) {
            .floating-nav {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);
}

// アクティブセクションの追跡
function trackActiveSection() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.floating-nav a');
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-20% 0px -20% 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                
                // 全てのナビリンクからactiveクラスを削除
                navLinks.forEach(link => link.classList.remove('active'));
                
                // 対応するナビリンクにactiveクラスを追加
                const activeLink = document.querySelector(`.floating-nav a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// コードハイライトの初期化
function initCodeHighlight() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(block => {
        // 基本的なシンタックスハイライト
        highlightCode(block);
        
        // コピーボタンを追加
        addCopyButton(block.parentElement);
    });
}

// 基本的なコードハイライト
function highlightCode(codeElement) {
    let html = codeElement.innerHTML;
    
    // JavaScriptキーワードのハイライト
    const keywords = ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'forEach', 'return'];
    keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        html = html.replace(regex, `<span style="color: #ff6b6b; font-weight: bold;">${keyword}</span>`);
    });
    
    // 文字列のハイライト
    html = html.replace(/'([^']*)'/g, '<span style="color: #4ecdc4;">\'$1\'</span>');
    html = html.replace(/"([^"]*)"/g, '<span style="color: #4ecdc4;">"$1"</span>');
    
    // コメントのハイライト
    html = html.replace(/\/\/(.*)/g, '<span style="color: #95a5a6; font-style: italic;">//$1</span>');
    
    codeElement.innerHTML = html;
}

// コピーボタンの追加
function addCopyButton(preElement) {
    const button = document.createElement('button');
    button.className = 'copy-button';
    button.innerHTML = '📋 コピー';
    button.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 0.8rem;
        transition: all 0.3s ease;
    `;
    
    preElement.style.position = 'relative';
    preElement.appendChild(button);
    
    button.addEventListener('click', function() {
        const code = preElement.querySelector('code').textContent;
        
        navigator.clipboard.writeText(code).then(() => {
            button.innerHTML = '✅ コピー完了';
            button.style.background = 'rgba(76, 175, 80, 0.8)';
            
            setTimeout(() => {
                button.innerHTML = '📋 コピー';
                button.style.background = 'rgba(255, 255, 255, 0.2)';
            }, 2000);
        }).catch(() => {
            button.innerHTML = '❌ エラー';
            setTimeout(() => {
                button.innerHTML = '📋 コピー';
            }, 2000);
        });
    });
    
    button.addEventListener('mouseenter', function() {
        this.style.background = 'rgba(255, 255, 255, 0.3)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.background = 'rgba(255, 255, 255, 0.2)';
    });
}

// パフォーマンス統計の表示
function showPerformanceStats() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                console.log(`🚀 ページ読み込み時間: ${loadTime}ms`);
                
                // 開発者向けの情報を表示
                if (window.location.search.includes('debug=true')) {
                    const debugInfo = document.createElement('div');
                    debugInfo.style.cssText = `
                        position: fixed;
                        bottom: 20px;
                        left: 20px;
                        background: rgba(0, 0, 0, 0.8);
                        color: white;
                        padding: 10px;
                        border-radius: 5px;
                        font-family: monospace;
                        font-size: 12px;
                        z-index: 9999;
                    `;
                    debugInfo.innerHTML = `
                        <div>読み込み時間: ${loadTime}ms</div>
                        <div>DOM要素数: ${document.querySelectorAll('*').length}</div>
                        <div>画像数: ${document.querySelectorAll('img').length}</div>
                    `;
                    document.body.appendChild(debugInfo);
                }
            }, 100);
        });
    }
}

// パフォーマンス統計を初期化
showPerformanceStats();

// エラーハンドリング
window.addEventListener('error', function(e) {
    console.error('JavaScript エラー:', e.error);
});

// 未処理のPromise拒否をキャッチ
window.addEventListener('unhandledrejection', function(e) {
    console.error('未処理のPromise拒否:', e.reason);
});

// ページの可視性変更を監視
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('ページが非表示になりました');
    } else {
        console.log('ページが表示されました');
    }
});

// 機能デモ表示機能
function showFeatureDemo(featureType) {
    const modal = document.getElementById('feature-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalDescription = document.getElementById('modal-description');
    
    // 機能別の設定
    const featureData = {
        search: {
            title: '🔍 検索機能',
            image: 'images/demo-search.png',
            description: '日本語で解剖学用語を検索できます。「心臓」「大腿骨」「三角筋」など、身近な言葉で検索すると、該当する構造がハイライトされ、詳細情報が表示されます。翻訳機能により、英語の専門用語も自動的に検索できます。'
        },
        adjacent: {
            title: '🔗 隣接構造表示',
            image: 'images/demo-adjacent.png',
            description: '選択した部位に隣接する構造が自動的に表示されます。例えば心臓を選択すると、大動脈、肺動脈、上大静脈などの関連する血管や周囲の構造が一覧表示され、解剖学的な関係性を直感的に理解できます。'
        },
        colors: {
            title: '🎨 色分け表示',
            image: 'images/demo-colors.png',
            description: '筋肉はピンク、動脈は赤、神経は緑、骨格は青など、解剖学的な種類に応じて色分けされています。色盲の方にも配慮した色彩設計により、誰でも構造を区別しやすくなっています。'
        },
        mobile: {
            title: '📱 モバイル対応',
            image: 'images/demo-mobile.png',
            description: 'スマートフォンやタブレットでも快適に使用できます。タッチ操作に最適化されたインターフェース、レスポンシブデザイン、フローティングボタンにより、外出先でも解剖学の学習が可能です。'
        },
        circular: {
            title: '⭕ 円状配列',
            image: 'images/demo-circular.png',
            description: '選択した構造を中心に、関連する部位が美しい円状に配置されます。この視覚的な配置により、複雑な解剖学的関係を直感的に理解でき、記憶にも残りやすくなります。'
        },
        drag: {
            title: '🎯 ドラッグ操作',
            image: 'images/demo-drag.png',
            description: '検索パネルや情報パネルを自由にドラッグして、見やすい位置に移動できます。学習スタイルや画面サイズに合わせてカスタマイズでき、より効率的な学習環境を作ることができます。'
        }
    };
    
    const data = featureData[featureType];
    if (data) {
        modalTitle.textContent = data.title;
        modalImage.src = data.image;
        modalImage.alt = data.title + 'のデモ画像';
        modalDescription.textContent = data.description;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // スクロールを無効化
        
        // アニメーション効果
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    }
}

// モーダルを閉じる機能
function closeFeatureDemo() {
    const modal = document.getElementById('feature-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // スクロールを有効化
}

// モーダル外クリックで閉じる
window.addEventListener('click', function(event) {
    const modal = document.getElementById('feature-modal');
    if (event.target === modal) {
        closeFeatureDemo();
    }
});

// ESCキーでモーダルを閉じる
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeFeatureDemo();
    }
});

// グローバル関数として公開
window.showFeatureDemo = showFeatureDemo;
window.closeFeatureDemo = closeFeatureDemo;