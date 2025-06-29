// Portfolio Application
class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        console.log("✅ Portfolio JS loaded successfully");
        
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        this.initTheme();
        this.initNavigation();
        this.initCursor();
        this.initScrollAnimations();
        this.initProjectModals();
        this.initContactForm();
        this.initSmoothScrolling();
    }

    // Theme Management
    initTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        const currentTheme = localStorage.getItem('theme') || 'light';
        
        // Set initial theme
        document.documentElement.setAttribute('data-theme', currentTheme);
        this.updateThemeIcon(currentTheme);

        themeToggle?.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.updateThemeIcon(newTheme);
        });
    }

    updateThemeIcon(theme) {
        const themeToggle = document.getElementById('theme-toggle');
        const icon = themeToggle?.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    // Navigation
    initNavigation() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        const navbar = document.getElementById('navbar');

        // Mobile menu toggle
        navToggle?.addEventListener('click', () => {
            navMenu?.classList.toggle('active');
            navToggle?.classList.toggle('active');
        });

        // Close mobile menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu?.classList.remove('active');
                navToggle?.classList.remove('active');
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar?.classList.add('scrolled');
            } else {
                navbar?.classList.remove('scrolled');
            }
        });

        // Active nav link on scroll
        this.updateActiveNavLink();
        window.addEventListener('scroll', () => this.updateActiveNavLink());
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Custom Cursor
    initCursor() {
        const cursor = document.querySelector('.cursor');
        const cursorFollower = document.querySelector('.cursor-follower');

        if (!cursor || !cursorFollower) return;

        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        // Smooth follower animation
        const animateFollower = () => {
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';
            
            requestAnimationFrame(animateFollower);
        };
        animateFollower();

        // Cursor hover effects
        const hoverElements = document.querySelectorAll('a, button, .project-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(2)';
                cursorFollower.style.transform = 'scale(1.5)';
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursorFollower.style.transform = 'scale(1)';
            });
        });
    }

    // Scroll Animations
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Add fade-in class to elements
        const animatedElements = document.querySelectorAll(`
            .hero-content,
            .hero-visual,
            .section-header,
            .about-text,
            .about-visual,
            .project-card,
            .contact-info,
            .contact-form
        `);

        animatedElements.forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });

        // Animate stats counter
        this.animateCounters();
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const text = element.textContent;
        const target = parseInt(text.replace(/\D/g, ''));
        const suffix = text.replace(/\d/g, '');
        
        let current = 0;
        const increment = target / 50;
        
        const timer = setInterval(() => {
            current += increment;
            element.textContent = Math.floor(current) + suffix;
            
            if (current >= target) {
                element.textContent = target + suffix;
                clearInterval(timer);
            }
        }, 30);
    }

    // Project Modals
    initProjectModals() {
        const modal = document.getElementById('project-modal');
        const modalBody = document.getElementById('modal-body');
        const modalClose = document.getElementById('modal-close');
        const projectCards = document.querySelectorAll('[data-project]');

        // Open modal
        projectCards.forEach(card => {
            card.addEventListener('click', () => {
                const projectId = card.getAttribute('data-project');
                this.openProjectModal(projectId, modal, modalBody);
            });
        });

        // Close modal
        modalClose?.addEventListener('click', () => {
            this.closeModal(modal);
        });

        // Close on backdrop click
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal(modal);
            }
        });
    }

    openProjectModal(projectId, modal, modalBody) {
        const projectData = this.getProjectData(projectId);
        modalBody.innerHTML = this.createModalContent(projectData);
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    getProjectData(projectId) {
        const projects = {
            project1: {
                title: 'E-commerce Platform',
                year: '2024',
                type: 'Web Development',
                description: 'A comprehensive e-commerce solution with modern design and advanced features.',
                longDescription: 'This full-featured e-commerce platform includes user authentication, product catalog, shopping cart, payment integration, order management, and admin dashboard. Built with React for the frontend, Node.js/Express for the backend, and PostgreSQL for data storage.',
                image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
                technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'AWS'],
                features: [
                    'User authentication and authorization',
                    'Product catalog with search and filtering',
                    'Shopping cart and checkout process',
                    'Payment integration with Stripe',
                    'Order management system',
                    'Admin dashboard for inventory management'
                ],
                liveUrl: '#',
                githubUrl: '#'
            },
            project2: {
                title: 'Task Management App',
                year: '2024',
                type: 'Mobile App',
                description: 'Collaborative task management with real-time updates and team features.',
                longDescription: 'This task management application enables teams to collaborate effectively with real-time updates, task assignments, progress tracking, and team communication features. Built with React Native for cross-platform compatibility.',
                image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
                technologies: ['React Native', 'Firebase', 'Socket.io', 'Redux'],
                features: [
                    'Real-time collaboration',
                    'Task assignment and tracking',
                    'Team communication',
                    'Progress visualization',
                    'File sharing capabilities',
                    'Cross-platform compatibility'
                ],
                liveUrl: '#',
                githubUrl: '#'
            },
            project3: {
                title: 'Analytics Dashboard',
                year: '2023',
                type: 'Dashboard',
                description: 'Interactive data visualization and business intelligence platform.',
                longDescription: 'This comprehensive analytics dashboard provides interactive data visualization, real-time metrics, and business intelligence insights. Features custom charts, filters, and exportable reports for data-driven decision making.',
                image: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
                technologies: ['Vue.js', 'D3.js', 'Python', 'FastAPI', 'MongoDB'],
                features: [
                    'Interactive data visualizations',
                    'Real-time metrics and KPIs',
                    'Custom filtering and sorting',
                    'Exportable reports',
                    'Role-based access control',
                    'Responsive design for all devices'
                ],
                liveUrl: '#',
                githubUrl: '#'
            }
        };

        return projects[projectId] || {};
    }

    createModalContent(project) {
        return `
            <div class="project-modal-content">
                <img src="${project.image}" alt="${project.title}" style="width: 100%; height: 300px; object-fit: cover; border-radius: var(--radius); margin-bottom: var(--space-lg);">
                
                <div style="margin-bottom: var(--space-lg);">
                    <div style="display: flex; gap: var(--space-md); margin-bottom: var(--space-sm); font-size: 0.9rem; color: var(--text-muted);">
                        <span>${project.year}</span>
                        <span>•</span>
                        <span>${project.type}</span>
                    </div>
                    <h2 style="font-family: var(--font-display); font-size: 2rem; font-weight: 700; color: var(--text-primary); margin-bottom: var(--space-md);">${project.title}</h2>
                    <p style="color: var(--text-secondary); line-height: 1.7; font-size: 1.1rem;">${project.longDescription}</p>
                </div>
                
                <div style="margin-bottom: var(--space-lg);">
                    <h3 style="color: var(--text-primary); margin-bottom: var(--space-sm); font-weight: 600;">Technologies Used</h3>
                    <div style="display: flex; flex-wrap: wrap; gap: var(--space-xs);">
                        ${project.technologies.map(tech => `<span style="background: var(--bg-secondary); color: var(--text-secondary); padding: 0.25rem 0.75rem; border-radius: var(--radius); font-size: 0.8rem; font-weight: 500;">${tech}</span>`).join('')}
                    </div>
                </div>
                
                <div style="margin-bottom: var(--space-xl);">
                    <h3 style="color: var(--text-primary); margin-bottom: var(--space-sm); font-weight: 600;">Key Features</h3>
                    <ul style="color: var(--text-secondary); padding-left: var(--space-md); line-height: 1.6;">
                        ${project.features.map(feature => `<li style="margin-bottom: var(--space-xs);">${feature}</li>`).join('')}
                    </ul>
                </div>
                
                <div style="display: flex; gap: var(--space-md); flex-wrap: wrap;">
                    <a href="${project.liveUrl}" class="btn-primary" target="_blank" style="text-decoration: none;">
                        <span>Live Demo</span>
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                    <a href="${project.githubUrl}" class="btn-secondary" target="_blank" style="text-decoration: none;">
                        <span>View Code</span>
                        <i class="fab fa-github"></i>
                    </a>
                </div>
            </div>
        `;
    }

    // Contact Form
    initContactForm() {
        const form = document.getElementById('contact-form');
        
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
            submitBtn.disabled = true;

            try {
                // Simulate API call
                await this.simulateFormSubmission(data);
                
                // Show success message
                this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                form.reset();
                
            } catch (error) {
                // Show error message
                this.showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
            } finally {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    async simulateFormSubmission(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form submitted with data:', data);
                resolve();
            }, 1500);
        });
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--primary)' : '#ef4444'};
            color: white;
            padding: var(--space-md) var(--space-lg);
            border-radius: var(--radius);
            box-shadow: 0 10px 25px var(--shadow-lg);
            z-index: 2000;
            animation: slideInRight 0.3s ease-out;
            display: flex;
            align-items: center;
            gap: var(--space-xs);
            font-weight: 500;
        `;
        
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Smooth Scrolling
    initSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const navHeight = document.getElementById('navbar').offsetHeight;
                    const targetPosition = targetElement.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Initialize the application
new PortfolioApp();