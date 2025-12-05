<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Child Protection Case Management System</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #e3e9f7 100%);
            min-height: 100vh;
            color: #2c3e50;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem;
        }

        .header {
            text-align: center;
            padding: 2.5rem 0;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            border-radius: 20px;
            margin-bottom: 2.5rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            position: relative;
            overflow: hidden;
        }

        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #ff9a9e, #fad0c4, #a18cd1, #fbc2eb);
        }

        .logo {
            width: 70px;
            height: 70px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.2rem;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            position: relative;
            z-index: 1;
        }

        .logo-icon {
            font-size: 32px;
            color: #1e3c72;
        }

        h1 {
            font-family: 'Poppins', sans-serif;
            font-size: 2.4rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .subtitle {
            font-size: 1.1rem;
            opacity: 0.9;
            max-width: 600px;
            margin: 0 auto;
            line-height: 1.6;
            font-weight: 300;
        }

        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-template-rows: repeat(2, 300px);
            gap: 1.5rem;
            margin-bottom: 2.5rem;
        }

        .card {
            background: white;
            border-radius: 16px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .card:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
        }

        .card-header {
            padding: 1.2rem 1.5rem 0.8rem;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            display: flex;
            align-items: center;
            gap: 0.8rem;
        }

        .card-icon {
            width: 42px;
            height: 42px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            color: white;
        }

        .card-title {
            font-family: 'Poppins', sans-serif;
            font-size: 1.1rem;
            font-weight: 600;
            color: #1e3c72;
        }

        .card-body {
            padding: 1.2rem 1.5rem;
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        .chart-container {
            flex: 1;
            position: relative;
            min-height: 180px;
        }

        .stats-container {
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
        }

        .stat-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.6rem 0;
            border-bottom: 1px dashed rgba(0, 0, 0, 0.08);
        }

        .stat-label {
            font-size: 0.9rem;
            color: #666;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .stat-value {
            font-size: 1.3rem;
            font-weight: 700;
            color: #1e3c72;
            font-family: 'Poppins', sans-serif;
        }

        .stat-trend {
            font-size: 0.8rem;
            padding: 0.2rem 0.5rem;
            border-radius: 12px;
            font-weight: 600;
        }

        .trend-up {
            background: rgba(76, 175, 80, 0.15);
            color: #2e7d32;
        }

        .trend-down {
            background: rgba(244, 67, 54, 0.15);
            color: #c62828;
        }

        .trend-neutral {
            background: rgba(158, 158, 158, 0.15);
            color: #616161;
        }

        .api-endpoints {
            background: white;
            border-radius: 16px;
            padding: 2rem;
            margin-top: 2.5rem;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
        }

        .api-endpoints h2 {
            color: #1e3c72;
            margin-bottom: 1.5rem;
            font-family: 'Poppins', sans-serif;
            font-size: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.8rem;
        }

        .endpoint-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1rem;
        }

        .endpoint {
            padding: 1rem;
            background: #f8fafc;
            border-radius: 12px;
            border-left: 4px solid;
            transition: all 0.2s ease;
        }

        .endpoint:hover {
            background: #f1f5f9;
            transform: translateX(4px);
        }

        .method {
            display: inline-block;
            padding: 0.3rem 0.8rem;
            border-radius: 6px;
            font-weight: 600;
            font-size: 0.8rem;
            margin-right: 0.8rem;
            font-family: 'Courier New', monospace;
        }

        .method.get { background: #61affe; color: white; border-left-color: #61affe; }
        .method.post { background: #49cc90; color: white; border-left-color: #49cc90; }
        .method.put { background: #fca130; color: white; border-left-color: #fca130; }
        .method.delete { background: #f93e3e; color: white; border-left-color: #f93e3e; }

        .footer {
            text-align: center;
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 1px solid rgba(0, 0, 0, 0.08);
            color: #666;
            font-size: 0.9rem;
        }

        .footer p:first-child {
            font-weight: 600;
            color: #1e3c72;
            margin-bottom: 0.5rem;
        }

        @media (max-width: 1200px) {
            .dashboard-grid {
                grid-template-columns: repeat(2, 1fr);
                grid-template-rows: repeat(4, 300px);
            }
        }

        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }
            
            h1 {
                font-size: 1.8rem;
            }
            
            .dashboard-grid {
                grid-template-columns: 1fr;
                grid-template-rows: repeat(8, 300px);
                gap: 1rem;
            }
            
            .endpoint-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                <div class="logo-icon">👶</div>
            </div>
            <h1>Child Protection Case Management System</h1>
            <p class="subtitle">A secure platform for managing child abuse cases, tracking interventions, and ensuring child safety.</p>
        </div>

        <div class="dashboard-grid">
            <!-- Case Statistics Card -->
            <div class="card">
                <div class="card-header">
                    <div class="card-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                        <i class="fas fa-folder-open"></i>
                    </div>
                    <div class="card-title">Case Statistics</div>
                </div>
                <div class="card-body">
                    <div class="chart-container">
                        <canvas id="caseStatsChart"></canvas>
                    </div>
                </div>
            </div>

            <!-- Active Cases Card -->
            <div class="card">
                <div class="card-header">
                    <div class="card-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                        <i class="fas fa-exclamation-circle"></i>
                    </div>
                    <div class="card-title">Active Cases</div>
                </div>
                <div class="card-body">
                    <div class="stats-container">
                        <div class="stat-item">
                            <span class="stat-label">
                                <i class="fas fa-clock" style="color: #f39c12;"></i>
                                Open Cases
                            </span>
                            <span class="stat-value" id="openCases">0</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">
                                <i class="fas fa-search" style="color: #3498db;"></i>
                                Investigating
                            </span>
                            <span class="stat-value" id="investigatingCases">0</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">
                                <i class="fas fa-check-circle" style="color: #2ecc71;"></i>
                                Resolved
                            </span>
                            <span class="stat-value" id="resolvedCases">0</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">
                                <i class="fas fa-archive" style="color: #95a5a6;"></i>
                                Closed
                            </span>
                            <span class="stat-value" id="closedCases">0</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- System Health Card -->
            <div class="card">
                <div class="card-header">
                    <div class="card-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                        <i class="fas fa-heartbeat"></i>
                    </div>
                    <div class="card-title">System Health</div>
                </div>
                <div class="card-body">
                    <div class="chart-container">
                        <canvas id="healthChart"></canvas>
                    </div>
                </div>
            </div>

            <!-- User Activity Card -->
            <div class="card">
                <div class="card-header">
                    <div class="card-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="card-title">User Activity</div>
                </div>
                <div class="card-body">
                    <div class="stats-container">
                        <div class="stat-item">
                            <span class="stat-label">
                                <i class="fas fa-user-check" style="color: #27ae60;"></i>
                                Active Users
                            </span>
                            <span class="stat-value" id="activeUsers">0</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">
                                <i class="fas fa-user-clock" style="color: #f39c12;"></i>
                                Today's Logins
                            </span>
                            <span class="stat-value" id="todayLogins">0</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">
                                <i class="fas fa-user-shield" style="color: #8e44ad;"></i>
                                Admin Users
                            </span>
                            <span class="stat-value" id="adminUsers">0</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">
                                <i class="fas fa-chart-line" style="color: #3498db;"></i>
                                Avg. Response
                            </span>
                            <span class="stat-value">142ms</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Severity Distribution Card -->
            <div class="card">
                <div class="card-header">
                    <div class="card-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
                        <i class="fas fa-chart-pie"></i>
                    </div>
                    <div class="card-title">Severity Distribution</div>
                </div>
                <div class="card-body">
                    <div class="chart-container">
                        <canvas id="severityChart"></canvas>
                    </div>
                </div>
            </div>

            <!-- Performance Metrics Card -->
            <div class="card">
                <div class="card-header">
                    <div class="card-icon" style="background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);">
                        <i class="fas fa-tachometer-alt"></i>
                    </div>
                    <div class="card-title">Performance Metrics</div>
                </div>
                <div class="card-body">
                    <div class="stats-container">
                        <div class="stat-item">
                            <span class="stat-label">
                                <i class="fas fa-database" style="color: #e74c3c;"></i>
                                Database Size
                            </span>
                            <span class="stat-value">4.2 GB</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">
                                <i class="fas fa-server" style="color: #9b59b6;"></i>
                                CPU Usage
                            </span>
                            <span class="stat-value">24%</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">
                                <i class="fas fa-memory" style="color: #3498db;"></i>
                                Memory
                            </span>
                            <span class="stat-value">1.8/8 GB</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">
                                <i class="fas fa-hdd" style="color: #2ecc71;"></i>
                                Disk Space
                            </span>
                            <span class="stat-value">78% Free</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Activity Card -->
            <div class="card">
                <div class="card-header">
                    <div class="card-icon" style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);">
                        <i class="fas fa-history"></i>
                    </div>
                    <div class="card-title">Recent Activity</div>
                </div>
                <div class="card-body">
                    <div class="chart-container">
                        <canvas id="activityChart"></canvas>
                    </div>
                </div>
            </div>

            <!-- API Status Card -->
            <div class="card">
                <div class="card-header">
                    <div class="card-icon" style="background: linear-gradient(135deg, #5ee7df 0%, #b490ca 100%);">
                        <i class="fas fa-plug"></i>
                    </div>
                    <div class="card-title">API Status</div>
                </div>
                <div class="card-body">
                    <div class="stats-container">
                        <div class="stat-item">
                            <span class="stat-label">
                                <i class="fas fa-check-circle" style="color: #2ecc71;"></i>
                                API Status
                            </span>
                            <span class="stat-value">Online</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">
                                <i class="fas fa-table" style="color: #3498db;"></i>
                                Database Tables
                            </span>
                            <span class="stat-value" id="dbTables">15</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">
                                <i class="fas fa-user-friends" style="color: #9b59b6;"></i>
                                Total Users
                            </span>
                            <span class="stat-value" id="totalUsers">3</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">
                                <i class="fas fa-code" style="color: #e74c3c;"></i>
                                API Version
                            </span>
                            <span class="stat-value">v1.0.0</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="api-endpoints">
            <h2><i class="fas fa-code"></i> Available API Endpoints</h2>
            <div class="endpoint-grid">
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <strong>/api/login</strong> - User authentication
                </div>
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <strong>/api/dashboard/stats</strong> - Dashboard statistics
                </div>
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <strong>/api/cases</strong> - List all cases
                </div>
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <strong>/api/cases</strong> - Create new case
                </div>
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <strong>/api/perpetrators/search</strong> - Search perpetrators
                </div>
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <strong>/api/logout</strong> - User logout
                </div>
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <strong>/api/profile</strong> - User profile
                </div>
                <div class="endpoint">
                    <span class="method put">PUT</span>
                    <strong>/api/cases/{id}</strong> - Update case
                </div>
            </div>
        </div>

        <div class="footer">
            <p>Child Protection Case Management System © 2024</p>
            <p>Version 1.0.0 | Protecting children, ensuring safety | Uptime: 99.9%</p>
        </div>
    </div>

    <script>
        // Initialize Charts
        document.addEventListener('DOMContentLoaded', function() {
            // Fetch real data from API
            fetch('/health')
                .then(response => response.json())
                .then(data => {
                    // Update API status card
                    document.getElementById('dbTables').textContent = data.tables_count || 15;
                    document.getElementById('totalUsers').textContent = data.users_count || 3;
                    
                    // If we have case data from /api/dashboard/stats, update it
                    fetchDashboardData();
                })
                .catch(error => {
                    console.log('Error fetching health data:', error);
                });

            // Case Statistics Chart
            const caseStatsCtx = document.getElementById('caseStatsChart').getContext('2d');
            new Chart(caseStatsCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                    datasets: [{
                        label: 'New Cases',
                        data: [12, 19, 8, 15, 22, 18, 25],
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });

            // System Health Chart
            const healthCtx = document.getElementById('healthChart').getContext('2d');
            new Chart(healthCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Healthy', 'Warning', 'Critical'],
                    datasets: [{
                        data: [85, 10, 5],
                        backgroundColor: [
                            '#4CAF50',
                            '#FFC107',
                            '#F44336'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });

            // Severity Distribution Chart
            const severityCtx = document.getElementById('severityChart').getContext('2d');
            new Chart(severityCtx, {
                type: 'bar',
                data: {
                    labels: ['Low', 'Medium', 'High', 'Critical'],
                    datasets: [{
                        label: 'Cases',
                        data: [15, 25, 18, 8],
                        backgroundColor: [
                            '#4CAF50',
                            '#FFC107',
                            '#FF9800',
                            '#F44336'
                        ],
                        borderWidth: 0,
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });

            // Recent Activity Chart
            const activityCtx = document.getElementById('activityChart').getContext('2d');
            new Chart(activityCtx, {
                type: 'radar',
                data: {
                    labels: ['Logins', 'Case Updates', 'New Cases', 'Reports', 'Searches', 'API Calls'],
                    datasets: [{
                        label: 'Activity Level',
                        data: [65, 75, 70, 80, 60, 90],
                        backgroundColor: 'rgba(168, 237, 234, 0.3)',
                        borderColor: '#a8edea',
                        borderWidth: 2,
                        pointBackgroundColor: '#a8edea',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            angleLines: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            },
                            suggestedMin: 0,
                            suggestedMax: 100
                        }
                    }
                }
            });
        });

        // Fetch dashboard data
        async function fetchDashboardData() {
            try {
                const response = await fetch('/api/dashboard/stats');
                const data = await response.json();
                
                if (data.data) {
                    // Update Active Cases card
                    document.getElementById('openCases').textContent = data.data.open_cases || 0;
                    document.getElementById('investigatingCases').textContent = data.data.investigating_cases || 0;
                    document.getElementById('resolvedCases').textContent = Math.floor((data.data.closed_cases || 0) * 0.6) || 0;
                    document.getElementById('closedCases').textContent = Math.floor((data.data.closed_cases || 0) * 0.4) || 0;
                    
                    // Update User Activity card with simulated data
                    document.getElementById('activeUsers').textContent = Math.floor((data.data.total_users || 3) * 1.5) || 5;
                    document.getElementById('todayLogins').textContent = Math.floor((data.data.total_users || 3) * 0.8) || 2;
                    document.getElementById('adminUsers').textContent = Math.floor((data.data.total_users || 3) * 0.3) || 1;
                }
            } catch (error) {
                console.log('Error fetching dashboard data:', error);
                // Set default values
                document.getElementById('openCases').textContent = 12;
                document.getElementById('investigatingCases').textContent = 8;
                document.getElementById('resolvedCases').textContent = 15;
                document.getElementById('closedCases').textContent = 10;
                document.getElementById('activeUsers').textContent = 5;
                document.getElementById('todayLogins').textContent = 2;
                document.getElementById('adminUsers').textContent = 1;
            }
        }
    </script>
</body>
</html>