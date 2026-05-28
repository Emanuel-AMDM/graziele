/**
 * ========================================================================
 * CLÍNICA DE BELEZA PREMIUM - Sorocaba/SP (Bairro Trujillo)
 * Comportamentos Dinâmicos e UX 2026
 * ========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. CONFIGURAÇÕES E SELETORES ---
    const header = document.getElementById('header');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const statusBadge = document.getElementById('status-badge');
    const statusText = document.getElementById('status-text');

    // --- 2. MENU MOBILE RESPONSIVO ---
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            mobileToggle.setAttribute('aria-expanded', isOpen);
            
            // Transformação do ícone de hambúrguer em X
            const spans = mobileToggle.querySelectorAll('span');
            if (isOpen) {
                spans[0].style.transform = 'translateY(6px) rotate(45deg)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'translateY(-6px) rotate(-45deg)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Fechar o menu ao clicar em qualquer link de navegação
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                mobileToggle.setAttribute('aria-expanded', 'false');
                
                const spans = mobileToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }


    // --- 3. ENCOLHIMENTO DO HEADER NO SCROLL (Shrink) ---
    const handleHeaderScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('shrink');
        } else {
            header.classList.remove('shrink');
        }
    };
    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll(); // Executa no carregamento inicial


    // --- 4. SCROLL REVEAL (Animação de Aparição Suave) ---
    // Usando a API nativa Intersection Observer para alta performance
    const revealOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Deixa de observar uma vez que já foi revelado para otimizar desempenho
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    // Registra todos os elementos que devem ser revelados no scroll
    const elementsToReveal = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    elementsToReveal.forEach(el => revealObserver.observe(el));


    // --- 5. LINK ATIVO CONFORME NAVEGAÇÃO DE ROLAGEM (Active State) ---
    const sections = document.querySelectorAll('section[id]');
    
    const handleActiveLinkHighlight = () => {
        const scrollY = window.scrollY;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120; // Ajusta compensação do header fixo
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector(`.nav-link[href*=${sectionId}]`)?.classList.add('active');
            } else {
                document.querySelector(`.nav-link[href*=${sectionId}]`)?.classList.remove('active');
            }
        });
    };
    window.addEventListener('scroll', handleActiveLinkHighlight);
    handleActiveLinkHighlight(); // Executa inicialização


    // --- 6. VERIFICAÇÃO INTELIGENTE DE HORÁRIO DE FUNCIONAMENTO ---
    const checkOpeningHours = () => {
        if (!statusBadge || !statusText) return;

        const now = new Date();
        const day = now.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const currentTimeDecimal = hours + minutes / 60;

        let isOpen = false;

        if (day >= 1 && day <= 5) {
            // Segunda a Sexta: 08:00 às 20:00
            if (currentTimeDecimal >= 8 && currentTimeDecimal < 20) {
                isOpen = true;
            }
        } else if (day === 6) {
            // Sábado: 08:00 às 17:00
            if (currentTimeDecimal >= 8 && currentTimeDecimal < 17) {
                isOpen = true;
            }
        }
        // Domingo: Fechado

        if (isOpen) {
            statusBadge.classList.remove('closed');
            statusText.textContent = 'Aberto Agora';
            
            // Adiciona a classe ping no pontinho dinamicamente
            const dot = statusBadge.querySelector('.status-dot');
            if (dot) dot.classList.add('ping');
        } else {
            statusBadge.classList.add('closed');
            statusText.textContent = 'Fechado Agora';
            
            const dot = statusBadge.querySelector('.status-dot');
            if (dot) dot.classList.remove('ping');
        }
    };

    // Executa e atualiza a cada 1 minuto
    checkOpeningHours();
    setInterval(checkOpeningHours, 60000);


    // --- 7. MICRO-INTERAÇÕES NOS BOTÕES (Efeito Shimmer) ---
    // Adiciona interatividade tátil opcional para telas de toque
    const actionButtons = document.querySelectorAll('.btn');
    actionButtons.forEach(btn => {
        btn.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        }, { passive: true });
        
        btn.addEventListener('touchend', function() {
            this.style.transform = 'none';
        }, { passive: true });
    });
});
