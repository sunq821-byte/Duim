(function() {
    // ==========================================
    // DOM 引用
    // ==========================================
    const appShell = document.getElementById('appShell');
    const overlay = document.getElementById('overlay');
    const sidebar = document.getElementById('sidebar');
    const timeline = document.getElementById('timeline');
    const menuBtn = document.getElementById('menuBtn');
    const timelineClose = document.getElementById('timelineClose');
    const aiLogo = document.getElementById('aiLogo');
    const logoIcon = document.getElementById('logoIcon');
    const sendBtn = document.getElementById('sendBtn');
    const keyboardInput = document.getElementById('keyboardInput');
    const stage = document.getElementById('stage');
    const settingsSheet = document.getElementById('settingsSheet');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const toastContainer = document.getElementById('toastContainer');
    const avatarBtn = document.getElementById('avatarBtn');

    // ==========================================
    // 状态管理
    // ==========================================
    let currentState = 'idle'; // idle | listening | processing | success
    let sidebarOpen = false;
    let timelineOpen = false;
    let sheetOpen = false;
    let longPressTimer = null;
    let stateTimeout = null;

    // Touch 手势状态
    let touchStartX = 0, touchStartY = 0;
    let touchCurrentX = 0;
    let touchActive = false;
    let gestureType = null; // 'sidebar' | 'timeline' | 'timeline-close'

    // ==========================================
    // 1. Logo 4状态机
    // ==========================================
    function clearAllLogoStates() {
        aiLogo.classList.remove('listening', 'processing', 'success');
    }

    function setLogoState(state) {
        clearAllLogoStates();
        currentState = state;
        if (state === 'listening') aiLogo.classList.add('listening');
        if (state === 'processing') aiLogo.classList.add('processing');
        if (state === 'success') aiLogo.classList.add('success');
    }

    function triggerVoiceFlow() {
        if (currentState !== 'idle') return;

        // 进入监听
        setLogoState('listening');
        if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(15);
        }

        // 模拟 2.5s 后进入处理
        stateTimeout = setTimeout(() => {
            if (currentState !== 'listening') return;
            setLogoState('processing');

            // 模拟 1.5s 后成功入库
            stateTimeout = setTimeout(() => {
                if (currentState !== 'processing') return;
                setLogoState('success');

                // 切换为绿色对勾
                logoIcon.innerHTML = '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>';

                // 音效
                playSuccessSound();

                // 粒子弹射到菜单
                spawnParticle();

                // 2s 后恢复待机
                stateTimeout = setTimeout(() => {
                    resetToIdle();
                }, 2000);

            }, 1500);
        }, 2500);
    }

    function resetLogoIcon() {
        logoIcon.innerHTML = `
            <g transform="translate(50, 50)">
                <path d="M 0,-34 C 10,-34 19,-24 19,-11 C 19,-1 13,7 0,7 C -5,7 -10,4 -12,-1 C -10,-14 -5,-34 0,-34 Z" transform="rotate(0)" />
                <path d="M 0,-34 C 10,-34 19,-24 19,-11 C 19,-1 13,7 0,7 C -5,7 -10,4 -12,-1 C -10,-14 -5,-34 0,-34 Z" transform="rotate(60)" />
                <path d="M 0,-34 C 10,-34 19,-24 19,-11 C 19,-1 13,7 0,7 C -5,7 -10,4 -12,-1 C -10,-14 -5,-34 0,-34 Z" transform="rotate(120)" />
                <path d="M 0,-34 C 10,-34 19,-24 19,-11 C 19,-1 13,7 0,7 C -5,7 -10,4 -12,-1 C -10,-14 -5,-34 0,-34 Z" transform="rotate(180)" />
                <path d="M 0,-34 C 10,-34 19,-24 19,-11 C 19,-1 13,7 0,7 C -5,7 -10,4 -12,-1 C -10,-14 -5,-34 0,-34 Z" transform="rotate(240)" />
                <path d="M 0,-34 C 10,-34 19,-24 19,-11 C 19,-1 13,7 0,7 C -5,7 -10,4 -12,-1 C -10,-14 -5,-34 0,-34 Z" transform="rotate(300)" />
            </g>`;
    }

    function resetToIdle() {
        if (stateTimeout) clearTimeout(stateTimeout);
        clearAllLogoStates();
        aiLogo.classList.remove('success');
        resetLogoIcon();
        currentState = 'idle';
    }

    // ==========================================
    // 2. 音效系统 (Web Audio API)
    // ==========================================
    function playSuccessSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            osc.frequency.setValueAtTime(1320, ctx.currentTime + 0.08);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.4);
        } catch(e) { /* silent */ }
    }

    // ==========================================
    // 3. 粒子特效
    // ==========================================
    function spawnParticle() {
        const logoRect = aiLogo.getBoundingClientRect();
        const menuRect = menuBtn.getBoundingClientRect();

        const startX = logoRect.left + logoRect.width / 2;
        const startY = logoRect.top + logoRect.height / 2;
        const endX = menuRect.left + menuRect.width / 2;
        const endY = menuRect.top + menuRect.height / 2;

        const particle = document.createElement('div');
        particle.className = 'success-particle';
        particle.style.cssText = `
            left: ${startX}px; top: ${startY}px;
            transform: translate(-50%, -50%);
            animation: particleFly 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            --dx: ${endX - startX}px;
            --dy: ${endY - startY}px;
        `;
        document.body.appendChild(particle);

        // 临时修改 animation 使用计算出的终点
        const dx = endX - startX;
        const dy = endY - startY;
        particle.style.animation = 'none';
        particle.offsetHeight; // reflow
        particle.style.animation = `particleFlyCustom 0.85s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
        particle.style.setProperty('--dx', dx + 'px');
        particle.style.setProperty('--dy', dy + 'px');

        // 动画结束后清理
        setTimeout(() => {
            if (particle.parentNode) particle.parentNode.removeChild(particle);
        }, 900);
    }

    // 动态 keyframes（支持自定义终点）
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes particleFlyCustom {
            0% { transform: translate(-50%, -50%) translate(0, 0) scale(1); opacity: 1; }
            30% { transform: translate(-50%, -50%) translate(calc(var(--dx) * 0.3), calc(var(--dy) * 0.3 - 20px)) scale(1.5); opacity: 0.9; }
            70% { transform: translate(-50%, -50%) translate(calc(var(--dx) * 0.7), calc(var(--dy) * 0.7 - 10px)) scale(0.6); opacity: 0.4; }
            100% { transform: translate(-50%, -50%) translate(var(--dx), var(--dy)) scale(0.1); opacity: 0; }
        }
    `;
    document.head.appendChild(particleStyle);

    // ==========================================
    // 4. Toast 系统
    // ==========================================
    function showToast(type, message) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        let iconSvg = '';
        if (type === 'success') {
            iconSvg = '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
        } else if (type === 'error') {
            iconSvg = '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
        } else {
            iconSvg = '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
        }
        toast.innerHTML = iconSvg + `<span>${message}</span>`;
        toast.style.animationDuration = '0.35s, 2.8s';
        toastContainer.appendChild(toast);

        setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 2800);
    }

    // ==========================================
    // 5. 侧边栏控制
    // ==========================================
    function openSidebar() {
        sidebarOpen = true;
        sidebar.classList.add('open');
        overlay.classList.add('active');
        appShell.classList.add('sidebar-open');
        menuBtn.classList.add('open');
        if (timelineOpen) closeTimeline(false);
    }

    function closeSidebar() {
        sidebarOpen = false;
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        appShell.classList.remove('sidebar-open');
        menuBtn.classList.remove('open');
    }

    function toggleSidebar() {
        if (sidebarOpen) closeSidebar();
        else openSidebar();
    }

    // ==========================================
    // 6. 时光轴控制
    // ==========================================
    function openTimeline() {
        timelineOpen = true;
        timeline.classList.add('open');
        appShell.classList.add('timeline-open');
        if (window.innerWidth <= 480) overlay.classList.add('active');
        if (sidebarOpen) closeSidebar();
    }

    function closeTimeline(animate = true) {
        timelineOpen = false;
        timeline.classList.remove('open');
        if (window.innerWidth <= 480) overlay.classList.remove('active');
        if (!sidebarOpen) appShell.classList.remove('timeline-open');
    }

    // ==========================================
    // 7. 底部设置面板
    // ==========================================
    function toggleSettingsSheet() {
        sheetOpen = !sheetOpen;
        if (sheetOpen) {
            settingsSheet.classList.add('open');
            overlay.classList.add('active');
        } else {
            settingsSheet.classList.remove('open');
            overlay.classList.remove('active');
        }
    }

    // ==========================================
    // 8. 手势系统 (Touch)
    // ==========================================
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchCurrentX = touchStartX;
        touchActive = true;
        gestureType = null;
    }, { passive: true });

    document.addEventListener('touchmove', function(e) {
        if (!touchActive) return;
        touchCurrentX = e.touches[0].clientX;
        const deltaX = touchCurrentX - touchStartX;
        const deltaY = e.touches[0].clientY - touchStartY;
        const absDx = Math.abs(deltaX);
        const absDy = Math.abs(deltaY);

        if (absDx < 10 || absDx < absDy) return;

        if (deltaX > 0 && touchStartX < 40 && !sidebarOpen && !timelineOpen) {
            gestureType = 'sidebar';
            const progress = Math.min(deltaX / 280, 1);
            sidebar.style.transform = `translateX(${-100 + progress * 100}%)`;
            overlay.style.opacity = progress * 0.3;
        } else if (deltaX < 0 && !timelineOpen && !sidebarOpen) {
            gestureType = 'timeline';
            const progress = Math.min(Math.abs(deltaX) / 340, 1);
            timeline.style.transform = `translateX(${100 - progress * 100}%)`;
            if (window.innerWidth <= 480) overlay.style.opacity = progress * 0.3;
        } else if (deltaX > 0 && timelineOpen) {
            gestureType = 'timeline-close';
            const progress = Math.min(deltaX / 340, 1);
            timeline.style.transform = `translateX(${progress * 100}%)`;
            if (window.innerWidth <= 480) overlay.style.opacity = (1 - progress) * 0.3;
        }
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
        if (!touchActive) return;
        touchActive = false;
        const deltaX = touchCurrentX - touchStartX;

        if (gestureType === 'sidebar') {
            if (deltaX > 80) {
                openSidebar();
            } else {
                sidebar.style.transform = '';
                overlay.style.opacity = '';
            }
        } else if (gestureType === 'timeline') {
            if (Math.abs(deltaX) > 80) {
                openTimeline();
            } else {
                timeline.style.transform = '';
                if (window.innerWidth <= 480) overlay.style.opacity = '';
            }
        } else if (gestureType === 'timeline-close') {
            if (deltaX > 80) {
                closeTimeline();
                if (!sidebarOpen) appShell.classList.remove('timeline-open');
            } else {
                timeline.style.transform = '';
                if (window.innerWidth <= 480) overlay.style.opacity = '0.3';
            }
        }

        gestureType = null;
    });

    // ==========================================
    // 9. 事件绑定
    // ==========================================
    aiLogo.addEventListener('click', function(e) {
        e.stopPropagation();
        if (currentState === 'idle') triggerVoiceFlow();
    });

    aiLogo.addEventListener('touchstart', function(e) {
        longPressTimer = setTimeout(() => {
            if (currentState === 'idle') triggerVoiceFlow();
        }, 500);
    });
    aiLogo.addEventListener('touchend', function() {
        if (longPressTimer) clearTimeout(longPressTimer);
    });
    aiLogo.addEventListener('touchmove', function() {
        if (longPressTimer) clearTimeout(longPressTimer);
    });

    menuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleSidebar();
    });

    overlay.addEventListener('click', function() {
        if (sidebarOpen) closeSidebar();
        if (timelineOpen && window.innerWidth <= 480) {
            closeTimeline();
            appShell.classList.remove('timeline-open');
        }
        if (sheetOpen) toggleSettingsSheet();
    });

    timelineClose.addEventListener('click', function() {
        closeTimeline();
        if (!sidebarOpen) appShell.classList.remove('timeline-open');
    });

    sendBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const val = keyboardInput.value.trim();
        if (!val) return;
        keyboardInput.value = '';
        keyboardInput.blur();

        resetToIdle();
        setLogoState('processing');

        stateTimeout = setTimeout(() => {
            setLogoState('success');
            logoIcon.innerHTML = '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>';
            playSuccessSound();
            spawnParticle();
            showToast('success', `已记录: ${val}`);

            stateTimeout = setTimeout(() => {
                resetToIdle();
            }, 2000);
        }, 1200);
    });

    keyboardInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') sendBtn.click();
    });

    keyboardInput.addEventListener('focus', function() {
        aiLogo.classList.add('keyboard-active');
    });
    keyboardInput.addEventListener('blur', function() {
        setTimeout(() => {
            if (currentState === 'idle') {
                aiLogo.classList.remove('keyboard-active');
            }
        }, 150);
    });

    avatarBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleSettingsSheet();
    });

    document.querySelectorAll('.sidebar-nav-item').forEach(function(item) {
        item.addEventListener('click', function() {
            const nav = this.dataset.nav;
            document.querySelectorAll('.sidebar-nav-item').forEach(el => el.classList.remove('active'));
            this.classList.add('active');

            if (nav === 'timeline') {
                closeSidebar();
                setTimeout(() => openTimeline(), 350);
            } else if (nav === 'settings') {
                closeSidebar();
                setTimeout(() => toggleSettingsSheet(), 350);
            } else if (nav === 'stats') {
                closeSidebar();
                showToast('info', '统计分析 (即将推出)');
            } else if (nav === 'labels') {
                closeSidebar();
                showToast('info', '标签管理 (即将推出)');
            } else if (nav === 'home') {
                closeSidebar();
            }
        });
    });

    darkModeToggle.addEventListener('click', function() {
        this.classList.toggle('on');
        const isDark = this.classList.contains('on');
        if (isDark) {
            document.body.style.filter = 'invert(0.92) hue-rotate(180deg)';
            document.body.style.transition = 'filter 0.5s ease';
            showToast('info', '已切换深色模式 (实验性)');
        } else {
            document.body.style.filter = '';
            showToast('info', '已切换浅色模式');
        }
    });

    stage.addEventListener('click', function(e) {
        if (e.target === stage) {
            if (sidebarOpen) closeSidebar();
            if (timelineOpen) { closeTimeline(); appShell.classList.remove('timeline-open'); }
        }
    });

    // 设置面板项点击
    document.querySelectorAll('.sheet-item[data-sheet-action]').forEach(function(item) {
        item.addEventListener('click', function() {
            const action = this.dataset.sheetAction;
            const messages = {
                voice: '语音设置 (即将推出)',
                data: '数据管理 (即将推出)',
                notifications: '通知管理 (即将推出)',
                about: '关于钦会 Dium v0.1.0'
            };
            showToast('info', messages[action] || '即将推出');
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (sheetOpen) toggleSettingsSheet();
            if (sidebarOpen) closeSidebar();
            if (timelineOpen) { closeTimeline(); appShell.classList.remove('timeline-open'); }
            keyboardInput.blur();
            if (currentState !== 'idle') resetToIdle();
        }
    });

    // ==========================================
    // 10. 初始化
    // ==========================================
    console.log('钦会 Dium — AI Native 事务管理系统');
    console.log('手势: 右滑=菜单 | 左滑=时光轴 | 点击Logo=语音录入 | 长按Logo=按住说话');
    console.log('键盘: ESC=关闭所有面板 | Enter=提交文字');
})();
