$( document ).ready(function(){
  // 解剖学アプリのカスタム機能
  
  // グローバル変数
  window.anatomyApp = {
    searchResults: [],
    selectedNodeNeighbors: [],
    highlightedNodes: [],
    cy: null
  };
  
  // Cytoscapeインスタンスが利用可能になったときの処理
  function initializeAnatomyFeatures(cy) {
    window.anatomyApp.cy = cy;
    
    // ノードクリック時の隣接ノード表示
    cy.on('tap', 'node', function(evt) {
      const node = evt.target;
      showNeighbors(node);
      highlightNode(node);
    });
    
    // 背景クリック時のハイライト解除
    cy.on('tap', function(evt) {
      if (evt.target === cy) {
        clearHighlights();
        clearNeighbors();
      }
    });
  }
  
  // ノードの検索機能
  function searchNodes(query) {
    console.log('検索開始:', query);
    
    if (!window.anatomyApp.cy || !query) {
      window.anatomyApp.searchResults = [];
      return [];
    }
    
    const cy = window.anatomyApp.cy;
    const results = [];
    
    // 基本的な検索語
    const searchTerms = [query.toLowerCase().trim()];
    
    // 翻訳機能が利用可能な場合は翻訳を追加
    if (typeof translateToEnglish === 'function') {
      try {
        const translatedQuery = translateToEnglish(query);
        if (translatedQuery && translatedQuery !== query) {
          searchTerms.push(translatedQuery.toLowerCase().trim());
        }
      } catch (e) {
        console.log('翻訳エラー:', e);
      }
    }
    
    // 類似用語検索が利用可能な場合は追加
    if (typeof findSimilarTerms === 'function') {
      try {
        const similarTerms = findSimilarTerms(query);
        searchTerms.push(...similarTerms.map(term => term.toLowerCase().trim()));
      } catch (e) {
        console.log('類似語検索エラー:', e);
      }
    }
    
    console.log('検索語:', searchTerms);
    console.log('総ノード数:', cy.nodes().length);
    
    cy.nodes().forEach(function(node) {
      const nodeData = node.data();
      const nodeName = nodeData.name || '';
      const nodeSharedName = nodeData.shared_name || '';
      const nodeType = nodeData.P2attr || nodeData.P1attr || 'unknown';
      
      // デバッグ用（最初の数個のノードのみ）
      if (results.length < 3) {
        console.log('ノードデータ:', {
          name: nodeName,
          shared_name: nodeSharedName,
          type: nodeType
        });
      }
      
      // 複数の検索語で検索
      const isMatch = searchTerms.some(term => {
        if (!term) return false;
        return nodeName.toLowerCase().includes(term) || 
               nodeSharedName.toLowerCase().includes(term);
      });
      
      if (isMatch) {
        const nodeId = node.id();
        const resultItem = {
          id: nodeId,
          nodeId: nodeId, // 確実にIDを保存
          name: nodeName || nodeSharedName,
          type: nodeType,
          // デバッグ用の追加情報
          debugInfo: {
            originalName: nodeName,
            originalSharedName: nodeSharedName,
            originalType: nodeType
          }
        };
        
        console.log(`検索結果 ${results.length + 1}:`, {
          id: nodeId,
          name: resultItem.name,
          type: resultItem.type
        });
        
        results.push(resultItem);
      }
    });
    
    console.log('検索結果:', results.length, '件');
    if (results.length > 0) {
      console.log('検索結果一覧:');
      results.forEach((result, index) => {
        console.log(`  ${index + 1}. ID: ${result.id}, Name: ${result.name}, Type: ${result.type}`);
      });
    }
    
    window.anatomyApp.searchResults = results;
    return results;
  }
  
  // 隣接ノードの表示
  function showNeighbors(node) {
    if (!window.anatomyApp.cy) {
      console.log('Cytoscapeインスタンスが見つかりません（隣接ノード表示時）');
      return;
    }
    
    const cy = window.anatomyApp.cy;
    const neighbors = node.neighborhood().nodes();
    const neighborList = [];
    
    console.log('隣接ノード検索中... 見つかった隣接ノード数:', neighbors.length);
    
    neighbors.forEach(function(neighbor) {
      const neighborName = neighbor.data('name') || neighbor.data('shared_name');
      const neighborType = neighbor.data('P1attr') || neighbor.data('P2attr') || 'unknown';
      
      neighborList.push({
        id: neighbor.id(),
        name: neighborName,
        type: neighborType,
        nodeId: neighbor.id() // IDを明示的に保存
      });
    });
    
    window.anatomyApp.selectedNodeNeighbors = neighborList;
    console.log('隣接ノードリスト作成完了:', neighborList.length, '個');
    
    // 隣接ノードをハイライト
    if (neighbors.length > 0) {
      highlightNeighbors(neighbors);
    }
    
    // スコープ更新
    updateSearchResults();
  }
  
  // ノードのハイライト
  function highlightNode(node) {
    // 選択されたノードのスタイル
    node.style({
      'border-width': '6px',
      'border-color': '#ff1744',
      'background-color': '#ffcdd2',
      'width': '50px',
      'height': '50px'
    });
    
    window.anatomyApp.highlightedNodes = [node];
  }
  
  // 隣接ノードのハイライト
  function highlightNeighbors(neighbors) {
    console.log('隣接ノードハイライト開始:', neighbors.length, '個');
    
    neighbors.forEach(function(neighbor, index) {
      console.log(`隣接ノード ${index + 1}:`, neighbor.id(), neighbor.data('name'));
      
      try {
        neighbor.style({
          'border-width': '6px',
          'border-color': '#00bcd4',
          'background-color': '#e0f7fa',
          'width': '50px',
          'height': '50px'
        });
        console.log(`隣接ノード ${index + 1} ハイライト完了`);
      } catch (error) {
        console.error(`隣接ノード ${index + 1} ハイライトエラー:`, error);
      }
    });
    
    console.log('隣接ノードハイライト完了');
  }
  
  // ハイライトのクリア
  function clearHighlights() {
    if (!window.anatomyApp.cy) {
      console.log('Cytoscapeインスタンスが見つかりません（クリア時）');
      return;
    }
    
    const cy = window.anatomyApp.cy;
    
    console.log('ハイライトクリア開始 - 現在のノード数:', cy.nodes().length);
    
    // 全ノードのスタイルをリセット
    cy.nodes().removeStyle();
    
    // 選択状態もクリア
    cy.nodes().unselect();
    cy.edges().unselect();
    
    window.anatomyApp.highlightedNodes = [];
    
    console.log('ハイライトをクリアしました');
  }
  
  // 隣接ノード表示のクリア
  function clearNeighbors() {
    window.anatomyApp.selectedNodeNeighbors = [];
    
    // スコープ更新
    updateSearchResults();
    
    console.log('隣接ノード表示をクリアしました');
  }
  
  // ノードの選択とフォーカス（完全に新しい実装）
  function selectAndFocusNode(nodeData) {
    console.log('=== ノード選択開始 ===');
    console.log('受信したnodeData:', JSON.stringify(nodeData, null, 2));
    
    if (!window.anatomyApp.cy) {
      console.error('Cytoscapeインスタンスが見つかりません');
      return;
    }
    
    const cy = window.anatomyApp.cy;
    
    // ノードIDを取得（複数の方法を試す）
    let targetNodeId = null;
    
    if (nodeData.nodeId) {
      targetNodeId = nodeData.nodeId;
      console.log('nodeIdから取得:', targetNodeId);
    } else if (nodeData.id) {
      targetNodeId = nodeData.id;
      console.log('idから取得:', targetNodeId);
    } else {
      console.error('ノードIDが見つかりません:', nodeData);
      return;
    }
    
    console.log('検索対象ノードID:', targetNodeId);
    
    // 全ノードを検索して該当するノードを見つける
    let targetNode = null;
    cy.nodes().forEach(function(node) {
      if (node.id() === targetNodeId) {
        targetNode = node;
        console.log('ノードが見つかりました:', {
          id: node.id(),
          name: node.data('name'),
          shared_name: node.data('shared_name')
        });
      }
    });
    
    if (!targetNode) {
      console.error('指定されたIDのノードが見つかりません:', targetNodeId);
      console.log('利用可能なノードID一覧:');
      cy.nodes().forEach(function(node, index) {
        if (index < 10) { // 最初の10個のみ表示
          console.log(`  ${index}: ${node.id()} - ${node.data('name')}`);
        }
      });
      return;
    }
    
    console.log('=== ノード選択処理開始 ===');
    
    // 既存のハイライトをクリア
    clearHighlights();
    clearNeighbors();
    
    try {
      // ノードを中央に表示
      console.log('ノードを中央に移動...');
      cy.animate({
        center: { eles: targetNode },
        zoom: 2.5
      }, {
        duration: 800,
        complete: function() {
          console.log('アニメーション完了');
        }
      });
      
      // ノードを選択
      cy.nodes().unselect();
      targetNode.select();
      
      // 強調ハイライト
      console.log('ハイライト適用...');
      targetNode.style({
        'border-width': '12px',
        'border-color': '#ff1744',
        'background-color': '#ffcdd2',
        'width': '70px',
        'height': '70px',
        'z-index': '999'
      });
      
      // 隣接ノード表示
      showNeighbors(targetNode);
      
      console.log('=== ノード選択完了 ===');
      console.log('選択されたノード:', {
        id: targetNode.id(),
        name: targetNode.data('name'),
        shared_name: targetNode.data('shared_name'),
        type: targetNode.data('P2attr') || targetNode.data('P1attr')
      });
      
    } catch (error) {
      console.error('ノード選択中にエラー:', error);
    }
    
    // スコープ更新
    updateSearchResults();
  }
  
  // 検索結果のクリア
  function clearSearch() {
    window.anatomyApp.searchResults = [];
    clearHighlights();
    clearNeighbors();
    
    // ズームをリセット
    if (window.anatomyApp.cy) {
      window.anatomyApp.cy.fit();
    }
    
    console.log('検索をクリアしました');
  }
  
  // グローバル関数として公開
  window.anatomySearchNodes = searchNodes;
  window.anatomySelectNode = selectAndFocusNode;
  window.anatomyClearSearch = clearSearch;
  window.anatomyInitialize = initializeAnatomyFeatures;
  
  // デバッグ用関数
  window.anatomyDebugSelectById = function(nodeId) {
    console.log('デバッグ - 直接ID選択:', nodeId);
    selectAndFocusNode({ id: nodeId, nodeId: nodeId, name: 'Debug Test' });
  };
  
  // Enterキーでの検索（無効化 - AngularJSで処理）
  /*
  $(document).on('keypress', '#search-input', function(e) {
    if (e.which === 13) { // Enter key
      const query = $(this).val();
      searchNodes(query);
      updateSearchResults();
    }
  });
  */
  
  // 検索結果の表示更新
  function updateSearchResults() {
    // AngularJSのスコープ更新をトリガー
    try {
      const scope = angular.element('#network').scope();
      if (scope) {
        scope.$apply(function() {
          scope.searchResults = window.anatomyApp.searchResults;
          scope.selectedNodeNeighbors = window.anatomyApp.selectedNodeNeighbors;
        });
      }
    } catch (e) {
      console.log('スコープ更新エラー:', e);
    }
  }
  
  // 定期的にCytoscapeインスタンスをチェック
  const checkCytoscape = setInterval(function() {
    if (window.cy) {
      initializeAnatomyFeatures(window.cy);
      clearInterval(checkCytoscape);
      
      // デバッグ: 翻訳機能のテスト
      if (typeof translateToEnglish === 'function') {
        console.log('翻訳テスト - 動脈:', translateToEnglish('動脈'));
        console.log('翻訳テスト - muscle:', translateToEnglish('muscle'));
      } else {
        console.log('翻訳機能が見つかりません');
      }
      
      // デバッグ: 簡単な検索テスト
      setTimeout(function() {
        console.log('検索テスト開始');
        const testResults = searchNodes('artery');
        console.log('artery検索結果:', testResults);
        
        // Cytoscapeの状態確認
        console.log('Cytoscape状態確認:');
        console.log('- ノード数:', window.cy.nodes().length);
        console.log('- エッジ数:', window.cy.edges().length);
        console.log('- ズームレベル:', window.cy.zoom());
        console.log('- パン位置:', window.cy.pan());
        
        // 最初のノードでテスト
        // デバッグテスト（無効化）
        /*
        if (window.cy.nodes().length > 0) {
          const firstNode = window.cy.nodes()[0];
          console.log('最初のノードでハイライトテスト:', firstNode.data());
          
          // 直接ハイライトテスト
          setTimeout(function() {
            console.log('直接ハイライトテスト実行');
            firstNode.style({
              'border-width': '15px',
              'border-color': '#ff0000',
              'background-color': '#ffcccc'
            });
            console.log('テストハイライト適用完了');
          }, 1000);
        }
        */
      }, 2000);
    }
  }, 100);
});