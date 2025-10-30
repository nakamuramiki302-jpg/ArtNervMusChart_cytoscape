/*global _, angular */

angular.module('cyViewerApp')
    .controller('MainCtrl', function($scope, $http, $location, $routeParams, $window, Network, VisualStyles) {

        'use strict';

        var FILE_LIST_NAME = 'filelist.json';

        // Name of network tag in the DOM
        var NETWORK_SECTION_ID = '#network';

        // Default Visual Style name
        var DEFAULT_VISUAL_STYLE_NAME = 'default';

        var visualStyleFile;
        var networkData;

        $scope.LAYOUTS = [
            'preset', 'cola', 'random', 'grid', 'circle', 'concentric', 'breadthfirst', 'cose'
        ];


        // Application global objects
        $scope.networks = networks;
        $scope.currentVS = null;
        $scope.visualStyles = styles;
        $scope.visualStyleNames = Object.styles(styles);
        $scope.networkNames = Object.styles(networks);
        $scope.currentNetworkData = Network.get(
                {filename: $scope.networks[defaultNetworkName]},
                function () {
                    angular.element(NETWORK_SECTION_ID).cytoscape(options);
                    $scope.currentNetworkData = networkData;
                    $scope.currentNetwork = defaultNetworkName;
                });;


        // Show / Hide Table browser
        $scope.browserState = {
            show: false
        };

        // Show / Hide style selector UI
        $scope.overlayState = {
            show: true
        };

        // Show / Hide toolbar
        $scope.toolbarState = {
            show: true
        };

        // Background color
        $scope.bg = {
            color: '#FAFAFA'
        };

        $scope.columnNames = [];
        $scope.edgeColumnNames = [];
        $scope.networkColumnNames = [];
        
        // 検索機能の変数
        $scope.searchQuery = '';
        $scope.searchResults = [];
        $scope.selectedNodeNeighbors = [];

        // Basic settings for the Cytoscape window
        var options = {
            showOverlay: false,
            minZoom: 0.01,
            maxZoom: 200,
            boxSelectionEnabled: true,

            layout: {
                name: 'preset'
            },

            ready: function() {
                $scope.cy = this;
                window.cy = this; // グローバルアクセス用
                $scope.cy.load(networkData.elements);

                VisualStyles.query(
                    {filename: visualStyleFile}, function (vs) {
                        init(vs);
                        dropSupport();
                        setEventListeners();
                        $scope.currentVS = DEFAULT_VISUAL_STYLE_NAME;
                        $scope.currentLayout = 'preset';
                        $scope.cy.style().fromJson($scope.visualStyles[DEFAULT_VISUAL_STYLE_NAME].style).update();
                        angular.element('.loading').remove();
                        
                        // 解剖学機能の初期化（旧システム）
                        if (window.anatomyInitialize) {
                            window.anatomyInitialize($scope.cy);
                        }
                        
                        // 新しいシステムの初期化
                        if (window.AnatomyApp) {
                            window.AnatomyApp.setCytoscape($scope.cy);
                            console.log('新しいAnatomyApp初期化完了');
                        }
                        
                        // デバッグ: ノードデータの確認
                        console.log('ノード数:', $scope.cy.nodes().length);
                        if ($scope.cy.nodes().length > 0) {
                            const firstNode = $scope.cy.nodes()[0];
                            console.log('最初のノードデータ:', firstNode.data());
                        }
                    });
            }
        };


        function dropSupport() {
            var dropZone = angular.element(NETWORK_SECTION_ID);
            dropZone.on('dragenter', function(e) {
                e.stopPropagation();
                e.preventDefault();
            });

            dropZone.on('dragover', function(e) {
                e.stopPropagation();
                e.preventDefault();
            });
            dropZone.on('drop', function(e) {
                e.preventDefault();
                var files = e.originalEvent.dataTransfer.files;
                var networkFile = files[0];
                var reader = new FileReader();
                reader.onload = function(evt) {
                    var network = JSON.parse(evt.target.result);
                    var networkName = 'Unknown';
                    // Check data section is available or not.
                    networkData = network.data;
                    if (networkData !== undefined) {
                        if (networkData.name !== undefined) {
                            networkName = networkData.name;
                            $scope.currentNetworkData = networkData;
                        }
                    }

                    while (_.contains($scope.networkNames, networkName)) {
                        networkName = networkName + '*';
                    }

                    $scope.$apply(function() {
                        $scope.networks[networkName] = network;
                        $scope.networkNames.push(networkName);
                        $scope.currentNetwork = networkName;
                    });
                    $scope.cy.load(network.elements);
                    reset();
                };
                reader.readAsText(networkFile);
            });
        }

        function init(vs) {
            $scope.nodes = networkData.elements.nodes;
            $scope.edges = networkData.elements.edges;
            initVisualStyleCombobox(vs);

            // Set network name
            var networkName = networkData.data.name;
            if (!$scope.networks[networkName]) {
                $scope.networks[networkName] = networkData;
                $scope.networkNames.push(networkName);
                $scope.currentNetwork = networkData.data.name;
            }
            // Get column names
            setColumnNames();

            if ($routeParams.bgcolor) {
                $scope.bg.color = $routeParams.bgcolor;
            }
        }

        function setColumnNames() {
            $scope.columnNames = [];
            $scope.edgeColumnNames = [];
            $scope.networkColumnNames = [];

            var oneNode = $scope.nodes[0];
            for (var colName in oneNode.data) {
                $scope.columnNames.push(colName);
            }
            var oneEdge = $scope.edges[0];
            for (var edgeColName in oneEdge.data) {
                $scope.edgeColumnNames.push(edgeColName);
            }
            for (var netColName in networkData.data) {
                $scope.networkColumnNames.push(netColName);
            }
        }

        function reset() {
            $scope.selectedNodes = {};
            $scope.selectedEdges = {};
        }

        /*
         Event listener setup for Cytoscape.js
         */
        function setEventListeners() {
            $scope.selectedNodes = {};
            $scope.selectedEdges = {};

            var updateFlag = false;

            // Node selection
            $scope.cy.on('select', 'node', function(event) {
                var id = event.cyTarget.id();
                $scope.selectedNodes[id] = event.cyTarget;
                updateFlag = true;
            });

            $scope.cy.on('select', 'edge', function(event) {
                var id = event.cyTarget.id();
                $scope.selectedEdges[id] = event.cyTarget;
                updateFlag = true;
            });

            // Reset selection
            $scope.cy.on('unselect', 'node', function(event) {
                var id = event.cyTarget.id();
                delete $scope.selectedNodes[id];
                updateFlag = true;
            });
            $scope.cy.on('unselect', 'edge', function(event) {
                var id = event.cyTarget.id();
                delete $scope.selectedEdges[id];
                updateFlag = true;
            });

            setInterval(function() {
                if (updateFlag && $scope.browserState.show) {
                    $scope.$apply();
                    updateFlag = false;
                }
            }, 300);

        }

        function initVisualStyleCombobox(vs) {
            _.each(vs, function(visualStyle) {
                $scope.visualStyles[visualStyle.title] = visualStyle;
                $scope.visualStyleNames.push(visualStyle.title);
            });

            $scope.currentVS = DEFAULT_VISUAL_STYLE_NAME;
        }


        $scope.toggleTableBrowser = function() {
            $scope.browserState.show = !$scope.browserState.show;
        };

        $scope.toggleOverlay = function() {
            $scope.overlayState.show = !$scope.overlayState.show;
        };

        $scope.toggleToolbar = function() {
            $scope.toolbarState.show = !$scope.toolbarState.show;
        };

        $scope.fit = function() {
            $scope.cy.fit();
        };


        // Apply Visual Style
        $scope.switchVS = function() {
            var vsName = $scope.currentVS.trim();
            var vs = $scope.visualStyles[vsName].style;
            // Apply Visual Style
            $scope.cy.style().fromJson(vs).update();
        };


        $scope.switchNetwork = function() {
            var networkFile = $scope.networks[$scope.currentNetwork];

            networkData = Network.get(
                {filename: networkFile},
                function (network) {
                    $scope.cy.load(network.elements);
                    $scope.currentNetworkData = networkData;
                    reset();
                    $scope.nodes = network.elements.nodes;
                    $scope.edges = network.elements.edges;
                    setColumnNames();
                });


        };

        $scope.switchLayout = function() {
            var layoutOptions = {
                name: $scope.currentLayout
            };
            $scope.cy.layout(layoutOptions);
        };

        // Enterキーでの検索
        $scope.searchOnEnter = function(event) {
            console.log('キー押下:', event.keyCode || event.which);
            
            const keyCode = event.keyCode || event.which;
            if (keyCode === 13) { // Enterキーのみ
                console.log('Enter検索実行:', $scope.searchQuery);
                event.preventDefault(); // デフォルト動作を防ぐ
                $scope.performSearch();
            }
        };

        // 旧searchNodes関数（互換性のため残す）
        $scope.searchNodes = function(event) {
            // この関数は使用しない（意図しない実行を防ぐ）
            console.log('searchNodes関数が呼ばれました（無視）');
        };

        $scope.performSearch = function() {
            console.log('=== 検索実行開始 ===');
            console.log('検索クエリ:', $scope.searchQuery);
            console.log('検索クエリの型:', typeof $scope.searchQuery);
            console.log('検索クエリの長さ:', ($scope.searchQuery || '').length);
            
            if (!$scope.searchQuery || $scope.searchQuery.trim() === '') {
                console.log('検索クエリが空のため、結果をクリア');
                $scope.searchResults = [];
                return;
            }
            
            // 直接検索を実行
            if (!$scope.cy) {
                console.error('Cytoscapeインスタンスが見つかりません');
                return;
            }
            
            console.log('Cytoscapeノード数:', $scope.cy.nodes().length);
            
            const results = [];
            const searchTerm = $scope.searchQuery.toLowerCase().trim();
            
            // 翻訳機能があれば使用
            let translatedTerm = searchTerm;
            if (typeof translateToEnglish === 'function') {
                try {
                    translatedTerm = translateToEnglish($scope.searchQuery).toLowerCase().trim();
                    console.log('翻訳成功:', $scope.searchQuery, '->', translatedTerm);
                } catch (e) {
                    console.log('翻訳エラー:', e);
                }
            }
            
            console.log('検索語:', searchTerm);
            console.log('翻訳語:', translatedTerm);
            
            let nodeCount = 0;
            $scope.cy.nodes().forEach(function(node) {
                nodeCount++;
                const name = (node.data('name') || '').toLowerCase();
                const sharedName = (node.data('shared_name') || '').toLowerCase();
                
                // デバッグ用（最初の5個のノードのみ）
                if (nodeCount <= 5) {
                    console.log(`ノード ${nodeCount}:`, {
                        id: node.id(),
                        name: node.data('name'),
                        shared_name: node.data('shared_name')
                    });
                }
                
                const nameMatch = name.includes(searchTerm) || name.includes(translatedTerm);
                const sharedNameMatch = sharedName.includes(searchTerm) || sharedName.includes(translatedTerm);
                
                if (nameMatch || sharedNameMatch) {
                    const result = {
                        id: node.id(),
                        name: node.data('name') || node.data('shared_name'),
                        type: node.data('P2attr') || node.data('P1attr') || 'unknown'
                    };
                    
                    results.push(result);
                    console.log('検索結果追加:', result);
                }
            });
            
            $scope.searchResults = results;
            console.log('=== 検索完了 ===');
            console.log('結果数:', results.length);
            
            // 検索結果の詳細をログ出力
            if (results.length > 0) {
                console.log('=== 検索結果詳細 ===');
                results.forEach(function(result, index) {
                    console.log(`${index + 1}. ID: ${result.id}, Name: ${result.name}, Type: ${result.type}`);
                });
            } else {
                console.log('検索結果なし');
            }
        };

        $scope.clearSearch = function() {
            console.log('検索クリア実行');
            
            // 検索関連のデータをクリア
            $scope.searchQuery = '';
            $scope.searchResults = [];
            $scope.selectedNodeNeighbors = [];
            
            // Cytoscapeのハイライトもクリア
            if ($scope.cy) {
                $scope.cy.nodes().removeStyle();
                $scope.cy.nodes().unselect();
                $scope.cy.fit(); // 全体表示に戻す
            }
            
            console.log('検索クリア完了');
        };

        $scope.selectNode = function(nodeData) {
            console.log('=== ノード選択要求 ===');
            console.log('nodeData:', nodeData);
            
            if (!nodeData || !nodeData.id) {
                console.error('無効なノードデータ:', nodeData);
                return;
            }
            
            // 新しいシステムを優先
            if (window.AnatomyApp && window.AnatomyApp.selectNode) {
                console.log('新システムでノード選択:', nodeData.id);
                window.AnatomyApp.selectNode(nodeData.id);
            } else if (window.anatomySelectNode) {
                console.log('旧システムでノード選択');
                window.anatomySelectNode(nodeData);
            } else {
                console.error('ノード選択関数が見つかりません');
            }
        };

        // 直接ノード選択関数（HTMLから直接呼び出し用）
        $scope.directSelectNode = function(nodeId, nodeName) {
            console.log('=== 直接ノード選択 ===');
            console.log('要求されたID:', nodeId);
            console.log('要求されたName:', nodeName);
            
            if (!nodeId) {
                console.error('ノードIDが指定されていません');
                return;
            }
            
            // Cytoscapeインスタンスから直接ノードを取得
            if (!$scope.cy) {
                console.error('Cytoscapeインスタンスが見つかりません');
                return;
            }
            
            const targetNode = $scope.cy.getElementById(nodeId);
            
            if (!targetNode || targetNode.length === 0) {
                console.error('指定されたIDのノードが見つかりません:', nodeId);
                console.log('利用可能なノードID（最初の10個）:');
                $scope.cy.nodes().slice(0, 10).forEach(function(node, index) {
                    console.log(`${index}: ${node.id()} - ${node.data('name')}`);
                });
                return;
            }
            
            console.log('ノード発見:', {
                id: targetNode.id(),
                name: targetNode.data('name'),
                shared_name: targetNode.data('shared_name')
            });
            
            // 既存のスタイルをクリア
            $scope.cy.nodes().removeStyle();
            $scope.cy.nodes().unselect();
            
            // ターゲットノードをハイライト
            targetNode.style({
                'border-width': '15px',
                'border-color': '#ff1744',
                'background-color': '#ffcdd2',
                'width': '80px',
                'height': '80px',
                'z-index': '999'
            });
            
            // 中央に表示
            $scope.cy.animate({
                center: { eles: targetNode },
                zoom: 2.5
            }, {
                duration: 1000
            });
            
            // 隣接ノードを表示
            const neighbors = targetNode.neighborhood().nodes();
            console.log('隣接ノード数:', neighbors.length);
            
            neighbors.forEach(function(neighbor) {
                neighbor.style({
                    'border-width': '8px',
                    'border-color': '#00bcd4',
                    'background-color': '#e0f7fa',
                    'width': '60px',
                    'height': '60px'
                });
            });
            
            // 隣接ノードリストを更新
            const neighborsList = [];
            neighbors.forEach(function(neighbor) {
                neighborsList.push({
                    id: neighbor.id(),
                    name: neighbor.data('name') || neighbor.data('shared_name'),
                    type: neighbor.data('P2attr') || neighbor.data('P1attr') || 'unknown'
                });
            });
            
            $scope.selectedNodeNeighbors = neighborsList;
            
            console.log('ノード選択完了:', {
                selectedId: targetNode.id(),
                selectedName: targetNode.data('name'),
                neighborsCount: neighborsList.length
            });
        };

        ///////////////////// Start the loading process ////////////////


        /*$http.get(FILE_LIST_NAME).success(function(fileList) {
            visualStyleFile = styles;

            var defaultNetworkName = null;
            $scope.networks = networks;
            _.each(_.keys(networks), function(key) {
                $scope.networkNames.push(key)
            }

            _.each(_.keys(fileList), function(key) {
                if(key !== 'style') {
                    if(defaultNetworkName === null) {
                        defaultNetworkName = key;
                    }
                    $scope.networks[key] = fileList[key];
                    $scope.networkNames.push(key);
                }
            });
            
            networkData = Network.get(
                {filename: $scope.networks[defaultNetworkName]},
                function () {
                    angular.element(NETWORK_SECTION_ID).cytoscape(options);
                    $scope.currentNetworkData = networkData;
                    $scope.currentNetwork = defaultNetworkName;
                });
        });
    });*/
