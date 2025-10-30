// 解剖学アプリの修正版 - 直接的なアプローチ

(function () {
    'use strict';

    let cytoscapeInstance = null;
    let searchResultsCache = [];

    // Cytoscapeインスタンスの設定
    function setCytoscapeInstance(cy) {
        cytoscapeInstance = cy;
        console.log('Cytoscape インスタンス設定完了');

        // ノードクリックイベント
        cy.on('tap', 'node', function (evt) {
            const node = evt.target;
            highlightNodeAndNeighbors(node);
        });

        // 背景クリックでクリア
        cy.on('tap', function (evt) {
            if (evt.target === cy) {
                clearAllHighlights();
            }
        });
    }

    // 検索機能
    function performSearch(query) {
        console.log('検索実行:', query);

        if (!cytoscapeInstance || !query) {
            searchResultsCache = [];
            return [];
        }

        const results = [];
        const searchTerm = query.toLowerCase().trim();

        // 翻訳機能があれば使用
        let translatedTerm = searchTerm;
        if (typeof translateToEnglish === 'function') {
            translatedTerm = translateToEnglish(query).toLowerCase().trim();
        }

        console.log('検索語:', searchTerm, '翻訳語:', translatedTerm);

        cytoscapeInstance.nodes().forEach(function (node) {
            const name = (node.data('name') || '').toLowerCase();
            const sharedName = (node.data('shared_name') || '').toLowerCase();

            if (name.includes(searchTerm) || name.includes(translatedTerm) ||
                sharedName.includes(searchTerm) || sharedName.includes(translatedTerm)) {

                const result = {
                    id: node.id(),
                    name: node.data('name') || node.data('shared_name'),
                    type: node.data('P2attr') || node.data('P1attr') || 'unknown'
                };

                results.push(result);
                console.log('検索結果追加:', result);
            }
        });

        searchResultsCache = results;
        console.log('検索完了:', results.length, '件');
        return results;
    }

    // ノード選択とハイライト
    function selectNodeById(nodeId) {
        console.log('ノード選択要求 ID:', nodeId);

        if (!cytoscapeInstance) {
            console.error('Cytoscapeインスタンスがありません');
            return;
        }

        // IDでノードを検索
        const targetNode = cytoscapeInstance.getElementById(nodeId);

        if (!targetNode || targetNode.length === 0) {
            console.error('ノードが見つかりません:', nodeId);
            return;
        }

        console.log('ノード発見:', {
            id: targetNode.id(),
            name: targetNode.data('name'),
            shared_name: targetNode.data('shared_name')
        });

        // ハイライト実行
        highlightNodeAndNeighbors(targetNode);

        // 中央に表示
        cytoscapeInstance.animate({
            center: { eles: targetNode },
            zoom: 2.5
        }, {
            duration: 1000
        });
    }

    // ノードとその隣接ノードをハイライト
    function highlightNodeAndNeighbors(node) {
        console.log('ハイライト開始:', node.id());

        // 既存のハイライトをクリア
        clearAllHighlights();

        // メインノードをハイライト
        node.style({
            'border-width': '15px',
            'border-color': '#ff1744',
            'background-color': '#ffcdd2',
            'width': '80px',
            'height': '80px',
            'z-index': '999'
        });

        // 隣接ノードを取得してハイライト
        const neighbors = node.neighborhood().nodes();
        console.log('隣接ノード数:', neighbors.length);

        neighbors.forEach(function (neighbor) {
            neighbor.style({
                'border-width': '8px',
                'border-color': '#00bcd4',
                'background-color': '#e0f7fa',
                'width': '60px',
                'height': '60px'
            });
        });

        // 隣接ノードリストを更新
        updateNeighborsList(neighbors);
    }

    // 隣接ノードリストの更新
    function updateNeighborsList(neighbors) {
        const neighborsList = [];

        neighbors.forEach(function (neighbor) {
            neighborsList.push({
                id: neighbor.id(),
                name: neighbor.data('name') || neighbor.data('shared_name'),
                type: neighbor.data('P2attr') || neighbor.data('P1attr') || 'unknown'
            });
        });

        // AngularJSスコープを更新
        const scope = angular.element(document.body).scope();
        if (scope) {
            scope.$apply(function () {
                scope.selectedNodeNeighbors = neighborsList;
            });
        }
    }

    // 全ハイライトをクリア
    function clearAllHighlights() {
        if (!cytoscapeInstance) return;

        cytoscapeInstance.nodes().removeStyle();
        cytoscapeInstance.nodes().unselect();

        // 隣接ノードリストもクリア
        const scope = angular.element(document.body).scope();
        if (scope) {
            scope.$apply(function () {
                scope.selectedNodeNeighbors = [];
            });
        }

        console.log('ハイライトクリア完了');
    }

    // 検索結果をクリア
    function clearSearch() {
        searchResultsCache = [];
        clearAllHighlights();

        if (cytoscapeInstance) {
            cytoscapeInstance.fit();
        }

        // AngularJSスコープを更新
        const scope = angular.element(document.body).scope();
        if (scope) {
            scope.$apply(function () {
                scope.searchResults = [];
                scope.searchQuery = '';
            });
        }
    }

    // グローバル関数として公開
    window.AnatomyApp = {
        setCytoscape: setCytoscapeInstance,
        search: performSearch,
        selectNode: selectNodeById,
        clearSearch: clearSearch,
        clearHighlights: clearAllHighlights
    };

    console.log('AnatomyApp 修正版 初期化完了');
})();